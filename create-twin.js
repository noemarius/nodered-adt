const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function createTwin(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    const tenantId = config.tenantId;
    const clientId = config.clientId;
    const clientSecret = config.clientSecret;
    const digitalTwinsUrl = config.digitalTwinsUrl;

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
        node.error("Failed to create digital twin: " + JSON.stringify(error));
      }
    });
  }

  RED.nodes.registerType("createTwin", createTwin);
};
