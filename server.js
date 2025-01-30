// server.js
require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/config/logger');

// Porta definida no .env ou default = 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
