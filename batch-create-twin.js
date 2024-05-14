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
        const twinArray = msg.payload;
        if (!Array.isArray(twinArray)) {
          throw new Error("Payload is not an array");
        }

        const results = [];
        for (const twin of twinArray) {
          const digitalTwinId = twin.twinId;
          const digitalTwinData = twin.twinData;

          const result = await digitalTwinsClient.upsertDigitalTwin(
            digitalTwinId,
            JSON.stringify(digitalTwinData)
          );
          results.push(result);
        }

        msg.payload = results;
        node.send(msg);
      } catch (error) {
        node.error("Failed to create digital twins: " + JSON.stringify(error));
      }
    });
  }

  RED.nodes.registerType("createTwin", createTwin);
};
