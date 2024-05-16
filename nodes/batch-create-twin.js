const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function batchCreateTwin(config) {
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
        node.error("Error Msg: " + error.message);
        node.error("Error Stack: " + error.stack);
      }
    });
  }

  RED.nodes.registerType("batchCreateTwin", batchCreateTwin);
};
