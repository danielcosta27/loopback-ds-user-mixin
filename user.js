'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)();
var warn = function warn(options, message) {
    if (!options.silenceWarnings) {
        console.warn(message);
    }
};

exports.default = function (Model) {
    var bootOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    debug('User mixin for Model %s', Model.modelName);

    var options = _extends({
        createdBy: 'createdBy',
        updatedBy: 'updatedBy',
        required: false,
        validateUpsert: false, // default to turning validation off
        silenceWarnings: false,
        dsName: null
    }, bootOptions);

    debug('options', options);

    if (!options.validateUpsert && Model.settings.validateUpsert) {
        Model.settings.validateUpsert = false;
        warn(options, Model.pluralModelName + ' settings.validateUpsert was overriden to false');
    }

    if (Model.settings.validateUpsert && options.required) {
        warn(options, 'Upserts for ' + Model.pluralModelName + ' will fail when\n          validation is turned on and time stamps are required');
    }

    var type = !options.dsName ? 'string' : Model.app.datasources[options.dsName].connector.getDefaultIdType();

    Model.defineProperty(options.createdBy, {
        type: type,
        required: options.required
    });

    Model.defineProperty(options.updatedBy, {
        type: type,
        required: options.required
    });

    Model.observe('before save', function (ctx, next) {
        debug('ctx.options', ctx.options);
        var token = ctx.options && ctx.options.accessToken;
        var userId = token && token.userId;

        if (ctx.options && ctx.options.skipUpdatedBy) {
            return next();
        }

        if (!userId) {
            return next();
        }

        if (ctx.instance) {
            if (ctx.isNewInstance) {
                // FIXME: check for support of ctx.isNewInstance
                ctx.instance[options.createdBy] = userId;
            }
            ctx.instance[options.updatedBy] = userId;
        } else {
            ctx.data[options.updatedBy] = userId;
        }
        return next();
    });
};

module.exports = exports.default;
//# sourceMappingURL=user.js.map
