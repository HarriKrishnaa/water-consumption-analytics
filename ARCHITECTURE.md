# AquaFlow AI - Architecture Documentation

## System Overview

AquaFlow AI is a scalable AWS-based data engineering and analytics platform for water consumption monitoring and leak detection in apartment buildings.

## Pipeline Flow

```
Smart Water Meter
    ↓
AWS IoT Core (device ingestion)
    ↓
Kinesis Data Streams (real-time stream ingestion)
    ↓
Kinesis Data Analytics (real-time anomaly detection)
    ↓
┌───────────────────┬──────────────────┬─────────────────┐
↓                   ↓                  ↓                 ↓
Timestream    DynamoDB (alerts)   S3 (raw archive)    Lambda
(time-series) (alert tracking)    (Parquet storage)   (processors)
    ↓                   ↓                  ↓
    └───────────────────┼──────────────────┘
                        ↓
                  Glue ETL Job
                  (monthly aggregation)
                        ↓
                   S3 Analytics
                  (aggregated data)
                        ↓
                     Athena
                   (SQL queries)
                        ↓
            ┌──────────┴──────────┐
            ↓                     ↓
        API Gateway          QuickSight
            ↓                     ↓
      Next.js Dashboard    Business Analytics
```

## Component Details

### 1. Data Ingestion Layer

**AWS IoT Core**
- Secure MQTT endpoint for water meter devices
- Device authentication via X.509 certificates
- Topic: `aquaflow/meters/{flat_id}/{meter_id}`
- IoT Rules Engine routes data to Kinesis

**Kinesis Data Streams**
- Stream name: `aquaflow-meters-stream`
- Partition key: `flat_id` (ensures ordering per flat)
- Retention period: 24 hours

### 2. Real-Time Stream Processing

**Kinesis Data Analytics**
- Detects anomalies using 7-day rolling baseline
- Flags consumption > 3x baseline as anomaly
- Output stream: `aquaflow-analytics-stream`
- Latency: ~1 minute from event to processing

**Anomaly Detection Logic**
```sql
BASELINE = AVG(consumption) OVER LAST 7 DAYS PER FLAT
IF current_consumption > 3 * BASELINE THEN
  ANOMALY_FLAG = TRUE
ELSE
  ANOMALY_FLAG = FALSE
END IF
```

### 3. Time-Series Storage

**AWS Timestream**
- Database: `aquaflow_ai`
- Table: `water_meter_readings`
- Retention: 30 days hot, archive to S3 after
- Dimensions: flat_id, meter_id, location
- Measures: water_consumption, anomaly_flag

**Sample Query**: Hourly consumption trend
```sql
SELECT BIN(time, 1h) AS hour,
       SUM(measure_value::double) AS liters
FROM aquaflow_ai.water_meter_readings
WHERE flat_id = 'A-101'
  AND time > ago(24h)
GROUP BY BIN(time, 1h)
```

### 4. Raw Data Archival

**S3 Bucket: aquaflow-data**
- Path: `raw/year={YYYY}/month={MM}/day={DD}/`
- Format: Parquet (via Kinesis Firehose)
- Purpose: Billing, compliance, historical analysis
- Lifecycle: Move to Glacier after 90 days

### 5. ETL Processing

**AWS Glue Job**
- Trigger: Monthly at start of month
- Input: Raw Parquet files from S3
- Operations:
  - Calculate monthly usage per flat
  - Compute building total
  - Calculate percentage share
  - Count anomalies
- Output: `s3://aquaflow-analytics/monthly/year={Y}/month={M}/`

### 6. Query Layer

**Amazon Athena**
- Queries run over S3 Parquet files
- Uses Glue Data Catalog for table metadata
- Cost: ~$5 per TB of data scanned

**Key Queries**
- Highest consumption: `SELECT flat_id, MAX(usage) FROM metrics GROUP BY flat_id ORDER BY MAX DESC`
- Leak patterns: `SELECT * FROM readings WHERE hour(time) BETWEEN 2 AND 4 AND usage > 50L`
- Building comparison: `SELECT flat_id, monthly_usage, building_share_percentage FROM monthly_agg`

### 7. Alert Management

**DynamoDB Table: aquaflow_alerts**
- Partition key: `flat_id`
- Sort key: `timestamp`
- Attributes: alert_type, severity, status, notes
- TTL: 90 days

**Alert Types**
- `ANOMALY_3X_BASELINE`: Usage spike detection
- `NIGHT_LEAK`: 2-4 AM usage > 50L

### 8. Leak Detection (3 AM Lambda)

**Trigger**: Daily EventBridge rule at 3:00 AM IST
**Process**:
1. Query Timestream for last 7 nights (2-4 AM) per flat
2. Calculate 7-day average night usage
3. Get last night's 2-4 AM consumption
4. If last_night > 50L, flag as leak
5. Write alert to DynamoDB
6. Send notification via SES/Pinpoint

**Notification Recipients**:
- Flat owner (email)
- Society manager (email + SMS via Pinpoint)

### 9. Notification Service

**AWS SES** (Simple Email Service)
- Send alert emails
- From: alerts@aquaflow.ai

**AWS Pinpoint**
- Push notifications
- SMS alerts
- Campaign management

## Dashboard Architecture

**Tech Stack**
- Frontend: Next.js 14+ (App Router)
- UI: React + Tailwind CSS + ShadCN
- Charts: Recharts
- State: React hooks + fetch API
- Refresh: 30s polling interval

**Pages**
1. Dashboard: Real-time metrics and trends
2. Leak Alerts: Alert management and history
3. Deep Analytics: Advanced consumption analysis

**Dark Theme**
- Primary: Slate (bg-slate-950)
- Accent: Sky blue (text-sky-400)
- Status: Green (ok), Orange (warning), Red (critical)

## Deployment Strategy

### AWS Account Setup
```bash
# Create resource stack
aws cloudformation create-stack \
  --stack-name aquaflow-ai \
  --template-body file://infrastructure/cloudformation.yaml
```

### Environment Variables (.env.local)
```
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=***
AWS_SECRET_ACCESS_KEY=***

# Services
IOT_ENDPOINT=your-endpoint.iot.ap-south-1.amazonaws.com
KINESIS_STREAM=aquaflow-meters-stream
TIMESTREAM_DB=aquaflow_ai
TIMESTREAM_TABLE=water_meter_readings
DYNAMODB_TABLE=aquaflow_alerts
S3_BUCKET=aquaflow-data
ANALYTICS_BUCKET=aquaflow-analytics

# SES
SES_FROM_EMAIL=alerts@aquaflow.ai
SES_REGION=ap-south-1
```

## Cost Estimation (Monthly)

| Service | Volume | Estimated Cost |
|---------|--------|----------------|
| IoT Core | 1M messages | $10 |
| Kinesis | 1.2GB | $50 |
| Timestream | 100M points | $150 |
| Glue | 2 jobs, 1 hour each | $0.50 |
| Athena | 10GB scanned | $50 |
| DynamoDB | On-demand, 1000 alerts/month | $5 |
| Lambda | Leak detection 1x/day | $0.20 |
| SES | 100 emails | $1 |
| S3 | 50GB storage | $1 |
| **Total** | | **~$268** |

## Security Best Practices

1. **IoT Core**: Use X.509 certificates, rotate quarterly
2. **Data Encryption**: Enable default encryption on S3, DynamoDB, Timestream
3. **IAM Policies**: Least privilege per Lambda function
4. **VPC**: Optional - consider VPC endpoints for private connectivity
5. **Monitoring**: CloudWatch metrics for all services
6. **Audit Logging**: Enable CloudTrail for API calls

## Monitoring & Alerting

**CloudWatch Dashboards**
- Stream throughput and latency
- Lambda execution duration
- Athena query performance
- DynamoDB throttling

**Critical Alerts**
- Kinesis shard iterator expiration
- Lambda function errors > 5%
- Timestream write capacity exceeded
- S3 bucket size growth > 1TB/day

## Scaling Considerations

- **Multi-region**: Replicate to other regions for DR
- **Sharding**: Auto-scale Kinesis based on traffic
- **Timestream**: Partition on flat_id for faster queries
- **Athena**: Use Parquet partitioning year/month/day
- **DynamoDB**: Auto-scale read/write capacity

## Future Enhancements

1. Machine Learning anomaly detection (SageMaker)
2. Predictive maintenance (forecast usage trends)
3. IoT device management (Fleet Provisioning)
4. Real-time WebSocket dashboard (AppSync)
5. Mobile app (React Native)
6. Voice alerts (Polly + Connect)
