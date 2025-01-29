// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Conexão ao MongoDB (remover useNewUrlParser e useUnifiedTopology se estiver usando Mongoose 6+)
const connectDB = require('./config/db');
connectDB();

// Middleware de autenticação
const authMiddleware = require('./middlewares/auth');

// Rotas de usuários e tarefas
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Se estiver usando Swagger para documentação
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Inicializa a aplicação
const app = express();

// Configurações de CORS (exemplo simples, ajuste conforme necessidade)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Para que a aplicação possa interpretar JSON no corpo das requisições
app.use(express.json());

// Rota de documentação (Swagger), se estiver usando
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * ROTA DE BOAS-VINDAS
 * Aqui mostramos uma mensagem amistosa para quem acessar a raiz do servidor.
 */
app.get('/', (req, res) => {
  res.send(`
    <h1>Bem-vindo ao Gerenciador de Tarefas!</h1>
    <p>Para acessar a documentação completa da API, visite: <a href="/api-docs">/api-docs</a></p>
    <p>Recursos principais:</p>
    <ul>
      <li><strong>/usuarios</strong> – Endpoints para cadastro e login.</li>
      <li><strong>/tarefas</strong> – Endpoints para criar, listar, editar, excluir e concluir tarefas (requer autenticação).</li>
    </ul>
    <p>Use um cliente HTTP (como Insomnia ou Postman) ou seu front-end para consumir esta API.</p>
    <p><em>Bom proveito!</em></p>
  `);
});

// Rotas de usuários (cadastro, login, etc.)
app.use('/usuarios', userRoutes);

// Rotas de tarefas (protegidas por JWT)
app.use('/tarefas', authMiddleware, taskRoutes);

module.exports = app;
