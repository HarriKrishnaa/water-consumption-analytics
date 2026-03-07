/**
 * Lambda: Night Leak Detection (3 AM Daily)
 * Trigger: EventBridge Rule (cron: 0 21 * * ? UTC = 3 AM IST)
 * Purpose: Detect water leaks during night hours (2-4 AM) by analyzing Timestream data
 */

import {
  TimestreamQueryClient,
  QueryCommand,
} from '@aws-sdk/client-timestream-query';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { v4 as uuidv4 } from 'uuid';

const tsQueryClient = new TimestreamQueryClient({ region: process.env.AWS_REGION });
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const sesClient = new SESClient({ region: process.env.AWS_REGION });

interface LeakAlert {
  flat_id: string;
  avg_night_7d: number;
  last_night_liters: number;
  spike_ratio: number;
}

/**
 * Query Timestream for night consumption (2-4 AM) data
 */
async function queryNightConsumption(): Promise<LeakAlert[]> {
  const query = `
    WITH night_data AS (
      SELECT
        flat_id,
        BIN(time, 1d) AS day,
        SUM(measure_value::double) AS night_liters
      FROM "${process.env.TIMESTREAM_DB}"."
${process.env.TIMESTREAM_TABLE}"
      WHERE time BETWEEN ago(8d) AND now()
        AND measure_name = 'water_consumption'
        AND EXTRACT(hour FROM time) BETWEEN 2 AND 3
      GROUP BY flat_id, BIN(time, 1d)
    ),
    last7 AS (
      SELECT flat_id,
             AVG(night_liters) AS avg_night_7d,
             STDDEV(night_liters) AS stddev_night
      FROM night_data
      WHERE day < BIN(now(), 1d)
      GROUP BY flat_id
    ),
    last_night AS (
      SELECT flat_id,
             night_liters AS last_night_liters
      FROM night_data
      WHERE day = BIN(now(), 1d)
    )
    SELECT l.flat_id,
           l.avg_night_7d,
           n.last_night_liters,
           CASE WHEN l.avg_night_7d > 0
                THEN n.last_night_liters / l.avg_night_7d
                ELSE 0 END AS spike_ratio
    FROM last7 l
    LEFT JOIN last_night n ON l.flat_id = n.flat_id
    WHERE n.last_night_liters > 50
       OR (l.avg_night_7d > 0 AND n.last_night_liters > 3 * l.avg_night_7d)
    ORDER BY spike_ratio DESC
  `;

  console.log('Executing Timestream query for night leaks...');

  const results = await tsQueryClient.send(
    new QueryCommand({ QueryString: query })
  );

  const leakAlerts: LeakAlert[] = [];

  if (results.Rows) {
    for (const row of results.Rows) {
      const data: any = {};
      if (results.ColumnInfo) {
        results.ColumnInfo.forEach((col, i) => {
          data[col.Name] = row.Data?.[i]?.ScalarValue;
        });
      }
      leakAlerts.push({
        flat_id: data.flat_id,
        avg_night_7d: parseFloat(data.avg_night_7d) || 0,
        last_night_liters: parseFloat(data.last_night_liters) || 0,
        spike_ratio: parseFloat(data.spike_ratio) || 0,
      });
    }
  }

  console.log(`Found ${leakAlerts.length} potential leak candidates`);
  return leakAlerts;
}

/**
 * Store alert in DynamoDB
 */
async function storeAlert(leak: LeakAlert): Promise<void> {
  const alertId = `${leak.flat_id}#${Date.now()}`;
  const timestamp = new Date().toISOString();

  await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE || 'aquaflow_alerts',
      Item: {
        alert_id: { S: alertId },
        flat_id: { S: leak.flat_id },
        timestamp: { S: timestamp },
        alert_type: { S: 'NIGHT_LEAK' },
        severity: { S: leak.spike_ratio > 3 ? 'CRITICAL' : 'HIGH' },
        status: { S: 'OPEN' },
        current_usage: { N: String(leak.last_night_liters) },
        baseline_usage: { N: String(leak.avg_night_7d) },
        spike_ratio: { N: String(leak.spike_ratio) },
        notes: { S: `Night leak detected at 3 AM. Possible pipe leak or faulty valve.` },
      },
    })
  );

  console.log(`Alert stored for flat ${leak.flat_id}`);
}

/**
 * Send SES email notification
 */
async function sendEmailAlert(leak: LeakAlert): Promise<void> {
  const subject = `AquaFlow AI – CRITICAL: Night Leak Detected in ${leak.flat_id}`;
  const htmlBody = `
    <html>
      <head></head>
      <body>
        <h2>Water Leak Alert</h2>
        <p><strong>Flat ID:</strong> ${leak.flat_id}</p>
        <p><strong>Alert Time:</strong> 2-4 AM IST (Night Hours)</p>
        <p><strong>Last Night Usage:</strong> ${leak.last_night_liters.toFixed(2)} Liters</p>
        <p><strong>7-Day Average:</strong> ${leak.avg_night_7d.toFixed(2)} Liters</p>
        <p><strong>Spike Ratio:</strong> ${leak.spike_ratio.toFixed(2)}x baseline</p>
        <p><strong>Status:</strong> ${leak.spike_ratio > 3 ? 'CRITICAL - Immediate Action Required' : 'HIGH - Please Investigate'}</p>
        <p>Potential causes:</p>
        <ul>
          <li>Leaking pipe or joint</li>
          <li>Running toilet or dripping faucet</li>
          <li>Water heater leak</li>
          <li>Meter malfunction</li>
        </ul>
        <p>Next Steps:</p>
        <ol>
          <li>Check all visible plumbing in the flat</li>
          <li>Contact a plumber if leak is suspected</li>
          <li>Notify the society manager: manager@aquaflow.ai</li>
        </ol>
        <p>Login to your account to view detailed charts and historical data.</p>
      </body>
    </html>
  `;

  await sesClient.send(
    new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL || 'alerts@aquaflow.ai',
      Destination: {
        ToAddresses: [
          `owner_${leak.flat_id}@example.com`,
          'manager@aquaflow.ai',
        ],
      },
      Message: {
        Subject: { Data: subject },
        Body: { Html: { Data: htmlBody } },
      },
    })
  );

  console.log(`Email sent for ${leak.flat_id}`);
}

/**
 * Lambda handler
 */
export const handler = async (event: any) => {
  console.log(`[${new Date().toISOString()}] Night Leak Detection Lambda triggered`);

  try {
    // Query Timestream for night leaks
    const leaks = await queryNightConsumption();

    if (leaks.length === 0) {
      console.log('No leaks detected tonight. All flats normal.');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No leaks detected', count: 0 }),
      };
    }

    // Process each leak
    for (const leak of leaks) {
      console.log(`Processing leak for ${leak.flat_id}: ${leak.spike_ratio.toFixed(2)}x baseline`);

      // Store in DynamoDB
      await storeAlert(leak);

      // Send email notification
      await sendEmailAlert(leak);
    }

    console.log(`Night leak detection complete. ${leaks.length} alerts sent.`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Leak detection completed`,
        alertsCreated: leaks.length,
        affectedFlats: leaks.map((l) => l.flat_id),
      }),
    };
  } catch (error) {
    console.error('Error in leak detection:', error);
    throw error;
  }
};
