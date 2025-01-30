// src/config/multer.js

const multer = require('multer');
const { storage } = require('./cloudinary');

// Configuração do Multer sem restrição de tipo de arquivo
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite de 100 MB por arquivo (ajuste conforme necessário)
});

module.exports = upload;
