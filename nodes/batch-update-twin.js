const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function batchUpdateTwinsNode(config) {
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

        const twinArray = msg.payload;
        if (!Array.isArray(twinArray)) {
          throw new Error("Payload is not an array");
        }

        if (twinArray.length === 0) {
          throw new Error("Payload array is empty");
        }

        const results = await Promise.all(
          twinArray.map(async (twin) => {
            const { twinId, patch } = twin;
            if (!twinId || !patch) {
              throw new Error(
                "Each twin in payload must contain twinId and patch"
              );
            }
            return digitalTwinsClient.updateDigitalTwin(twinId, patch);
          })
        );

        msg.payload = results;
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

  RED.nodes.registerType("batchUpdateTwins", batchUpdateTwinsNode);
};
