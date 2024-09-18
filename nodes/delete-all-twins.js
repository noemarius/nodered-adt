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
        const iterator = digitalTwinsClient.queryTwins(query);

        const twinIds = [];
        for await (const twin of iterator) {
          twinIds.push(twin.$dtId);
        }

        if (twinIds.length === 0) {
          throw new Error(
            `"No digital twins found to delete, existing twins ${JSON.stringify(
              twinIds.length
            )}`
          );
        }

        const results = await Promise.allSettled(
          twinIds.map((twinId) => digitalTwinsClient.deleteDigitalTwin(twinId))
        );

        const successes = results
          .map((result, index) => ({ result, index }))
          .filter(({ result }) => result.status === "fulfilled")
          .map(({ index }) => twinIds[index]);

        const errors = results
          .map((result, index) => ({ result, index }))
          .filter(({ result }) => result.status === "rejected")
          .map(({ result, index }) => ({
            twinId: twinIds[index],
            error: result.reason.message || result.reason,
          }));

        const successMsg = RED.util.cloneMessage(msg);
        successMsg.payload = {
          success: true,
          deletedTwins: successes,
          message: "Digital twins deleted successfully.",
        };

        const errorMsg = RED.util.cloneMessage(msg);
        errorMsg.payload = errors;

        if (!errors) {
          node.send([successMsg, null]);
        } else {
          node.send([successMsg, errorMsg]);
        }
      } catch (error) {
        node.error(`Error occurred: ${error.message}`, msg);
        const errorMsg = RED.util.cloneMessage(msg);
        errorMsg.payload = [
          {
            error: error.message || error,
          },
        ];
        node.send([null, errorMsg]);
      }
    });
  }

  RED.nodes.registerType("deleteAllTwins", deleteAllTwinsNode);
};
