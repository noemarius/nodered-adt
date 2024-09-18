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
          throw new Error(
            `Payload must contain twinId, ${JSON.stringify(msg.payload)}`
          );
        }

        await digitalTwinsClient.deleteDigitalTwin(twinId);

        const successMsg = RED.util.cloneMessage(msg);
        successMsg.payload = {
          success: true,
          message: "Digital twin deleted successfully.",
          twinId: twinId,
        };
        node.send([successMsg, null]);
      } catch (error) {
        node.error(`Error occurred: ${error.message}`, msg);

        const errorMsg = RED.util.cloneMessage(msg);
        errorMsg.payload = {
          success: false,
          error: error.message,
          twinId: msg.payload.twinId || null,
        };
        node.send([null, errorMsg]);
      }
    });
  }

  RED.nodes.registerType("deleteTwin", deleteTwinNode);
};
