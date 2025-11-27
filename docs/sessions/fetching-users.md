---
sidebar_position: 4
---

# Fetching Session Users

Ductape allows you to retrieve users associated with a specific session in your product. This is useful for analytics, auditing, or managing user access and activity within sessions.

## Fetch All Users for a Session

To fetch all users associated with a particular session, use the `users` method from the `product.sessions` interface. You need to provide the session tag, product tag, and pagination options.

### Example

```ts
const users = await ductape.products.sessions.users({
  session: "session_tag", // The tag of the session
  product: "product_tag", // The tag of your product
  page: 1,                // Page number (pagination)
  limit: 20               // Number of users per page
});
```

### Parameters

| Field     | Type     | Required | Description                                 |
|-----------|----------|----------|---------------------------------------------|
| `session` | string   | Yes      | The tag of the session to query users from. |
| `product` | string   | Yes      | The tag of your product.                    |
| `page`    | number   | Yes      | The page number for pagination.             |
| `limit`   | number   | Yes      | The number of users to return per page.     |

### Response

Returns an array of user objects associated with the session. Each user object includes fields such as:
- `ductape_user_id`
- `product_tag`
- `session_tag`
- `identifier`
- `last_seen`
- `env`
- `first_seen`
- `createdAt`
- `updatedAt`

## Fetch a Specific User by ID

You can now fetch a specific user by their unique ID using the `user` method from the `product.sessions` interface:

```ts
const user = await ductape.products.sessions.user("ductape_user_id");
```

- `ductape_user_id` is the unique identifier for the user you want to fetch.
- The returned user object includes a `session_count` field, which is the number of session records for that user in the UserSession table.
- The method returns the user object if found, or `null` if not found.

## See Also

- [Managing Sessions](./overview.md) 