"""
AWS Glue ETL Job - Monthly Water Consumption Aggregation
Trigger: Monthly (1st day of month at 02:00 UTC)
Input: Raw Parquet files from s3://aquaflow-data/raw/
Output: Monthly aggregations to s3://aquaflow-analytics/monthly/
"""

import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame
from pyspark.sql.functions import (
    col,
    sum as spark_sum,
    count,
    avg,
    year,
    month,
    round as spark_round,
    when,
)
from pyspark.sql.window import Window

# Get Glue job arguments
args = getResolvedOptions(
    sys.argv,
    [
        "JOB_NAME",
        "input_bucket",
        "output_bucket",
    ],
)

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args["JOB_NAME"], args)

input_bucket = args.get("input_bucket", "aquaflow-data")
output_bucket = args.get("output_bucket", "aquaflow-analytics")

print(f"\n=== Monthly Aggregation Job Started ===")
print(f"Input Bucket: {input_bucket}")
print(f"Output Bucket: {output_bucket}")

try:
    # Read raw Parquet files from S3
    input_path = f"s3://{input_bucket}/raw/"
    print(f"\nReading from: {input_path}")
    
    raw_df = spark.read.parquet(input_path)
    print(f"Loaded {raw_df.count()} records from raw bucket")
    
    # Extract year and month
    df = raw_df.withColumn("year", year(col("timestamp"))).withColumn(
        "month", month(col("timestamp"))
    )
    
    # Calculate monthly aggregations
    monthly_agg = (
        df.groupBy("year", "month", "flat_id")
        .agg(
            spark_sum("water_consumption_liters").alias("monthly_usage"),
            count(when(col("anomaly_flag") == True, 1)).alias("anomaly_count"),
        )
        .withColumn(
            "building_total",
            spark_sum("monthly_usage").over(
                Window.partitionBy("year", "month")
            ),
        )
    )
    
    # Calculate percentage share
    monthly_agg = monthly_agg.withColumn(
        "building_share_percentage",
        spark_round(
            (col("monthly_usage") / col("building_total")) * 100, 2
        ),
    ).drop("building_total")
    
    # Select final columns
    final_df = monthly_agg.select(
        col("year"),
        col("month"),
        col("flat_id"),
        col("monthly_usage").cast("double"),
        col("building_share_percentage"),
        col("anomaly_count"),
    )
    
    print(f"\nMonthly aggregation completed: {final_df.count()} rows")
    
    # Write to output bucket with partitioning
    output_path = f"s3://{output_bucket}/monthly/"
    print(f"Writing to: {output_path}")
    
    final_df.coalesce(1).write.partitionBy("year", "month").mode(
        "overwrite"
    ).parquet(output_path)
    
    print("\n=== Successfully completed monthly aggregation ===")
    print(f"Output saved to: {output_path}")
    
except Exception as e:
    print(f"\nERROR in Glue job: {str(e)}")
    raise

finally:
    job.commit()
    print("\nGlue job committed.")
