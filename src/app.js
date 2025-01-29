// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Rotas
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Middleware de autenticação
const authMiddleware = require('./config/auth');

// Conexão ao MongoDB
(async function connectDB() {
  try {
    // A partir do Mongoose 7, não precisa mais de useNewUrlParser etc.
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error);
    process.exit(1);
  }
})();

const app = express();

// Configurar CORS
app.use(cors());

// Para interpretar JSON no body
app.use(express.json());

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.send(`
    <h1>Bem-vindo(a) à API de Gerenciamento de Tarefas!</h1>
    <p>Acesse a documentação Swagger em: <a href="/api-docs">/api-docs</a></p>
  `);
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas Públicas (Cadastro e Login)
app.use('/usuarios', userRoutes);

// Rotas Protegidas (Tarefas) - exige JWT
app.use('/tarefas', authMiddleware, taskRoutes);

module.exports = app;
