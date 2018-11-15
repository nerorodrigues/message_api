const glue = require('schemaglue');

const getSchemas = async () => {
    return await glue('graphql/types');
}

module.exports = getSchemas;