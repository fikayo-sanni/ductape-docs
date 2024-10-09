---
sidebar_position: 1
---

# Accounts

You can create accounts and fetch credentials using the `register`, `login` and `credentials` command provided by the ductape cli

## Register

The CLI allows you to register


``` bash
ductape register
```

You’ll be prompted to provide the following information:

- **First Name**
- **Last Name**
- **Email Address**
- **Password**

## Login

Once you've registered, you can log in to the Ductape CLI to access its full suite of features. To log in, use the following command:

```bash
ductape login
```

This command will prompt you to enter your credentials:

- **Ductape Email**
- **Ductape Password**


## Fetch Credentials

You can retrieve these workspace credentials directly through the Ductape CLI by running the following command:

```bash
ductape credentials --info
```

The credentials you’ll receive include the following fields:

- **workspace_id**
- **user_id**
- **private_key**