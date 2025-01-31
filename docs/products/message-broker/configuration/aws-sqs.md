---
sidebar_position: 4
---

# AWS SQS Configuration
To setup AWS SQS configuration, you need to provide the AWS SQS configuration details as below

```typescript
const awsSqsConfig = {
  region: 'us-east-1', // AWS region
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789012/my-queue', // Full URL of the SQS queue
  accessKeyId: 'your-access-key-id', // AWS access key ID
  secretAccessKey: 'your-secret-access-key', // AWS secret access key
};
```

- **region:** The AWS region where the SQS queue is hosted.
- **queueUrl:** The URL of the SQS queue.
- **accessKeyId:** The AWS access key ID for authentication.
- **secretAccessKey:** The AWS secret key for authentication.