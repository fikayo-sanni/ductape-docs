---
sidebar_position: 6
---

# Authentication Setup

Ductape allows you to set up various authentication rules for users or systems that need to access your application. Authentication setup in Ductape is flexible, supporting both credential-based and token-based authentication methods.

## Creating Authentication

```ts
import { AuthTypes, TokenPeriods } from "ductape-sdk/types";

const setup = {
    name: "Login Access",
    tag: "login_access",
    setup_type: AuthTypes.CREDENTIALS,
    expiry: 7,
    period: TokenPeriods.HOURS,
    action_tag: "login",
};

const auth = await ductape.app.auth.create(setup);
```

## Authentication Types

| Key             | Value              |
|-----------------|--------------------|
| **CREDENTIALS** | credential_access  |
| **TOKEN**       | token_access       |

### Credentials-Based Authentication

Credentials-based access uses a combination of user credentials (such as a username and password) to generate an expiring token. This token must be refreshed periodically to maintain access. In the example above, the tokens generated will expire in 7 hours (`expiry: 7`, `period: TokenPeriods.HOURS`).

The `TokenPeriods` enum provides options for specifying the token's lifespan:

| Key        | Value   |
|------------|---------|
| **HOURS**  | hours   |
| **MINUTES**| mins    |
| **SECONDS**| secs    |
| **DAYS**   | days    |
| **WEEKS**  | weeks   |
| **MONTHS** | months  |
| **YEARS**  | years   |

The `action_tag` defines the tag of the action that can refresh the token, such as a login action or a token refresh action defined in your product steps. Ductape will automatically handle credential-based token refreshes when third parties interact with your application, ensuring secure and continuous access.

### Token-Based Authentication

Token-based access is designed for scenarios where long-term access is required without token expiration or the overhead of managing token refreshes. You don't need to specify an expiry, but you must provide a sample token and specify where it should be used in your requests. Here's an example:

```ts
import { AuthTypes, InputTypes } from "ductape-sdk/types";

const setup = {
    name: "Token Access",
    tag: "token_access",
    setup_type: AuthTypes.TOKEN,
    tokens: {
        params: {  // for tokens added to the request URL parameters
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ"
        },
        body: {    // for tokens included in the request body (e.g., for POST/PUT requests)
            access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ"
        },
        query: {   // for tokens added to the query string of the URL
            api_key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ"
        },
        header: {  // for tokens included in the request headers
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ" // sample token
        }
    }
};

const auth = await ductape.app.auth.create(setup);
```

#### Explanation
- **params:** The token is passed as a URL parameter. Example: `https://example.com/resource/:token`, where `:token` is replaced by the provided token.
- **body:** The token is included in the body of the request. Example: `{ access_token: "your_token" }` in the body of a `POST` or `PUT` request.
- **query:** The token is passed as a query parameter. Example: `https://example.com/resource?api_key=your_token`.
- **header:** The token is included in the headers, often under the `Authorization` key.

## Fetching Authentication

```ts
const auths = await ductape.app.auth.fetchAll(); // fetch all app auths
```

```ts
const auth_tag = "login_access"
const auth = await ductape.app.auth.fetch(auth_tag); // fetch single app auth
```

## Updating Authentication

You can update any of the fields earmarked in the create auth function using the updateAuth function, except the tag field.

For example, to update the auth description and expiry info:

```ts
const auth_tag = "login_access"
const update = {
    description: "provides access with username and password",
    expiry: 1,
    period: TokenPeriods.DAYS,
}

const auth = await ductape.app.auth.update(auth_tag, update);
```

## See Also

* [Getting Started with Apps](./getting-started.md)
* [App Instance Management](./app-instance.md)
* [Managing Actions](./update-action.md)
