Shopify = {};

OAuth.registerService('shopify', 2, null, function(query) {

  var accessToken = getAccessToken(query);

  return {
    serviceData: {
      shop: query.shop,
      accessToken: OAuth.sealSecret(accessToken)
    }
  };
});

var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'shopify'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://" + query.shop + "/admin/oauth/access_token", {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent
        },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret)
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Shopify. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Shopify. " + response.data.error);
  } else {
    return response.data.access_token;
  }
};

Shopify.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};