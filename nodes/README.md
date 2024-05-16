# nodered-azure-digitaltwins

## Usage

After installation, the following nodes will be available in the Node-RED editor under the 'function' category:

- `createTwin`
- `deleteTwin`
- `getTwins`
- `batchCreateTwin`
- `batchUpdateTwins`
- `updateTwins`

You can drag and drop these nodes into your flow and double-click on them to configure their properties.

### Configuration Properties

- **Name**: A unique name for the node in your flow.
- **Tenant ID**: The Tenant ID for Azure.
- **Client ID**: The Client ID for Azure.
- **Client Secret**: The Client Secret for Azure.
- **Digital Twins URL**: The URL to the Azure Digital Twins instance.

### Inputs and Outputs

#### `createTwin`

- **Inputs:**
  - `msg.payload.twinId`: The ID of the digital twin to create.
  - `msg.payload.twinData`: The data for the digital twin in JSON format.
- **Outputs:**
  - `msg.payload`: The result from the Azure Digital Twins API.

#### `deleteTwin`

- **Inputs:**
  - `msg.payload.twinId`: The ID of the digital twin to delete.
- **Outputs:**
  - `msg.payload`: The result of the deletion operation.

#### `getTwins`

- **Inputs:**
  - `msg.modelName` (optional): The model name to filter the digital twins. If set to `"all"`, it retrieves all twins.
- **Outputs:**
  - `msg.payload`: The list of digital twins retrieved from the Azure Digital Twins API.

#### `batchCreateTwin`

- **Inputs:**
  - `msg.payload`: An array of objects containing `twinId` and `twinData` for each digital twin to create.
- **Outputs:**
  - `msg.payload`: The results from the Azure Digital Twins API for each created twin.

#### `updateTwins`

- **Inputs:**
  - `msg.payload.twinId`: The ID of the digital twin to update.
  - `msg.payload.patch`: The patch data for the digital twin.
- **Outputs:**
  - `msg.payload`: The result from the Azure Digital Twins API.

#### `batchUpdateTwins`

- **Inputs:**
  - `msg.payload`: An array of objects containing `twinId` and `patch` data for each digital twin to update.
- **Outputs:**
  - `msg.payload`: The results from the Azure Digital Twins API for each updated twin.

### Error Handling

If there is an error in processing any of the digital twins, the respective node will output an error message.

## License

This project is licensed under the MIT License - see [LICENSE](https://raw.githubusercontent.com/noemarius/nodered-adt/main/LICENSE).

---

For more information about Node-RED, visit [https://nodered.org](https://nodered.org).
For more information about Azure Digital Twins, visit [Azure Digital Twins Documentation](https://docs.microsoft.com/en-us/azure/digital-twins/).
