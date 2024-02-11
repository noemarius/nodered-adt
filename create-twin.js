const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function createTwin(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    const tenantId = node.tenantId;
    const clientId = node.clientId;
    const clientSecret = node.clientSecret;
    const digitalTwinsUrl = node.digitalTwinsUrl;

    node.on("input", async function (msg) {
      const credential = new ClientSecretCredential(
        tenantId,
        clientId,
        clientSecret
      );
      const digitalTwinsClient = new DigitalTwinsClient(
        digitalTwinsUrl,
        credential
      );

      try {
        const digitalTwinId = msg.payload.twinId;
        const digitalTwinData = msg.payload.twinData;

        const result = await digitalTwinsClient.upsertDigitalTwin(
          digitalTwinId,
          JSON.stringify(digitalTwinData)
        );

        msg.payload = result;
        node.send(msg);
      } catch (error) {
        node.error("Failed to create digital twin: " + error.message);
      }
    });
  }
  RED.nodes.registerType("createTwin", createTwin);
};
