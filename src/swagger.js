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
      url: 'https://localhost:3000',
      description: 'Servidor (HTTPS) local'
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
