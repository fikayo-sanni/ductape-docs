---
sidebar_position: 7
---

# Events Setup

In the case where your application serves external notifications in  the form of events and webhooks. Ductape provides the means for third parties to register for such events and webhooks. You are required to have to have an action in your imported documentation that is used for registering for webhooks. We would be needing to leverage this functionality

## Registering an Event

You can register an event using the `createEvent` function from the app builder instance


``` typescript
import { EventTypes, InputTypes, HttpMethods } from "ductape/types/enums";
import { app } from "app-instance" // app instance file 
const details = {
    name: "notify client"
    tag: "notify_client";
    setup_type: EventTypes.REGISTERED;
    description: "Notifies a client when an action happens";
    action_tag: "register_event";
    body: { // this field describes how the request body is going to look
        sample: { // this provides a sample of the request
            user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            event_id: "550e8400-e29b-41d4-a716-446655440000",
            payload: {
                first_name: "Samuel",
                last_name: "Smercomish", 
            }
        },
        type: InputTypes.JSON,
    };
    method: HttpMethods.POST;
}
const event = await app.createEvent(details);
```

The following fields can be supplied
- **name**: the name of the notification
- **tag**: supply a unique tag for the 
- **setup_type**: One of the event types
- **description**: A description of the event *optional
- **action_tag**: The unique identifier of the action for registering the tag
- **body**: it describes the data being sent out in an event, you are 
    - **type**: the input type
    - **sample**: a sample object or string showing what an event would look like
- **method**: the HttpMethod of the event request

## Updating an Event

You can update any of the fields above, asides the tag

``` typescript
import { InputTypes } from "ductape/types/enums";
import { app } from "app-instance" // app instance file 

const tag = "notify_client"

const update = {
    action_tag: "register_event";
    body: { // this field describes how the request body is going to look
        sample: { // this provides a sample of the request
            user_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
            event_id: "550e8400-e29b-41d4-a716-446655440000",
            payload: {
                first_name: "Samuel",
                last_name: "Smercomish", 
            }
        },
        type: InputTypes.JSON,
    }
};

const event = await app.updateEvent(tag, data);
```

## Fetching Events
``` typescript
const event = app.fetchEvent(tag); // single event 
```

``` typescript
const events  = app.fetchEvents(); // Fetch all Events
```

