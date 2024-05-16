const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function deleteAllTwinsNode(config) {
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

        const query = `SELECT * FROM digitaltwins`;
        const response = digitalTwinsClient.queryTwins(query);

        for await (const page of response.byPage()) {
          const deletePromises = page.value.map((twin) =>
            digitalTwinsClient.deleteDigitalTwin(twin.$dtId)
          );
          await Promise.all(deletePromises);
        }

        msg.payload = {
          success: true,
          message: "Digital twins deleted successfully.",
        };
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

  RED.nodes.registerType("deleteAllTwins", deleteAllTwinsNode);
};
