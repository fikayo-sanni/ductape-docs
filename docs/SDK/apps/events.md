---
sidebar_position: 7
---

# Managing Webhooks

In the case where your application serves external notifications in  the form of events and webhooks. Ductape provides the means for third parties to register for such events and webhooks. You would have to have an action in your imported documentation that is used for registering for webhooks. We would be needing to leverage this action

## Registering an Event

You can register an event using the `createEvent` endpoint from the app builder instance


``` typescript

import { app } from "app-instance" // app instance file 
const details = {

}
app.createEvent();
```

## Updating an Event

``` typescript
import { app } from "app-instance" // app instance file 

const tag = "notify_client"

const update ={

};

app.updateEvent(tag, data);
```

## Fetching an Event
``` typescript
app.fetchEvent(tag): IAppEvent;
```


## Fetching all Events
``` typescript
app.fetchEvents(): Array<IAppEvent>;
```

