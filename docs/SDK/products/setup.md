---
sidebar_position: 4
---

# Adding Apps and Services

To begin building a product with Ductape, you'll first need to add the apps and services that will form the foundation of your product. This guide will walk you through the process of creating app access, setting up app environments, and mapping them to your product environments.

## Creating App Access

The first step in integrating an app into your product is to create a connection between the app and your product. This connection is essential for incorporating various functionalities as you build and scale your product. You can create this connection using the `createAppAccessTag` function from the `productBuilder` instance.

### Example: Creating App Access

```typescript
import { product } from "product-instance"; // Import your product instance

const app_tag = process.env.DUCTAPE_APP_TAG; // Get the app tag from environment variables
const appAccess = await product.createAppAccessTag(app_tag); // Create app access
```

In the example above, we establish a connection between the app and the product using an app tag. This `appAccess` object will be used in subsequent steps to configure the app's environments.

## Setting Up an App

Once you've established a connection, the next step is to set up the app's environments. This involves configuring the app's environments and mapping them to your product environments. Proper setup ensures that your app functions correctly within the specific environments you're using.

### App Connection Payload

To set up an app, you'll need to construct an app connection payload. This payload contains all the necessary information required to successfully integrate and use an app deployed on Ductape. The payload consists of two main parts:

1. **access_tag**: This is obtained from the `appAccess` object created earlier.
2. **envs**: An array that contains the setup information for all the app environments, including their mapping to product environments.

### Example: Setting Up App Environments for `prd` and `dev`

Here’s how you can structure the `envs` array and set up the app for both production and development environments:

```typescript
const prd_variables = [
    {
        key: "pin",
        value: "1135"
    },
    {
        key: "zip_code",
        value: "112233"
    }
];

const prd_auth = [
    {
        auth_tag: "login_auth",
        data: {
            body: {
                email: "prd_user@example.com",
                password: "prd_password"
            }
        }
    }
];

const dev_variables = [
    {
        key: "pin",
        value: "2233"
    },
    {
        key: "zip_code",
        value: "445566"
    }
];

const dev_auth = [
    {
        auth_tag: "login_auth",
        data: {
            body: {
                email: "dev_user@example.com",
                password: "dev_password"
            }
        }
    }
];

const envs = [
    {
        app_env_slug: 'prd', // The app's production environment slug
        product_env_slug: 'prd', // The corresponding production product environment slug
        variables: prd_variables, // Key-value pairs for production-specific variables
        auth: prd_auth // Authentication data for the production environment
    },
    {
        app_env_slug: 'dev', // The app's development environment slug
        product_env_slug: 'dev', // The corresponding development product environment slug
        variables: dev_variables, // Key-value pairs for development-specific variables
        auth: dev_auth // Authentication data for the development environment
    }
];

const { access_tag } = appAccess;

const details = {
    access_tag,
    envs
};

await product.addApp(details); // Add the app with the specified details for both environments
```

### Key Components

- **`variables`**: A key-value pair array where each entry corresponds to a specific configuration parameter required by the app.
- **`auth`**: Contains authentication details necessary for the app to function correctly. This typically includes credentials or tokens required by the app's API.
- **`app_env_slug`**: The identifier for the app's environment (e.g., 'prd' for production and 'dev' for development).
- **`product_env_slug`**: The corresponding identifier for the product environment in Ductape.

By following these steps, you can ensure that your app is properly integrated into your product, with all necessary environments correctly configured and mapped. This setup is crucial for both production and development phases of your product lifecycle.