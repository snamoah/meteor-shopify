Shopify = Shopify || {};

// Request Shopify credentials for the user
// @param shopUrl {required}
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Shopify.requestCredential = function (shopUrl, options, credentialRequestCompleteCallback) {
  
  // throw error if shop name doesn't exist
  if (typeof shopUrl !== 'string') {
  	throw new Meteor.Error(400, 'Shop name is required');
  }

  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({service: 'shopify'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }
  var credentialToken = Random.secret();

  var scope = (options && options.requestPermissions) || ['read_content'];

  var loginStyle = OAuth._loginStyle('shopify', config, options);


  var loginUrl = shopUrl + '/admin/oauth/authorize' +
    '?client_id=' + config.clientId +
    '&scope=' + scope.join(',') +
    '&redirect_uri=' + OAuth._redirectUri('shopify', config) +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl);

  OAuth.launchLogin({
    loginService: "shopify",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken,
    popupOptions: {width: 900, height: 450}
  });
};