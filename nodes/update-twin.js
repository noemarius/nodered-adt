const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function updateTwinNode(config) {
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
          throw new Error(
            `Payload must contain twinId and patch, ${JSON.stringify(
              msg.payload
            )}`
          );
        }

        await digitalTwinsClient.updateDigitalTwin(twinId, patch);

        const successMsg = RED.util.cloneMessage(msg);

        successMsg.payload = {
          success: true,
          message: "Digital twin updated successfully.",
          twinId: twinId,
        };

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

  RED.nodes.registerType("updateTwin", updateTwinNode);
};
