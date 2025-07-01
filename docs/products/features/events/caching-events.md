---
sidebar_position: 5
---

# Caching Events

Caching events in Ductape allow you to temporarily store and reuse the results of expensive or frequently accessed operations within your feature workflows. By leveraging caching, you can improve performance, reduce redundant processing, and optimize resource usage in event-driven applications.

## What is a Caching Event?

A caching event is an action or step in your feature sequence that stores the output of a computation or API call in a cache. Subsequent events or features can then retrieve this cached data by referencing the output of the cached event using standard data piping notation.

Caching is typically managed using the product cache configuration and can be referenced in your event sequence or feature logic.

## Example: Using Caching in a Feature Sequence

```typescript
const fetchUserDataEvent: IFeatureEvent = {
  type: FeatureEventTypes.ACTION,
  event: 'fetch_user_data',
  input: { userId: '$Input{user_id}' },
  retries: 1,
  allow_fail: false,
  cache: 'user_data_cache', // Store the result in the cache with this tag
};

const useCachedUserDataEvent: IFeatureEvent = {
  type: FeatureEventTypes.ACTION,
  event: 'process_user_data',
  input: {
    userData: '$Sequence{main_sequence}{fetch_user_data}{result}', // Reference the cached event's result
  },
  retries: 1,
  allow_fail: false,
};
```

> **Tip:** The `cache` field enables Ductape to store the result of an event for reuse. Access the cached result using the standard `$Sequence{sequence}{event}{key}` notation, referencing the event that was cached.

## Best Practices
- Cache only data that is expensive to compute or fetch, and that is safe to reuse.
- Use descriptive cache tags to avoid conflicts and clarify the purpose of cached data.
- Set appropriate cache expiry times in your product cache configuration to balance freshness and performance.
- Document which events use caching and why, for maintainability.

## See Also
- [Features Overview](../../getting-started.md)
- [Event Types Overview](./event-types/)
- [Data Piping](./data-piping.md)


