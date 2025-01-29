// src/middlewares/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn('Tentativa de acesso sem token');
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    logger.warn('Formato de token inválido');
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    logger.warn(`Token inválido: ${error.message}`);
    return res.status(401).json({ error: 'Token inválido' });
  }
};
