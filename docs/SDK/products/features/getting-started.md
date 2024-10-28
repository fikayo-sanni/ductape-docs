---
sidebar_position: 1
---

# Features in Ductape

In Ductape, a **product** is a collection of features, with each feature representing a distinct functionality. Features are designed as a sequence of actions and events executed in a specific order to fulfill a defined task, making Ductape highly adaptable for complex workflows.

## Primary Components of a Feature

A feature in Ductape has three essential components:
1. **tag**: feature unique identifier
2. **input_type**: `InputTypes` enum field, currently features only support `JSON` inputs
1. **Input**: Data or parameters required to start the feature's process.
2. **Event Sequence**: A series of actions and events performed in a sequence to process the input and complete the feature's task.
3. **Output**: The result generated after the execution of the event sequence.

Each component has a unique structure and purpose, allowing you to create complex functionalities in Ductape.

---

## Defining a Feature

Below is an example of defining a feature, including details on each necessary field.

```typescript
import { AuthTypes, InputTypes, DataTypes, FeatureEventTypes } from "ductape/types/enums";

// ... productBuilder instance

const sequence_array: IFeatureSequence[] = []; // Define the event sequence here
const input_object: Record<string, IFeatureInput> = {}; // Define input schema here
const output_object: Record<string, IFeatureInput> = {}; // Define output schema here

const details: IProductFeature = {
    tag: 'example_feature',
    input_type: InputTypes.JSON,
    input: input_object,
    sequence: sequence_array,
    output: output_object,
}

await product.createFeature(details);
```

### Feature Fields

| Field        | Type                            | Description                                                                                      | Required |
|--------------|---------------------------------|--------------------------------------------------------------------------------------------------|----------|
| `tag`        | `string`                        | Unique identifier for the feature, used to reference the feature within the product.             | Yes      |
| `input_type` | `InputTypes`                    | Defines the format of input data. Currently, Ductape supports only `JSON` as the input type.     | Yes      |
| `input`      | `Record<string, IFeatureInput>` | Defines the schema for input data, which is validated before processing the event sequence.      | Yes       |
| `sequence`   | `IFeatureSequence[]`            | Array of actions and events that define the feature's process.                                   | Yes      |
| `output`     | `Record<string, IFeatureInput>` | Defines the schema for output data, providing a structure for the final result of the feature.   | Yes       |