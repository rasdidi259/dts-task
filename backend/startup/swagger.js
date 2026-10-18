const { model } = require('mongoose');
const {path, serve, swaggerJsdoc, swaggerUi} = require('../config/setupmodules');
const { taskSchema } = require('../model/task');

const options ={
    definition:{
        openapi:'3.0.0',
        info:{title:'Task Web API', version:'1.0.0'},
    },
    apis:['./routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(options);
function setupSwagger(app) {
    app.use('/api-docs', serve, swaggerUi.setup(swaggerSpecs));
    console.log('Swagger UI is available at /api-docs')
}

module.exports = setupSwagger;