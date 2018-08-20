/* jshint ignore:start */
Package.describe({
  name: 'MOAC:tx',
  version: '0.1.0',
  summary: 'MOAC tx JavaScript lib, use to sign the MOAC raw transaction',
  git: 'https://github.com/mdranger/moac-tx.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "xmlhttprequest": "1.7.0"
});


Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');

  api.export(['Chain3', 'BigNumber'], ['client', 'server']);

  api.addFiles('dist/chain3.js', ['client', 'server']);
  api.addFiles('package-init.js', ['client', 'server']);
});

