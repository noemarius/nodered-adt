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

        // Retrieve modelName from msg.payload or default to 'all'
        const modelName =
          msg.payload && msg.payload.modelName ? msg.payload.modelName : "all";

        const query =
          modelName && modelName !== "all"
            ? `SELECT * FROM digitaltwins WHERE IS_OF_MODEL('${modelName}')`
            : `SELECT * FROM digitaltwins`;

        const response = digitalTwinsClient.queryTwins(query);
        const twins = [];

        for await (const twin of response) {
          twins.push(twin);
        }

        const successMsg = RED.util.cloneMessage(msg);
        successMsg.payload = twins;
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

  RED.nodes.registerType("getTwins", getTwinsNode);
};
