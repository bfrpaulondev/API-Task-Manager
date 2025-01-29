// src/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Gerenciador de Tarefas',
    version: '1.0.0',
    description: 'API para gerenciamento de tarefas com Node.js, Express, MongoDB, JWT, etc.'
  },
  servers: [
    {
      url: 'https://api-task-manager-jd6o.onrender.com/',
      description: 'Servidor (HTTPS) do Render'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
