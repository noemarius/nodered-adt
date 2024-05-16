# nodered-azure-digitaltwins

## Overview

This repository provides a collection of Node-RED nodes for interacting with Azure Digital Twins. These nodes enable you to create, delete, update, and query digital twins within your Node-RED flows, facilitating the integration of Azure Digital Twins with other systems and services.

## Features

- **Azure DT Config**: Configure Azure Digital Twins connection.
- **Create Twin**: Create a digital twin.
- **Delete Twin**: Delete a digital twin.
- **Update Twin**: Update a digital twin.
- **Batch Create Twin**: Create multiple digital twins.
- **Batch Delete Twin**: Delete multiple digital twins.
- **Batch Update Twin**: Update multiple digital twins.
- **Delete All Twins**: Delete all digital twins.
- **Get Twins**: Retrieve digital twins.

## Installation

To install the Node-RED nodes from this repository, follow these steps:

1. Open the Node-RED editor in your browser.

2. Go to the main menu (top right corner) and select "Manage palette".

3. In the "Palette" tab, click on the "Install" tab.

4. Search for `@noemarius/nodered-azure-digitaltwins`.

5. Click the install button next to the `@noemarius/nodered-azure-digitaltwins` package.

## Usage

After installation, the following nodes will be available in the Node-RED editor under the 'function' category:

- `azure-dt-config`
- `createTwin`
- `deleteTwin`
- `updateTwin`
- `batchCreateTwin`
- `batchDeleteTwin`
- `batchUpdateTwin`
- `deleteAllTwins`
- `getTwins`

You can drag and drop these nodes into your flow and double-click on them to configure their properties.

For detailed usage instructions and configuration properties for each node, please refer to the [nodes README](nodes/README.md).

## License

This project is licensed under the MIT License - see [LICENSE](https://raw.githubusercontent.com/noemarius/nodered-adt/main/LICENSE).

## Resources

- For more information about Node-RED, visit [https://nodered.org](https://nodered.org).
- For more information about Azure Digital Twins, visit [Azure Digital Twins Documentation](https://docs.microsoft.com/en-us/azure/digital-twins/).
