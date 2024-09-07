---
sidebar_position: 5
---

# Authentication Setup

Ductape allows you to set up various authentication rules for users or systems that need to access your application. Authentication setup in Ductape is flexible, supporting both credential-based and token-based authentication methods.

```typescript
import { AuthTypes, TokenPeriods } from "ductape/types/enums";
import { app } from "app-instance" // app instance file 

const setup = {
    name: "Login Access",
    tag: "login_access",
    setup_type: AuthTypes.CREDENTIALS,
    expiry: 7,
    period: TokenPeriods.HOURS,
    action_tag: "login",
};

const auth = await app.createAuth(setup);
```

There are two main types of authentication setups covered in the `AuthTypes` enum:

| Key             | Value            |
|-----------------|------------------|
| **CREDENTIALS** | credential_access |
| **TOKEN**       | token_access      |

### **Credentials-Based Authentication**

**Credentials-based access** uses a combination of user credentials (such as a username and password) to generate an expiring token. This token must be refreshed periodically to maintain access. In the example above, the tokens generated will expire in 7 hours (`expiry: 7`, `period: TokenPeriods.HOURS`).

The `TokenPeriods` enum provides options for specifying the token's lifespan, allowing you to define how long a token should be valid before it requires renewal:

| Key        | Value   |
|------------|---------|
| **HOURS**  | hours   |
| **MINUTES**| mins    |
| **SECONDS**| secs    |
| **DAYS**   | days    |
| **WEEKS**  | weeks   |
| **MONTHS** | months  |
| **YEARS**  | years   |

The `ACTION_TAG` defines the tag of the action that can refresh the token, such as a login action or a token refresh action defined in your product steps. Ductape will automatically handle credential-based token refreshes when third parties interact with your application, ensuring secure and continuous access.

### **Token-Based Authentication**

**Token-based access** is used when access to your service is controlled by a token that does not expire. This type of authentication is suitable for scenarios where long-term access is needed without the overhead of managing token refreshes. For this setup, you do not need to provide any expiry details, but you will need to supply a sample of the required token format. Here's an example:

```typescript
import { AuthTypes, InputTypes } from "ductape/types/enums";
import { app } from "app-instance" // app instance file 

const setup = {
    name: "Token Access",
    tag: "token_access",
    setup_type: AuthTypes.TOKEN,
    tokens: {
        type: InputTypes.JSON,
        sample: {
            token: "91a7882e61ef143ad2fd115a758fcc40c1be9b5e4a87b177"
        }
    }
};

const auth = await app.createAuth(setup);
```

In this example, a non-expiring token is defined under the `tokens` object, with the token type set to `InputTypes.JSON` and a sample token provided. This setup is ideal for services that require permanent access credentials without the need for periodic renewals.

By using these authentication setups, you can ensure that your application is securely accessible according to your specific requirements, whether you need short-lived access for secure operations or persistent tokens for ongoing access.

Here's the `InputsTypes` enum keys and values

| Key       | Value |
|-----------|-------|
| **JSON**  | json  |
| **XML**   | xml   |
| **HTML**  | html  |
| **PLAIN** | plain |


## Fetching Authentication

``` typescript
const auths  = app.fetchAuths() // fetch all app auths
```

``` typescript
const auth_tag = "login_access"
const auth  = app.fetchAuth(auth_tag) // fetch single app auth
```

## Updating Authentication

You can update any of the fields earmarked in the create auth function using the updateAuth function, asides the tag field

For example, to update the auth description and expiry info, you simply 

``` typescript
const auth_tag = "login_acceess"
const update = {
    description: "provides access with username and password",
    expiry: 1,
    period: TokenPeriods.DAYS,
}

const auth  = app.updateAuth(auth_tag, update) // fetch single app auth
```