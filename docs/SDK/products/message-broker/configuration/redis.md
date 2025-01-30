---
sidebar_position: 3
---

# Redis Configuration

To setup Redis configuration, you need to provide the Redis configuration details as below

``` typescript
const redisConfig = {
  host: 'redis.yourdomain.com', // Replace with your Redis server hostname or IP
  port: 6380, // Example non-default Redis port
  channel: 'events', // Example Pub/Sub channel
  password: 'secure-password-123', // Optional; remove if not required
};
```

- **host:** The hostname or IP address of the Redis server.
- **port:** The redis port
- **channel:** The channel name for Redis Pub/Sub messaging.
- **password:** The password required to authenticate with the Redis server (if authentication is enabled).
