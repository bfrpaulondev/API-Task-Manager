// src/config/db.js
require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./logger');

// Para remover warning de strictQuery (mongoose >= 6.0)
mongoose.set('strictQuery', false);

/**
 * Conecta ao MongoDB usando a variável MONGO_URI
 * definida no .env
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
