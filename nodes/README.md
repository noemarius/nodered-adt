# Node-RED Azure Digital Twins Nodes

## Overview

This package provides Node-RED nodes to interact with Azure Digital Twins. These nodes allow you to manage digital twins, including creating, deleting, updating, and querying them within your Node-RED flows.

## Nodes Included

- **Azure DT Config**: Configure Azure Digital Twins connection securely.
- **Create Twin**: Create a digital twin.
- **Delete Twin**: Delete a digital twin.
- **Update Twin**: Update a digital twin.
- **Batch Create Twin**: Create multiple digital twins.
- **Batch Delete Twin**: Delete multiple digital twins.
- **Batch Update Twin**: Update multiple digital twins.
- **Delete All Twins**: Delete all digital twins.
- **Get Twins**: Retrieve digital twins.

## Installation

To install this package, run the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install node-red-contrib-azure-digital-twins
```

## Configuration Node: `azure-dt-config`

This node is used to configure the connection to Azure Digital Twins securely using Node-RED's credential storage.

### Properties

- **Name** (optional): A name for the config node.
- **Tenant ID**: Your Azure Active Directory Tenant ID.
- **Client ID**: The Client ID of your Azure AD application.
- **Client Secret**: The Client Secret associated with your Azure AD application (stored securely).
- **Digital Twins URL**: The endpoint URL for your Azure Digital Twins instance.

### Setup Instructions

1. **Azure Credentials**: Ensure you have an Azure AD application registered with the necessary permissions to interact with Azure Digital Twins.
2. **Fill in the Details**: Provide the Tenant ID, Client ID, Client Secret, and Digital Twins URL in the config node.
3. **Secure Client Secret**: The Client Secret is stored securely using Node-RED's credential storage mechanism.

## Nodes

### 1. `createTwin`

Create a digital twin in Azure Digital Twins.

#### Inputs

- **Input**: Accepts a message with `msg.payload` containing:
  - `twinId` (string): The ID of the digital twin to create or update.
  - `twinData` (object): The data for the digital twin.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` containing the result of the successful twin creation.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing error details if the creation fails.

#### Usage Example

```json
{
  "payload": {
    "twinId": "myTwinId",
    "twinData": {
      "$metadata": { "$model": "dtmi:com:example:MyModel;1" },
      "property1": "value1"
    }
  }
}
```

### 2. `deleteTwin`

Delete a digital twin in Azure Digital Twins.

#### Inputs

- **Input**: Accepts a message with `msg.payload` containing:
  - `twinId` (string): The ID of the digital twin to delete.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` confirming successful deletion.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing error details if the deletion fails.

#### Usage Example

```json
{
  "payload": {
    "twinId": "myTwinId"
  }
}
```

### 3. `updateTwin`

Update a digital twin in Azure Digital Twins.

#### Inputs

- **Input**: Accepts a message with `msg.payload` containing:
  - `twinId` (string): The ID of the digital twin to update.
  - `patch` (array): The JSON patch document for the update.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` containing the result of the successful twin update.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing error details if the update fails.

#### Usage Example

```json
{
  "payload": {
    "twinId": "myTwinId",
    "patch": [{ "op": "replace", "path": "/property1", "value": "newValue1" }]
  }
}
```

### 4. `batchCreateTwin`

Create multiple digital twins in Azure Digital Twins.

#### Inputs

- **Input**: Accepts a message with `msg.payload` containing an array of twin objects. Each object should have:
  - `twinId` (string): The ID of the digital twin to create or update.
  - `twinData` (object): The data for the digital twin.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` containing an array of results for successfully created twins.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing an array of errors for twins that failed to create.

#### Usage Example

```json
{
  "payload": [
    {
      "twinId": "twin1",
      "twinData": {
        /* twin data */
      }
    },
    {
      "twinId": "twin2",
      "twinData": {
        /* twin data */
      }
    }
  ]
}
```

### 5. `batchDeleteTwin`

Delete multiple digital twins in Azure Digital Twins.

#### Inputs

- **Input**: Accepts a message with `msg.payload` containing an array of `twinId`s to delete.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` containing an array of twin IDs that were successfully deleted.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing an array of errors for twins that failed to delete.

#### Usage Example

```json
{
  "payload": ["twin1", "twin2", "twin3"]
}
```

### 6. `batchUpdateTwin`

Update multiple digital twins in Azure Digital Twins.

#### Inputs

- **Input**: Accepts a message with `msg.payload` containing an array of twin objects. Each object should have:
  - `twinId` (string): The ID of the digital twin to update.
  - `patch` (array): The JSON patch document for the update.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` containing an array of results for successfully updated twins.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing an array of errors for twins that failed to update.

#### Usage Example

```json
{
  "payload": [
    {
      "twinId": "twin1",
      "patch": [
        /* patch operations */
      ]
    },
    {
      "twinId": "twin2",
      "patch": [
        /* patch operations */
      ]
    }
  ]
}
```

### 7. `deleteAllTwins`

Delete all digital twins in your Azure Digital Twins instance.

#### Inputs

- **Input**: Any message to trigger the operation.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` containing the list of twin IDs that were successfully deleted.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing an array of errors for twins that failed to delete.

#### Usage Note

- **Caution**: This node will attempt to delete all twins in your instance. Use with care.

### 8. `getTwins`

Retrieve digital twins from Azure Digital Twins.

#### Inputs

- **Input**: Accepts a message with `msg.payload` containing (optional):
  - `modelName` (string): The model name to filter the digital twins. If set to `"all"` or omitted, it retrieves all twins.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` containing an array of retrieved twins.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing error details if the retrieval fails.

#### Usage Example

```json
{
  "payload": {
    "modelName": "dtmi:com:example:MyModel;1"
  }
}
```

### 9. `updateTwins`

Update digital twins (supports both single and multiple twins).

#### Inputs

- **Input**: Accepts a message with `msg.payload` containing either:
  - A single twin object with `twinId` and `patch`.
  - An array of twin objects, each with `twinId` and `patch`.

#### Outputs

- **Output 1 (Success)**: Emits a message with `msg.payload` containing the results for successfully updated twins.
- **Output 2 (Errors)**: Emits a message with `msg.payload` containing errors for twins that failed to update.

#### Usage Example (Single Twin)

```json
{
  "payload": {
    "twinId": "twin1",
    "patch": [
      /* patch operations */
    ]
  }
}
```

#### Usage Example (Multiple Twins)

```json
{
  "payload": [
    {
      "twinId": "twin1",
      "patch": [
        /* patch operations */
      ]
    },
    {
      "twinId": "twin2",
      "patch": [
        /* patch operations */
      ]
    }
  ]
}
```

## Error Handling

Each node handles errors gracefully by:

- **Logging Errors**: Errors are logged using Node-RED's `node.error()` function.
- **Error Outputs**: Errors are emitted through the second output of each node, allowing you to handle them separately in your flows.
- **Error Messages**: Error messages include details about what went wrong and, when applicable, the twin IDs involved.

## Examples

### Example Flow: Create and Update a Twin

```json
[
  {
    "id": "inject_create",
    "type": "inject",
    "payload": {
      "twinId": "sensor1",
      "twinData": {
        "$metadata": { "$model": "dtmi:com:example:Sensor;1" },
        "temperature": 25
      }
    }
  },
  {
    "id": "create_twin",
    "type": "createTwin",
    "wires": [["debug_success"], ["debug_error"]]
  },
  {
    "id": "debug_success",
    "type": "debug",
    "name": "Create Success"
  },
  {
    "id": "debug_error",
    "type": "debug",
    "name": "Create Error"
  },
  {
    "id": "inject_update",
    "type": "inject",
    "payload": {
      "twinId": "sensor1",
      "patch": [{ "op": "replace", "path": "/temperature", "value": 30 }]
    }
  },
  {
    "id": "update_twin",
    "type": "updateTwin",
    "wires": [["debug_success"], ["debug_error"]]
  }
]
```

## License

This project is licensed under the MIT License - see [LICENSE](https://raw.githubusercontent.com/noemarius/nodered-adt/main/LICENSE).

## Resources

- **Node-RED**: [https://nodered.org](https://nodered.org)
- **Azure Digital Twins Documentation**: [Azure Digital Twins Documentation](https://docs.microsoft.com/en-us/azure/digital-twins/)
- **Azure Digital Twins Query Language**: [Learn about the query language](https://docs.microsoft.com/en-us/azure/digital-twins/concepts-query-language)

## Support

If you encounter any issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/noemarius/nodered-adt).

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

---

_Note: Replace placeholders like `/_ twin data _/`and`/_ patch operations _/` with actual data according to your use case._
