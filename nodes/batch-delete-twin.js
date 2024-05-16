const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function batchDeleteTwinNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const az = RED.nodes.getNode(config.azureDTConfig);
    const tenantId = az.tenantId;
    const clientId = az.clientId;
    const clientSecret = az.clientSecret;
    const digitalTwinsUrl = az.digitalTwinsUrl;

    node.on("input", async function (msg) {
      try {
        const credential = new ClientSecretCredential(
          tenantId,
          clientId,
          clientSecret
        );

        const digitalTwinsClient = new DigitalTwinsClient(
          digitalTwinsUrl,
          credential
        );

        const twinArray = msg.payload;

        if (!Array.isArray(twinArray)) {
          throw new Error("Payload is not an array");
        }

        if (twinArray.length !== 0) {
          throw new Error("Payload array empty");
        }

        const result = [];
        for (const twinId of twinArray) {
          const response = await digitalTwinsClient.deleteDigitalTwin(twinId);
          result.push(response);
        }

        msg.payload = {
          success: true,
          message: "Digital twin deleted successfully.",
        };

        node.send(msg);
      } catch (error) {
        node.error("Error Msg: " + error.message);
        node.error("Error Stack: " + error.stack);
      }
    });
  }

  RED.nodes.registerType("batchDeleteTwin", batchDeleteTwinNode);
};
