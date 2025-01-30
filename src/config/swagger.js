// src/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Gerenciador de Tarefas',
    version: '2.0.0',
    description: 'API com Workflows, Tipos de Tarefa, Uploads, e muito mais.'
  },
  servers: [
    {
      url: 'https://api-task-manager-jd6o.onrender.com',
      description: 'API SERVER'
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  tags: [
    {
      name: 'Geral',
      description: 'Endpoints gerais'
    },
    {
      name: 'Usuários',
      description: 'Endpoints para cadastro, login e gerenciamento de usuários'
    },
    {
      name: 'Workflows',
      description: 'Endpoints para criação e gerenciamento de Workflows (somente admin)'
    },
    {
      name: 'TaskTypes',
      description: 'Endpoints para criação e gerenciamento de tipos de tarefas (campos dinâmicos, somente admin)'
    },
    {
      name: 'Tarefas',
      description: 'CRUD de tarefas, uploads, favoritos, etc.'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/app.js'] // Inclui app.js para capturar a rota raiz
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
