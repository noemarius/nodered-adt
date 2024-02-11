# nodered-adt

## Usage

After installation, the `createTwin` node will be available in the Node-RED editor under the 'function' category. You can drag and drop the node into your flow and double-click on it to configure its properties.

### Configuration Properties

- **Name**: A unique name for the node in your flow.
- **Tenant ID**: The Tenant ID for Azure.
- **Client ID**: The Client ID for Azure.
- **Client Secret**: The Client Secret for Azure.
- **Digital Twins URL**: The URL to the Azure Digital Twins instance.

### Inputs

- **msg.payload.twinId**: The ID of the digital twin to create or update.
- **msg.payload.twinData**: The data for the digital twin in JSON format.

### Outputs

- **msg.payload**: The result from the Azure Digital Twins API.

### Error Handling

If there is an error in creating the digital twin, the node will output an error message.

## Example

Here is a simple example of how to use the `createTwin` node:

1. Drag and drop the `createTwin` node into your flow.
2. Configure the Azure credentials and Digital Twins URL in the node settings.
3. Add an inject node to provide the necessary `twinId` and `twinData`.
4. Add a debug node to capture the output of the `createTwin` node.
5. Deploy the flow and trigger the inject node.

This flow will create or update a digital twin in Azure Digital Twins and output the result.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file in this repository for details.

---

For more information about Node-RED, visit [https://nodered.org](https://nodered.org).
For more information about Azure Digital Twins, visit [Azure Digital Twins Documentation](https://docs.microsoft.com/en-us/azure/digital-twins/).
