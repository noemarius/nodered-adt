const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function createTwinNode(config) {
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

        const { twinId, twinData } = msg.payload;

        if (!twinId || !twinData) {
          throw new Error(
            `Payload must contain twinId and twinData, ${JSON.stringify(
              msg.payload
            )}`
          );
        }

        const result = await digitalTwinsClient.upsertDigitalTwin(
          twinId,
          JSON.stringify(twinData)
        );

        const successMsg = RED.util.cloneMessage(msg);
        successMsg.payload = result;

        node.send([successMsg, null]);
      } catch (error) {
        node.error(`Error occurred: ${error.message}`, msg);

        const errorMsg = RED.util.cloneMessage(msg);
        errorMsg.payload = {
          success: false,
          error: error.message,
        };

        node.send([null, errorMsg]);
      }
    });
  }

  RED.nodes.registerType("createTwin", createTwinNode);
};
