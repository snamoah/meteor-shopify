Package.describe({
  name: 'snamoah:shopify',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Shopify OAuth flow',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/snamoah/meteor-shopify',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Shopify');

  api.addFiles('shopify_client.js', 'client');
  api.addFiles('shopify_server.js', 'server');
});
