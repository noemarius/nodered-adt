const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function deleteTwinNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const az = RED.nodes.getNode(config.azureDTConfig);
    const { tenantId, clientId, clientSecret, digitalTwinsUrl } = az;

    node.on("input", async (msg) => {
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

        const { twinId } = msg.payload;

        if (!twinId) {
          throw new Error("Payload must contain twinId");
        }

        await digitalTwinsClient.deleteDigitalTwin(twinId);

        msg.payload = {
          success: true,
          message: "Digital twin deleted successfully.",
        };
        node.send(msg);
      } catch (error) {
        node.error(`Error occurred: ${error.message}`, msg);
        msg.payload = {
          success: false,
          error: error.message,
        };
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("deleteTwin", deleteTwinNode);
};
