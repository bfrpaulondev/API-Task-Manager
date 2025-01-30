// src/config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Configuração do Cloudinary com variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuração do armazenamento do Multer para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gerenciador_de_tarefas', // Nome da pasta no Cloudinary
    resource_type: 'auto', // Permite qualquer tipo de arquivo (imagem, vídeo, documento, etc.)
    public_id: (req, file) => {
      // Gera um nome único para o arquivo usando UUID
      const uniqueName = `${require('uuid').v4()}_${file.originalname.replace(/\s+/g, '_')}`;
      return uniqueName;
    },
  },
});

module.exports = {
  cloudinary,
  storage,
};
