const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function deleteTwin(config) {
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

        const digitalTwinId = msg.payload.twinId;

        await digitalTwinsClient.deleteDigitalTwin(digitalTwinId);

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

  RED.nodes.registerType("deleteTwin", deleteTwin);
};
