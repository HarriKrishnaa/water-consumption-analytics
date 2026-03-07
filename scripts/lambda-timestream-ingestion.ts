/**
 * Lambda: Timestream Ingestion
 * Triggered by: KDA (Kinesis Data Analytics) stream with anomaly flags
 * Purpose: Ingest water meter readings + anomaly detection results into AWS Timestream
 */

import {
  TimestreamWriteClient,
  WriteRecordsCommand,
  Record,
} from '@aws-sdk/client-timestream-write';

const tsClient = new TimestreamWriteClient({ region: process.env.AWS_REGION });

interface AnalyticsRecord {
  flat_id: string;
  meter_id: string;
  event_time: string;
  current_usage: number;
  baseline_usage: number;
  anomaly_flag: boolean;
}

interface LambdaEvent {
  Records: Array<{
    kinesis: {
      data: string; // base64-encoded JSON
    };
  }>;
}

/**
 * Convert Kinesis data to Timestream records
 */
function parseKinesisRecord(kinesisData: string): AnalyticsRecord {
  const json = JSON.parse(Buffer.from(kinesisData, 'base64').toString('utf8'));
  return json as AnalyticsRecord;
}

/**
 * Create Timestream record from analytics data
 */
function createTimestreamRecord(data: AnalyticsRecord): Record {
  const timestamp = new Date(data.event_time).getTime().toString();

  return {
    Dimensions: [
      { Name: 'flat_id', Value: data.flat_id },
      { Name: 'meter_id', Value: data.meter_id },
    ],
    MeasureName: 'water_consumption',
    MeasureValue: data.current_usage.toString(),
    MeasureValueType: 'DOUBLE',
    Time: timestamp,
    TimeUnit: 'MILLISECONDS',
  };
}

/**
 * Create anomaly flag record
 */
function createAnomalyRecord(data: AnalyticsRecord): Record {
  const timestamp = new Date(data.event_time).getTime().toString();

  return {
    Dimensions: [
      { Name: 'flat_id', Value: data.flat_id },
      { Name: 'meter_id', Value: data.meter_id },
    ],
    MeasureName: 'anomaly_flag',
    MeasureValue: data.anomaly_flag ? '1' : '0',
    MeasureValueType: 'BIGINT',
    Time: timestamp,
    TimeUnit: 'MILLISECONDS',
  };
}

/**
 * Lambda handler
 */
export const handler = async (event: LambdaEvent) => {
  console.log('Timestream ingestion Lambda triggered');
  console.log(`Processing ${event.Records.length} records`);

  const records: Record[] = [];

  try {
    // Parse all Kinesis records
    for (const record of event.Records) {
      const data = parseKinesisRecord(record.kinesis.data);
      console.log(`Processing flat ${data.flat_id}: ${data.current_usage}L (anomaly: ${data.anomaly_flag})`);

      // Add consumption measure
      records.push(createTimestreamRecord(data));

      // Add anomaly flag measure
      records.push(createAnomalyRecord(data));
    }

    // Write to Timestream
    const writeRecordsResponse = await tsClient.send(
      new WriteRecordsCommand({
        DatabaseName: process.env.TIMESTREAM_DB || 'aquaflow_ai',
        TableName: process.env.TIMESTREAM_TABLE || 'water_meter_readings',
        Records: records,
      })
    );

    console.log(`Successfully wrote ${records.length} records to Timestream`);
    console.log(`Write response:`, writeRecordsResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Ingested ${records.length} measures for ${event.Records.length} water meter readings`,
        recordsWritten: records.length,
      }),
    };
  } catch (error) {
    console.error('Error writing to Timestream:', error);
    throw error;
  }
};
