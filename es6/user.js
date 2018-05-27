import _debug from './debug';

const debug = _debug();
const warn = (options, message) => {
    if (!options.silenceWarnings) {
        console.warn(message);
    }
};

export default (Model, bootOptions = {}) => {
    debug('User mixin for Model %s', Model.modelName);

    const options = Object.assign({
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
        warn(options, `${Model.pluralModelName} settings.validateUpsert was overriden to false`);
    }

    if (Model.settings.validateUpsert && options.required) {
        warn(options, `Upserts for ${Model.pluralModelName} will fail when
          validation is turned on and time stamps are required`);
    }

    const type = !options.dsName ? 'string' : Model.app.datasources[options.dsName].connector.getDefaultIdType();

    Model.defineProperty(options.createdBy, {
        type: type,
        required: options.required
    });

    Model.defineProperty(options.updatedBy, {
        type: type,
        required: options.required
    });

    Model.observe('before save', (ctx, next) => {
        debug('ctx.options', ctx.options);
        const token = ctx.options && ctx.options.accessToken;
        const userId = token && token.userId;

        if (ctx.options && ctx.options.skipUpdatedBy) { return next(); }

        if (!userId) { return next(); }

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
