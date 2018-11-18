const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql')

class LoggedInDirective extends SchemaDirectiveVisitor {
    visitObject(type) {
        this.constructor.ensureFieldsWrapped(type);
        type._requiredAuth = true;
    }

    visitFieldDefinition(field, details) {
        this.constructor.ensureFieldsWrapped(details.objectType);
        field._requiredAuth = true;
    }


    static ensureFieldsWrapped(type) {
        if (type._authFieldsWrapped) return;
        type._authFieldsWrapped = true;

        Object.values(type.getFields()).forEach((field) => {
            const { resolve = defaultFieldResolver } = field;

            field.resolve = async (root, args, context, ...rest) => {
                const requiredAuth = type._requiredAuth || field._requiredAuth;
                if (!requiredAuth)
                    return resolve.call(this, root, args, context, ...rest);
                if (!context.user)
                    throw new Error('Not authenticated.');
                return resolve.call(this, root, args, context, ...rest);
            }
        });
    }
}

module.exports = LoggedInDirective;