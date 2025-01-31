---
sidebar_position: 5
---

# Google Pubsub Configuration
To setup Google PubSub configuration, you need to provide the Google PubSub configuration details as below

```typescript
const googlePubSubConfig = {
  projectId: 'your-gcp-project-id', // Replace with your Google Cloud Project ID
  topicName: 'my-topic', // The name of the Pub/Sub topic
  subscriptionName: 'my-subscription', // Optional: Name of the subscription
  keyFilename: '/path/to/keyfile.json', // Path to the service account key file
};
```

- **projectId:** The Google Cloud Project ID where Pub/Sub is enabled.
- **topicName:** The name of the Pub/Sub topic to publish or subscribe to.
- **subscriptionName:** (Optional) The name of the Pub/Sub subscription.
- **keyFilename:** The file path to the Google Cloud service account key.
