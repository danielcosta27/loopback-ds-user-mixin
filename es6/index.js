import { deprecate } from 'util';
import blame from './user';

export default deprecate(
  app => app.loopback.modelBuilder.mixins.define('Blame', blame), 
  'DEPRECATED: Use mixinSources'
);

module.exports = exports.default;
