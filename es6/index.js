import { deprecate } from 'util';
import user from './user';

export default deprecate((app) => {
  app.loopback.modelBuilder.mixins.define('Blame', user);
}, 'DEPRECATED: Use mixinSources');

module.exports = exports.default;
