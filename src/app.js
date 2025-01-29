// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authMiddleware = require('./middlewares/auth');
require('./services/reminderService'); // Inicializa o serviço de lembretes

const app = express();

// Conecta ao banco
connectDB();

// Configura CORS
app.use(cors({
  origin: '*',  // Ajuste conforme necessário (pode ser um array ou regex)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para log de requisições (exemplo simples)
app.use((req, res, next) => {
  logger.info(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas de usuários
app.use('/usuarios', userRoutes);

// Rotas de tarefas (protegidas por JWT)
app.use('/tarefas', authMiddleware, taskRoutes);

// Tratamento de erros geral (exemplo)
app.use((err, req, res, next) => {
  logger.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
