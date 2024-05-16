const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function getTwinsNode(config) {
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

        let query;
        if (msg.modelName && msg.modelName !== "all") {
          query = `SELECT * FROM digitaltwins WHERE IS_OF_MODEL('${modelName}')`;
        } else {
          query = `SELECT * FROM digitaltwins`;
        }

        const response = await digitalTwinsClient.queryTwins(query);

        let twins = [];

        for await (const page of response.byPage()) {
          twins = twins.concat(page.value);
        }

        msg.payload = twins;
        node.send(msg);
      } catch (error) {
        node.error("Error Msg: " + error.message);
        node.error("Error Stack: " + error.stack);
      }
    });
  }

  RED.nodes.registerType("getTwins", getTwinsNode);
};
