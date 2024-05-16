const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function getTwinsNode(config) {
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

        const query =
          msg.modelName && msg.modelName !== "all"
            ? `SELECT * FROM digitaltwins WHERE IS_OF_MODEL('${msg.modelName}')`
            : `SELECT * FROM digitaltwins`;

        const response = digitalTwinsClient.queryTwins(query);
        let twins = [];

        for await (const page of response.byPage()) {
          twins = twins.concat(page.value);
        }

        msg.payload = twins;
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

  RED.nodes.registerType("getTwins", getTwinsNode);
};
