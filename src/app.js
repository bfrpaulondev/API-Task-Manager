// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

// Configurações
const connectDB = require('./config/db');
const logger = require('./config/logger');
const swaggerSpec = require('./config/swagger');

// Middlewares
const authMiddleware = require('./middlewares/auth');

// Rotas
const userRoutes = require('./routes/userRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const taskTypeRoutes = require('./routes/taskTypeRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Inicia a aplicação Express
const app = express();

// Conecta ao banco de dados
connectDB();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de Boas-Vindas
/**
 * @swagger
 * /:
 *   get:
 *     summary: Mensagem de boas-vindas
 *     tags: [Geral]
 *     responses:
 *       200:
 *         description: Mensagem de boas-vindas
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get('/', (req, res) => {
  res.send('Bem-vindo ao Gerenciador de Tarefas API!');
});

// Documentação com Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas de usuários (cadastro, login, etc.)
app.use('/usuarios', userRoutes);

// Rotas de workflows (só admin) - requer autenticação
app.use('/workflows', authMiddleware, workflowRoutes);

// Rotas de tipos de tarefa (só admin) - requer autenticação
app.use('/taskTypes', authMiddleware, taskTypeRoutes);

// Rotas de tarefas (CRUD, uploads, etc.) - requer autenticação
app.use('/tarefas', authMiddleware, taskRoutes);

// Servir arquivos de upload (pasta 'uploads') de forma estática se desejar
app.use('/uploads', express.static('uploads'));

// Importa (e executa) o serviço de lembretes com node-cron, se for usar
require('./services/reminderService');

// Tratamento de erros gerais (opcional)
app.use((err, req, res, next) => {
  logger.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
