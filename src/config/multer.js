// src/config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gerenciador_de_tarefas', // Nome da pasta no Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'] // Formatos permitidos
  },
});

const upload = multer({ storage });

module.exports = upload;
