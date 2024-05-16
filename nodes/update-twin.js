const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function updateTwinsNode(config) {
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

        const { twinId, patch } = msg.payload;

        if (!twinId || !patch) {
          throw new Error("Payload must contain twinId and patch");
        }

        const result = await digitalTwinsClient.updateDigitalTwin(
          twinId,
          patch
        );

        msg.payload = result;
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

  RED.nodes.registerType("updateTwins", updateTwinsNode);
};
