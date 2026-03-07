# AquaFlow AI - Complete Setup Guide

This guide walks you through deploying the complete end-to-end water consumption analytics platform.

## Prerequisites

- AWS Account with billing enabled
- Node.js 18+ and npm installed
- AWS CLI configured
- Basic knowledge of AWS services

## Quick Start Summary

```bash
# 1. Create AWS resources
aws s3 mb s3://aquaflow-data
aws timestream-write create-database --database-name aquaflow_ai

# 2. Deploy Lambda functions
cd scripts && npm install
zip -r functions.zip *.ts node_modules
aws lambda create-function --function-name aquaflow-timestream-ingestion ...

# 3. Run simulator
ts-node iot-device-simulator.ts

# 4. Start dashboard
npm install && npm run dev
```

Refer to `ARCHITECTURE.md` for detailed system design.

## Full Deployment Steps

See complete CLI commands in the repository documentation for:
- S3 buckets setup
- Timestream database creation  
- DynamoDB table for alerts
- Kinesis streams
- Lambda function deployment
- Glue ETL jobs
- IoT Core configuration
- SES email verification
- Dashboard deployment

## Verification

After deployment, verify:
1. IoT simulator sends data
2. Data appears in Timestream
3. Alerts stored in DynamoDB  
4. Dashboard shows real-time metrics

## Support

For issues, check:
- Lambda CloudWatch logs
- Kinesis stream metrics
- AWS service quotas
