---
sidebar_position: 3
---

# Initialize App Builder

To work with apps and services, start by using the App Builder interface to initialize the app you created in the previous step.

Initializing the app retrieves the application instance, enabling interaction in subsequent steps.

```typescript
// ... Ductape Instance

// Ensure APP_TAG is stored in your .env file
const appTag = process.env.DUCTAPE_APP_TAG;

// Initialize the App Builder
const appBuilder = await ductape.getAppBuilder();

// Fetch the app instance by its tag for further interaction
await appBuilder.initializeAppByTag(appTag);

```

