---
sidebar_position: 2
---

# App Builder

This glossary provides a detailed reference for all data structure definitions used within the AppBuilder class.

---

## ICreateAppBuilder
Represents the structure required to create a new application.

```typescript
export interface ICreateAppBuilder {
  app_name: string;
  description: string;
  unique?: boolean;
  returned?: string;
}
```
### Properties:  
- **app_name** (`string`, **required**) – The name of the application.  
- **description** (`string`, **required**) – A brief description of the application.  
- **unique** (`boolean`, **optional**) – Indicates whether the application should be unique.  
- **returned** (`string`, **optional**) – Specifies the format or details to be returned after creation.

---

## IApp
Represents an application with its configurations, versions, and metadata.  

```typescript
export interface IApp {
  _id?: string;
  workspace_id?: string;
  user_id: string;
  author: string;
  app_name: string;
  logo?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  tag: string;
  folders?: Array<IAppFolders>;
  get_started?: number;
  request_type?: string;
  description?: string;
  aboutText?: string;
  aboutHTML?: string;
  public_key?: string;
  private_key?: string;
  require_whitelist: boolean;
  versions: Array<IAppVersion>;
  created_at: Date;
  updated_at: Date;
}
```
### Properties:  
- **_id** (`string`, **optional**) – Unique identifier for the application.  
- **workspace_id** (`string`, **optional**) – The workspace to which the application belongs.  
- **user_id** (`string`, **required**) – The ID of the user who owns the application.  
- **author** (`string`, **required**) – The name of the application author.  
- **app_name** (`string`, **required**) – The name of the application.  
- **logo** (`string`, **optional**) – URL or path to the application's logo.  
- **colors** (`object`, **optional**) – Defines the color scheme of the application.  
  - **primary** (`string`, **optional**) – Primary color.  
  - **secondary** (`string`, **optional**) – Secondary color.  
  - **accent** (`string`, **optional**) – Accent color.  
  - **background** (`string`, **optional**) – Background color.  
- **tag** (`string`, **required**) – Unique tag identifier for the application.  
- **folders** (`Array<IAppFolders>`, **optional**) – List of folders associated with the application.  
- **get_started** (`number`, **optional**) – Indicates onboarding progress for the application.  
- **request_type** (`string`, **optional**) – Type of request used for the app.  
- **description** (`string`, **optional**) – Short description of the application.  
- **aboutText** (`string`, **optional**) – Detailed text about the application.  
- **aboutHTML** (`string`, **optional**) – Detailed HTML content about the application.  
- **public_key** (`string`, **optional**) – Public key associated with the application.  
- **private_key** (`string`, **optional**) – Private key associated with the application.  
- **require_whitelist** (`boolean`, **required**) – Indicates if the app requires whitelisting.  
- **versions** (`Array<IAppVersion>`, **required**) – List of application versions.  
- **created_at** (`Date`, **required**) – Timestamp when the application was created.  
- **updated_at** (`Date`, **required**) – Timestamp when the application was last updated.  

---

## IAppVersion
Represents a version of an application with associated configurations and settings.  

```typescript
export interface IAppVersion {
  tag: string;
  latest: boolean;
  envs?: Array<IAppEnv>;
  folders?: Array<IAppFolders>;
  description?: string;
  active: boolean;
  webhooks?: Array<IAppWebhook>;
  actions?: Array<IAppAction>;
  constants?: Array<IAppConstants>;
  auths?: Array<IAppAuth>;
  variables?: Array<IAppVariables>;
  retries: any;
  actions_count?: number;
  events_count?: number;
  auths_count?: number;
  constants_count?: number;
  variables_count?: number;
  envs_count?: number;
}
```
### Properties:  
- **tag** (`string`, **required**) – Unique identifier for the version.  
- **latest** (`boolean`, **required**) – Indicates if this is the latest version.  
- **envs** (`Array<IAppEnv>`, **optional**) – List of environments associated with the version.  
- **folders** (`Array<IAppFolders>`, **optional**) – List of folders in this version.  
- **description** (`string`, **optional**) – Description of the version.  
- **active** (`boolean`, **required**) – Indicates if the version is active.  
- **webhooks** (`Array<IAppWebhook>`, **optional**) – List of webhooks linked to this version.  
- **actions** (`Array<IAppAction>`, **optional**) – List of actions available in this version.  
- **constants** (`Array<IAppConstants>`, **optional**) – List of constants in this version.  
- **auths** (`Array<IAppAuth>`, **optional**) – List of authentication configurations.  
- **variables** (`Array<IAppVariables>`, **optional**) – List of variables available in this version.  
- **retries** (`any`, **required**) – Retry settings for actions.

---

## IAppVariables
Defines a variable for an application, including its validation rules.

```typescript
export interface IAppVariables {
  _id?: string;
  key: string;
  type: DataTypes;
  required: boolean;
  description: string;
  minlength: number;
  maxlength: number;
}
```
### Properties:  
- **_id** (`string`, **optional**) – Unique identifier for the variable.  
- **key** (`string`, **required**) – The variable's key or name.  
- **type** (`DataTypes`, **required**) – The data type of the variable.  
- **required** (`boolean`, **required**) – Specifies if the variable is mandatory.  
- **description** (`string`, **required**) – A description of the variable.  
- **minlength** (`number`, **required**) – The minimum allowed length for the variable's value.  
- **maxlength** (`number`, **required**) – The maximum allowed length for the variable's value.

---

## IAppConstants
Defines a constant for an application.

```typescript
export interface IAppConstants {
  _id?: string;
  key: string;
  value: string;
  type: DataTypes;
  description: string;
}
```
### Properties:  
- **_id** (`string`, **optional**) – Unique identifier for the constant.  
- **key** (`string`, **required**) – The constant's key or name.  
- **value** (`string`, **required**) – The value of the constant.  
- **type** (`DataTypes`, **required**) – The data type of the constant.  
- **description** (`string`, **required**) – A description of the constant.

---

## ImportDocsTypes
Enumeration defining supported document import types.

```typescript
export enum ImportDocsTypes {
  postmanV21 = "PostmanV2.1",
  openApiV30 = "OpenApiV3.0"
}
```
### Values:  
- **postmanV21** – Indicates the Postman v2.1 format.  
- **openApiV30** – Indicates the OpenAPI v3.0 format.

---

## IAppWebhook
Defines a webhook for an application, including its associated environments and events.

```typescript
export interface IAppWebhook {
  _id?: string;
  name: string;
  tag: string;
  description: string;
  envs: IAppWebhookEnv[];
  events: IAppWebhookEvent[];
}
```
### Properties:  
- **_id** (`string`, **optional**) – Unique identifier for the webhook.  
- **name** (`string`, **required**) – The name of the webhook.  
- **tag** (`string`, **required**) – A unique tag identifier for the webhook.  
- **description** (`string`, **required**) – A description of the webhook.  
- **envs** (`IAppWebhookEnv[]`, **required**) – List of environments for the webhook.  
- **events** (`IAppWebhookEvent[]`, **required**) – List of events associated with the webhook.

---

## IAppWebhookEnv
Defines the configuration for a webhook within a specific environment.

```typescript
export interface IAppWebhookEnv {
  _id?: string;
  slug: string;
  registration_url: string;
  method: HttpMethods;
  sample: IActionRequest;
  sample_data?: IParsedSample[];
  __v?: number;
}
```
### Properties:  
- **_id** (`string`, **optional**) – Unique identifier for the webhook environment.  
- **slug** (`string`, **required**) – A unique slug identifier for the environment.  
- **registration_url** (`string`, **required**) – The URL used for registering the webhook.  
- **method** (`HttpMethods`, **required**) – The HTTP method used (e.g., GET, POST).  
- **sample** (`IActionRequest`, **required**) – A sample request structure for testing purposes.  
- **sample_data** (`IParsedSample[]`, **optional**) – Optional sample data associated with the webhook.  
- **__v** (`number`, **optional**) – Version key for the record.

---

## IAppWebhookEvent
Defines an event associated with a webhook.

```typescript
export interface IAppWebhookEvent {
  _id?: string;
  tag: string;
  name: string;
  description: string;
  sample: IActionRequest;
  sample_data?: IParsedSample[];
}
```
### Properties:  
- **_id** (`string`, **optional**) – Unique identifier for the webhook event.  
- **tag** (`string`, **required**) – A unique tag identifier for the event.  
- **name** (`string`, **required**) – The name of the event.  
- **description** (`string`, **required**) – A description of the event.  
- **sample** (`IActionRequest`, **required**) – A sample request structure associated with the event.  
- **sample_data** (`IParsedSample[]`, **optional**) – Optional sample data for the event.

---

## IAppEnv
Defines an environment configuration for an application.

```typescript
export interface IAppEnv {
  _id?: string;
  env_name: string;
  slug: string;
  description?: string;
  whitelist?: boolean;
  active?: boolean;
  __v?: number;
  base_url?: string;
  request_type?: DataFormats;
}
```
### Properties:  
- **_id** (`string`, **optional**) – Unique identifier for the environment.  
- **env_name** (`string`, **required**) – The display name of the environment.  
- **slug** (`string`, **required**) – A unique slug identifier for the environment.  
- **description** (`string`, **optional**) – A description of the environment.  
- **whitelist** (`boolean`, **optional**) – Indicates if the environment is whitelisted.  
- **active** (`boolean`, **optional**) – Indicates if the environment is currently active.  
- **__v** (`number`, **optional**) – Version key for the record.  
- **base_url** (`string`, **optional**) – The base URL associated with the environment.  
- **request_type** (`DataFormats`, **optional**) – The expected data format for requests in the environment.

---

## DataFormats
Enumeration defining the supported data formats for requests.

```typescript
export enum DataFormats {
  JSON = 'application/json',
  URLENCODED = 'application/x-www-form-urlencoded',
  FORMDATA = 'multipart/form-data',
  SOAP = 'SOAP',
  HTML = 'html'
}
```
### Values:  
- **JSON** – Represents the `application/json` format.  
- **URLENCODED** – Represents the `application/x-www-form-urlencoded` format.  
- **FORMDATA** – Represents the `multipart/form-data` format.  
- **SOAP** – Represents the SOAP data format.  
- **HTML** – Represents HTML format.

---