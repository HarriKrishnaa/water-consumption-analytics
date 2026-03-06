# Water Consumption & Leakage Analytics System 💧

AWS-based real-time water consumption monitoring and leak detection system for apartment 

## Deployment Status
- **Production**: Deployed to Vercel
buildings.

## Overview

This system provides automated detection of water leaks in apartment complexes using IoT sensors and machine learning. It monitors real-time consumption data, detects anomalies, and sends alerts to flat owners and society management.

## Architecture

### Data Ingestion Layer
- **AWS IoT Core**: Smart water meter device connectivity and management
- **Kinesis Data Streams**: Real-time meter data buffering (hourly readings)

### Real-Time Processing
- **Kinesis Data Analytics**: Per-flat consumption flagging vs. daily baseline
- **Lambda Functions**: 3AM leak signature detection algorithm

### Storage Layer
- **Amazon Timestream**: Time-series database for meter readings with optimal compression
- **S3**: Parquet format archive for billing and analysis
- **DynamoDB**: Flat-level consumption alerts storage

### ETL & Analytics
- **AWS Glue**: Monthly consumption aggregation and flat-vs-building proportions
- **Athena**: SQL queries for leak investigation

### Visualization & Alerts
- **QuickSight**: Society manager dashboard with real-time metrics
- **SES**: Email notifications to flat owners
- **SNS/Pinpoint**: Real-time alerts when usage spikes 3x baseline

## Features

✅ Real-time water consumption monitoring
✅ Automatic leak detection algorithm
✅ 3AM leak signature detection (nighttime usage analysis)
✅ Consumption anomaly alerts
✅ Monthly billing aggregation
✅ Multi-channel notifications (Email, SMS)
✅ Society manager dashboard
✅ Conservation progress tracking
✅ Flat-level baseline calculation

## Leak Detection Algorithm

### 3AM Leak Signature Detection
Daily Lambda function that:
1. Queries Timestream for 2-4AM consumption window
2. Calculates 7-day average nighttime flow per flat
3. Flags flats exceeding 50 liters/night as leak candidates
4. Sends advisory to flat owner and society manager via SES

### Anomaly Detection
- Compares hourly consumption against daily baseline
- Flags consumption 3x baseline as immediate alert
- Tracks consumption variance and peak usage

## Getting Started

### Prerequisites
- AWS Account with appropriate permissions
- Node.js 18+ (for local testing)
- npm/yarn package manager

### Deployment

1. Clone the repository
```bash
git clone https://github.com/HarriKrishnaa/water-consumption-analytics.git
cd water-consumption-analytics
```

2. Install dependencies
```bash
npm install
```

3. Set up AWS credentials
```bash
aws configure
```

4. Deploy infrastructure (CloudFormation)
```bash
aws cloudformation create-stack --stack-name water-analytics --template-body file://template.yaml
```

## Technology Stack

- **Runtime**: Node.js, Python 3.14
- **Cloud**: AWS (IoT Core, Kinesis, Timestream, S3, DynamoDB, Lambda, Glue)
- **Database**: Amazon Timestream, DynamoDB
- **Analytics**: Athena, QuickSight
- **Frontend**: (Vercel deployment ready)

## API Endpoints

### GET /api/consumption/:flatId
Retrieve consumption data for a specific flat

### GET /api/leaks/detected
List detected leaks

### POST /api/alerts/subscribe
Subscribe to consumption alerts

## Deployment to Vercel

This project is configured for Vercel deployment:

```bash
npm run build
vercel deploy
```

## Project Structure

```
├── api/
│   ├── consumption.js
│   ├── leaks.js
│   └── alerts.js
├── lambda/
│   ├── leak-detection.py
│   └── consumption-aggregation.py
├── infrastructure/
│   ├── cloudformation.yaml
│   └── iot-setup.js
├── public/
│   └── dashboard.html
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Contact

- Author: Harri Krishnaa
- GitHub: @HarriKrishnaa
- Email: harri@example.com

## Acknowledgments

- AWS Documentation and Services
- Water Conservation Initiative
- IoT and Real-time Analytics Community
