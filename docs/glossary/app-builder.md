---
sidebar_position: 2
---

# App Builder

This glossary provides a detailed reference for all data structure definitions used within the AppBuilder class.

## ICreateAppBuilder

Represents the structure required to create a new application.

```typescript
interface ICreateAppBuilder {
  app_name: string;
  description: string;
  unique?: boolean;
  returned?: string;
}
```

| Property     | Type     | Required | Description                                      |
|--------------|----------|----------|--------------------------------------------------|
| app_name     | string   | Yes      | The name of the application.                     |
| description  | string   | Yes      | A brief description of the application.          |
| unique       | boolean  | No       | Indicates whether the application should be unique. |
| returned     | string   | No       | Specifies the format or details to be returned.  |

## IApp

Represents an application with its configurations, versions, and metadata.

```typescript
interface IApp {
  _id?: string;
  workspace_id?: string;
  user_id: string;
  author: string;
  app_name: string;
  logo?: string;
  colors?: { ... };
  tag: string;
  folders?: Array[IAppFolders];
  get_started?: number;
  request_type?: string;
  description?: string;
  aboutText?: string;
  aboutHTML?: string;
  public_key?: string;
  private_key?: string;
  require_whitelist: boolean;
  versions: Array[IAppVersion];
  created_at: Date;
  updated_at: Date;
}
```

| Property         | Type                      | Required | Description                                         |
|------------------|---------------------------|----------|-----------------------------------------------------|
| _id              | string                    | No       | Unique identifier for the application.              |
| workspace_id     | string                    | No       | The workspace to which the app belongs.             |
| user_id          | string                    | Yes      | ID of the user who owns the application.            |
| author           | string                    | Yes      | Name of the application author.                     |
| app_name         | string                    | Yes      | Name of the application.                            |
| logo             | string                    | No       | URL or path to the app’s logo.                      |
| colors           | object                    | No       | App’s color scheme (primary, secondary, etc.).      |
| tag              | string                    | Yes      | Unique tag identifier for the app.                  |
| folders          | Array[IAppFolders]        | No       | List of folders associated with the app.            |
| get_started      | number                    | No       | Indicates onboarding progress.                      |
| request_type     | string                    | No       | Type of request used for the app.                   |
| description      | string                    | No       | Short description of the application.               |
| aboutText        | string                    | No       | Detailed text about the application.                |
| aboutHTML        | string                    | No       | Detailed HTML content about the application.        |
| public_key       | string                    | No       | Public key associated with the app.                 |
| private_key      | string                    | No       | Private key associated with the app.                |
| require_whitelist| boolean                   | Yes      | Indicates if the app requires whitelisting.         |
| versions         | Array[IAppVersion]        | Yes      | List of application versions.                       |
| created_at       | Date                      | Yes      | When the application was created.                   |
| updated_at       | Date                      | Yes      | When the application was last updated.              |


## IAppVersion

Represents a version of an application with associated configurations and settings.

```typescript
interface IAppVersion {
  tag: string;
  latest: boolean;
  envs?: Array[IAppEnv];
  folders?: Array[IAppFolders];
  description?: string;
  active: boolean;
  webhooks?: Array[IAppWebhook];
  actions?: Array[IAppAction];
  constants?: Array[IAppConstants];
  auths?: Array[IAppAuth];
  variables?: Array[IAppVariables];
  retries: any;
  actions_count?: number;
  events_count?: number;
  auths_count?: number;
  constants_count?: number;
  variables_count?: number;
  envs_count?: number;
}
```

| Property         | Type                      | Required | Description                                          |
|------------------|---------------------------|----------|------------------------------------------------------|
| tag              | string                    | Yes      | Unique identifier for the version.                   |
| latest           | boolean                   | Yes      | Whether this is the latest version.                  |
| envs             | Array[IAppEnv]            | No       | Associated environments.                             |
| folders          | Array[IAppFolders]        | No       | Folders for this version.                            |
| description      | string                    | No       | Description of the version.                          |
| active           | boolean                   | Yes      | Whether the version is active.                       |
| webhooks         | Array[IAppWebhook]        | No       | Linked webhooks.                                     |
| actions          | Array[IAppAction]         | No       | Available actions in this version.                   |
| constants        | Array[IAppConstants]      | No       | Constants in this version.                           |
| auths            | Array[IAppAuth]           | No       | Authentication configs.                              |
| variables        | Array[IAppVariables]      | No       | Variables for this version.                          |
| retries          | any                       | Yes      | Retry settings.                                      |
| actions_count    | number                    | No       | Count of actions.                                    |
| events_count     | number                    | No       | Count of events.                                     |
| auths_count      | number                    | No       | Count of auths.                                      |
| constants_count  | number                    | No       | Count of constants.                                  |
| variables_count  | number                    | No       | Count of variables.                                  |
| envs_count       | number                    | No       | Count of environments.                               |


## IAppVariables

Defines a variable for an application, including validation rules.

```typescript
interface IAppVariables {
  _id?: string;
  key: string;
  type: DataTypes;
  required: boolean;
  description: string;
  minlength: number;
  maxlength: number;
}
```

| Property     | Type       | Required | Description                                      |
|--------------|------------|----------|--------------------------------------------------|
| _id          | string     | No       | Unique identifier.                               |
| key          | string     | Yes      | The variable’s key or name.                      |
| type         | DataTypes  | Yes      | Data type of the variable.                       |
| required     | boolean    | Yes      | If the variable is mandatory.                    |
| description  | string     | Yes      | Description of the variable.                     |
| minlength    | number     | Yes      | Minimum allowed value length.                    |
| maxlength    | number     | Yes      | Maximum allowed value length.                    |


## IAppConstants

Defines a constant for an application.

```typescript
interface IAppConstants {
  _id?: string;
  key: string;
  value: string;
  type: DataTypes;
  description: string;
}
```

| Property     | Type       | Required | Description                                    |
|--------------|------------|----------|------------------------------------------------|
| _id          | string     | No       | Unique identifier.                             |
| key          | string     | Yes      | The constant’s key or name.                    |
| value        | string     | Yes      | Value of the constant.                         |
| type         | DataTypes  | Yes      | Data type of the constant.                     |
| description  | string     | Yes      | Description of the constant.                   |


## ImportDocsTypes

Enumeration defining supported document import types.

```typescript
enum ImportDocsTypes {
  postmanV21 = "PostmanV2.1",
  openApiV30 = "OpenApiV3.0"
}
```

| Enum Key     | Value          | Description                            |
|--------------|----------------|----------------------------------------|
| postmanV21   | "PostmanV2.1"  | Indicates the Postman v2.1 format.     |
| openApiV30   | "OpenApiV3.0"  | Indicates the OpenAPI v3.0 format.     |