'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _blame = require('./blame');

var _blame2 = _interopRequireDefault(_blame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _util.deprecate)(function (app) {
  return app.loopback.modelBuilder.mixins.define('Blame', _blame2.default);
}, 'DEPRECATED: Use mixinSources');


module.exports = exports.default;
//# sourceMappingURL=index.js.map
