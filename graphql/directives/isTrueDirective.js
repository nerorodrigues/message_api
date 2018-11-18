const { SchemaDirectiveVisitor } = require('graphql-tools');
const { defaultFieldResolver } = require('graphql');
class IsTrueDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field, details) {
        const { resolve = defaultFieldResolver } = field;
        field.resolve = async (root, args, context, ...rest) => {
            return resolve.call(this, root, args, context, ...rest);
        }
    }
}

module.exports = IsTrueDirective;