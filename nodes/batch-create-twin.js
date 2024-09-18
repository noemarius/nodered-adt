const { ClientSecretCredential } = require("@azure/identity");
const { DigitalTwinsClient } = require("@azure/digital-twins-core");

module.exports = function (RED) {
  function batchCreateTwin(config) {
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
          twinArray.map(async (twin) => {
            const { twinId, twinData } = twin;
            return digitalTwinsClient.upsertDigitalTwin(
              twinId,
              JSON.stringify(twinData)
            );
          })
        );

        const successes = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        const errors = results
          .filter((result) => result.status === "rejected")
          .map((result, index) => ({
            twin: twinArray[index],
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

  RED.nodes.registerType("batchCreateTwin", batchCreateTwin);
};
