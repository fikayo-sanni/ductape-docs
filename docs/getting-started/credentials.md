---
sidebar_position: 3
---

# Credentials

## Fetching Credentials

To initialize the Ductape SDK, you’ll need to provide a set of private credentials, which are critical for accessing your workspace and should always be kept secure.

You can retrieve these workspace credentials directly through the Ductape CLI by running the following command:

```bash
ductape credentials --info
```

The credentials you’ll receive include the following fields:

- **workspace_id**
- **user_id**
- **private_key**

These credentials form a unique trifecta that grants you access to your workspace resources. It’s essential to handle them with care to ensure the security of your products and data.

## Initialize SDK with Credentials

To begin using the Ductape SDK, you must initialize a Ductape instance with your credentials. After fetching your workspace credentials from the CLI, you can initialize the SDK as shown below:

```typescript
import Ductape from 'ductape';

const credentials = {
    user_id: process.env.DUCTAPE_USER_ID,
    workspace_id: process.env.DUCTAPE_WORKSPACE_ID,
    private_key: process.env.DUCTAPE_PRIVATE_KEY
};

const ductape = new Ductape(credentials);
```

By initializing the SDK with these credentials, you establish a secure connection to your workspace, enabling you to manage and interact with your third-party products effectively. Make sure that your credentials are stored securely, such as in environment variables, to protect them from unauthorized access.
