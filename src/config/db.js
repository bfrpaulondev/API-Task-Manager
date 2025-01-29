// src/config/db.js
require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./logger');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Conectado ao MongoDB Atlas com sucesso!');
  } catch (error) {
    logger.error('Erro ao conectar no MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
