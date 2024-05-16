# Node-RED Azure Digital Twins Nodes

## Overview

This package provides Node-RED nodes to interact with Azure Digital Twins. These nodes allow you to manage digital twins, including creating, deleting, updating, and querying them within your Node-RED flows.

## Nodes Included

- **Azure DT Config**: Configure Azure Digital Twins connection.
- **Create Twin**: Create a digital twin.
- **Delete Twin**: Delete a digital twin.
- **Update Twin**: Update a digital twin.
- **Batch Create Twin**: Create multiple digital twins.
- **Batch Delete Twin**: Delete multiple digital twins.
- **Batch Update Twin**: Update multiple digital twins.
- **Delete All Twins**: Delete all digital twins.
- **Get Twins**: Retrieve digital twins.

## Configuration Properties

### `azure-dt-config`

This node is used to configure the connection to Azure Digital Twins. It does not have inputs or outputs.

### `createTwin`

- **Inputs:**
  - `msg.payload.twinId`: The ID of the digital twin to create.
  - `msg.payload.twinData`: The data for the digital twin in JSON format.
- **Outputs:**
  - `msg.payload`: The result from the Azure Digital Twins API.

### `deleteTwin`

- **Inputs:**
  - `msg.payload.twinId`: The ID of the digital twin to delete.
- **Outputs:**
  - `msg.payload`: The result of the deletion operation.

### `updateTwin`

- **Inputs:**
  - `msg.payload.twinId`: The ID of the digital twin to update.
  - `msg.payload.patch`: The patch data for the digital twin.
- **Outputs:**
  - `msg.payload`: The result from the Azure Digital Twins API.

### `batchCreateTwin`

- **Inputs:**
  - `msg.payload`: An array of objects containing `twinId` and `twinData` for each digital twin to create.
- **Outputs:**
  - `msg.payload`: The results from the Azure Digital Twins API for each created twin.

### `batchDeleteTwin`

- **Inputs:**
  - `msg.payload`: An array of twin IDs to delete.
- **Outputs:**
  - `msg.payload`: The results from the Azure Digital Twins API for each deleted twin.

### `batchUpdateTwin`

- **Inputs:**
  - `msg.payload`: An array of objects containing `twinId` and `patch` data for each digital twin to update.
- **Outputs:**
  - `msg.payload`: The results from the Azure Digital Twins API for each updated twin.

### `deleteAllTwins`

- **Inputs:**
  - No specific inputs required.
- **Outputs:**
  - `msg.payload`: The results from the Azure Digital Twins API after attempting to delete all twins.

### `getTwins`

- **Inputs:**
  - `msg.modelName` (optional): The model name to filter the digital twins. If set to `"all"`, it retrieves all twins.
- **Outputs:**
  - `msg.payload`: The list of digital twins retrieved from the Azure Digital Twins API.

## Error Handling

If there is an error in processing any of the digital twins, the respective node will output an error message.

## License

This project is licensed under the MIT License - see [LICENSE](https://raw.githubusercontent.com/noemarius/nodered-adt/main/LICENSE).

## Resources

- For more information about Node-RED, visit [https://nodered.org](https://nodered.org).
- For more information about Azure Digital Twins, visit [Azure Digital Twins Documentation](https://docs.microsoft.com/en-us/azure/digital-twins/).
