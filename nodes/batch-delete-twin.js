const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function batchDeleteTwinNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const az = RED.nodes.getNode(config.azureDTConfig);
    const { tenantId, clientId, clientSecret, digitalTwinsUrl } = az;

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
          throw new Error(
            `Payload is not an array, ${JSON.stringify(msg.payload)}`
          );
        }

        if (twinArray.length === 0) {
          throw new Error(
            `Payload array is empty, ${JSON.stringify(msg.payload)}`
          );
        }

        const results = await Promise.allSettled(
          twinArray.map(async (twinId) => {
            return digitalTwinsClient.deleteDigitalTwin(twinId);
          })
        );

        const successes = results
          .map((result, index) => ({ result, index }))
          .filter(({ result }) => result.status === "fulfilled")
          .map(({ index }) => twinArray[index]);

        const errors = results
          .map((result, index) => ({ result, index }))
          .filter(({ result }) => result.status === "rejected")
          .map(({ result, index }) => ({
            twinId: twinArray[index],
            error: result.reason.message || result.reason,
          }));

        const successMsg = RED.util.cloneMessage(msg);
        successMsg.payload = successes;

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

  RED.nodes.registerType("batchDeleteTwin", batchDeleteTwinNode);
};
