---
sidebar_position: 4
---

# Enabling Caching

To enable out-of-the-box caching with `Redis`, simply provide a `redis_url` when initializing your Ductape credentials. This is a **required step** to use caching in your Ductape application.

## Example

```typescript
import Ductape from '@ductape/sdk';

const credentials = {
  user_id: process.env.DUCTAPE_USER_ID,
  workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
  private_key: process.env.DUCTAPE_PRIVATE_KEY,
  redis_url: process.env.REDIS_URL, // Add your Redis URL here
};

const ductape = new Ductape(credentials);
ductape.connectRedis();

export default ductape;
```

> 🔑 The `redis_url` should point to your authenticated Redis instance and will be used to power local caching.
> The `ductape.connectRedis()` function call starts the redis server

### Example Redis URL

```
redis://default:your_password@redis.example.com:6379
```