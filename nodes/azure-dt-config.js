module.exports = function (RED) {
  function AzureDTConfigNode(n) {
    RED.nodes.createNode(this, n);
    if (n.name) {
      this.name = n.name;
    }
    this.tenantId = n.tenantId;
    this.clientId = n.clientId;
    this.clientSecret = n.clientSecret;
    this.digitalTwinsUrl = n.digitalTwinsUrl;
  }

  RED.nodes.registerType("azureDTConfig", AzureDTConfigNode);
};
