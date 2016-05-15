/* global require, module */

var Angular2App = require('angular-cli/lib/broccoli/angular2-app');

module.exports = function(defaults) {
  return new Angular2App(defaults, {
    vendorNpmFiles: [
      'systemjs/dist/system-polyfills.js',
      'systemjs/dist/system.src.js',
      'zone.js/dist/*.js',
      'es6-shim/es6-shim.js',
      'reflect-metadata/*.js',
      'rxjs/**/*.js',
      '@angular/**/*.js',
      '@angular2-material/**/*.+(js|map|css|svg)',
      'angularfire2/**/*.js',
      'firebase/lib/firebase-web.js',
      'hammerjs/hammer.min.js',
      'material-design-icons/iconfont/MaterialIcons-Regular.+(woff|woff2)',
      '@ngrx/**/*.js'
    ]
  });
};
