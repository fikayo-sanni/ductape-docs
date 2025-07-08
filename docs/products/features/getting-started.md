---
sidebar_position: 1
---

# Features in Ductape

A **Feature** in Ductape represents a distinct, reusable unit of business logic or workflow within a product. Features are designed as sequences of actions and events, allowing you to orchestrate complex processes, automate tasks, and integrate with external systems.

Each feature is defined by its input schema, a sequence of events, and an output schema. Features are highly flexible and can be composed of various event types, including actions, notifications, database actions, jobs, and more.

## Primary Components of a Feature

A feature in Ductape has three essential components:

1. **Input**: The schema describing the data or parameters required to start the feature's process. (Type: `Record<string, IFeatureInput>`)
2. **Event Sequence**: An ordered array of actions and events that process the input and perform the feature's logic. (Type: `IFeatureSequence[]`)
3. **Output**: The schema describing the result or data produced by the feature after execution. (Type: `Record<string, string | Record<string, string | object>>`)

## Defining a Feature

Below is an example of defining a feature using the Ductape SDK, referencing the actual types:

```typescript
import { InputTypes, IProductFeature, IFeatureInput, IFeatureSequence } from "ductape-sdk/types";

const input_object: Record<string, IFeatureInput> = {
  username: { type: 'STRING', minlength: 3, maxlength: 20 },
  email: { type: 'EMAIL_STRING' },
};

const sequence_array: IFeatureSequence[] = [
  // Define your event sequence here
];

const output_object: Record<string, string | Record<string, string | object>> = {
  result: "$Sequence{main_sequence}{final_event}{result}" // Example output mapping
};

const details: IProductFeature = {
  name: 'Example Feature',
  description: 'A feature that demonstrates input, sequence, and output.',
  tag: 'example_feature',
  input_type: InputTypes.JSON, // Only 'JSON' is currently supported
  input: input_object,
  sequence: sequence_array,
  output: output_object,
  store_event_results: false, // Optional: whether to store intermediate event results
};

await ductape.product.features.create(details);
```

### Feature Fields

| Field                | Type                                      | Description                                                                                      | Required |
|----------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------|----------|
| `name`               | `string`                                  | Name of the feature.                                                                             | Yes      |
| `description`        | `string`                                  | Description of the feature.                                                                      | Yes      |
| `tag`                | `string`                                  | Unique identifier for the feature, used to reference it within the product.                      | Yes      |
| `input_type`         | `InputTypes`                              | Format of input data. Only `JSON` is currently supported.                                        | Yes      |
| `input`              | `Record<string, IFeatureInput>`           | Schema for input data, validated before processing the event sequence.                           | Yes      |
| `sequence`           | `IFeatureSequence[]`                      | Array of actions and events that define the feature's process.                                   | Yes      |
| `output`             | `Record<string, string \| object>`         | Schema for output data, mapping results from the event sequence.                                 | Yes      |
| `store_event_results`| `boolean`                                 | (Optional) Whether to store intermediate event results for debugging or reuse.                   | No       |

> **Note:** The `input_type` must be `InputTypes.JSON`. Nested objects in input are not supported; use flat key-value pairs.

## Best Practices
- Use descriptive names and tags for features to clarify their purpose.
- Keep input and output schemas as simple and flat as possible for easier validation and maintenance.
- Design event sequences to be modular and reusable across features.
- Use the `store_event_results` flag for debugging or when you need to reference intermediate results.
- Regularly review and update feature definitions as your business logic evolves.

## See Also
- [Defining Inputs](./inputs.md)
- [Defining Output](./output.md)
- [Event Types Overview](/category/event-types)
- [Jobs](../jobs.md)
