module.exports = function (RED) {
  function AzureDTConfigNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.name = n.name;
    node.tenantId = n.tenantId;
    node.clientId = n.clientId;
    node.clientSecret = node.credentials.clientSecret;
    node.digitalTwinsUrl = n.digitalTwinsUrl;

    // Input Validation
    if (!node.tenantId) {
      node.error("Tenant ID is required");
    }
    if (!node.clientId) {
      node.error("Client ID is required");
    }
    if (!node.clientSecret) {
      node.error("Client Secret is required");
    }
    if (!node.digitalTwinsUrl) {
      node.error("Digital Twins URL is required");
    }
  }

  RED.nodes.registerType("azureDTConfig", AzureDTConfigNode, {
    credentials: {
      clientSecret: { type: "password" },
    },
  });
};
