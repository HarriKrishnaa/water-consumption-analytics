/**
 * IoT Device Simulator - Water Meter Data Generator
 * 
 * Simulates multiple apartment water meters sending consumption readings
 * to AWS IoT Core via MQTT (emulated via HTTP for demo purposes)
 */

import { IoTDataPlaneClient, PublishCommand } from '@aws-sdk/client-iot-data-plane';
import { v4 as uuidv4 } from 'uuid';

interface SimulatorConfig {
  endpoint: string;
  region: string;
  flats: string[];
  meterIds: Map<string, string>;
  publishIntervalMs: number; // How often to send readings
}

interface WaterReading {
  flat_id: string;
  meter_id: string;
  timestamp: string;
  water_consumption_liters: number;
  location: string;
}

class IotDeviceSimulator {
  private client: IoTDataPlaneClient;
  private config: SimulatorConfig;
  private timers: Map<string, NodeJS.Timer> = new Map();

  constructor(config: SimulatorConfig) {
    this.config = config;
    this.client = new IoTDataPlaneClient({ region: config.region });
  }

  /**
   * Generate realistic water consumption for a flat
   * Normal usage: 20-30L, Spike (leak): 80-150L
   */
  private generateConsumption(flatId: string): number {
    const random = Math.random();

    // 5% chance of anomaly (potential leak)
    if (random < 0.05) {
      return Math.round(80 + Math.random() * 70); // 80-150L
    }

    // Normal consumption
    return Math.round(15 + Math.random() * 25); // 15-40L
  }

  /**
   * Send water meter reading to IoT Core
   */
  async sendReading(flatId: string): Promise<void> {
    const meterId = this.config.meterIds.get(flatId);
    if (!meterId) {
      console.error(`No meter ID configured for flat ${flatId}`);
      return;
    }

    const reading: WaterReading = {
      flat_id: flatId,
      meter_id: meterId,
      timestamp: new Date().toISOString(),
      water_consumption_liters: this.generateConsumption(flatId),
      location: `Flat ${flatId}`,
    };

    try {
      const topic = `aquaflow/meters/${flatId}/${meterId}`;
      const payload = JSON.stringify(reading);

      await this.client.send(
        new PublishCommand({
          topic,
          qos: 0,
          payload: new TextEncoder().encode(payload),
        })
      );

      console.log(
        `[${new Date().toISOString()}] ✓ Sent reading for ${flatId}: ${reading.water_consumption_liters}L`
      );
    } catch (error) {
      console.error(`Failed to send reading for ${flatId}:`, error);
    }
  }

  /**
   * Start sending readings for all flats
   */
  async startSimulation(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Starting IoT device simulator...`);

    for (const flatId of this.config.flats) {
      // Send initial reading
      await this.sendReading(flatId);

      // Schedule periodic readings
      const timer = setInterval(
        () => this.sendReading(flatId).catch(console.error),
        this.config.publishIntervalMs
      );

      this.timers.set(flatId, timer);
    }

    console.log(
      `[${new Date().toISOString()}] Simulator started. Sending readings every ${this.config.publishIntervalMs / 1000}s for ${this.config.flats.length} flats.`
    );
  }

  /**
   * Stop the simulation
   */
  async stopSimulation(): Promise<void> {
    for (const [flatId, timer] of this.timers) {
      clearInterval(timer);
    }
    this.timers.clear();
    console.log(`[${new Date().toISOString()}] Simulator stopped.`);
  }
}

/**
 * Main entry point
 */
async function main() {
  const config: SimulatorConfig = {
    endpoint: process.env.IOT_ENDPOINT || 'your-endpoint.iot.ap-south-1.amazonaws.com',
    region: process.env.AWS_REGION || 'ap-south-1',
    flats: ['A-101', 'A-102', 'A-103', 'B-101', 'B-102', 'B-103'],
    meterIds: new Map([
      ['A-101', 'MTR1001'],
      ['A-102', 'MTR1002'],
      ['A-103', 'MTR1003'],
      ['B-101', 'MTR2001'],
      ['B-102', 'MTR2002'],
      ['B-103', 'MTR2003'],
    ]),
    // For production testing: every 3600s (1 hour)
    // For quick testing: every 10s
    publishIntervalMs: process.env.NODE_ENV === 'production' ? 3600000 : 10000,
  };

  const simulator = new IotDeviceSimulator(config);

  // Start simulation
  await simulator.startSimulation();

  // Graceful shutdown on Ctrl+C
  process.on('SIGINT', async () => {
    console.log('\n[SIGINT] Shutting down...');
    await simulator.stopSimulation();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { IotDeviceSimulator, SimulatorConfig, WaterReading };
