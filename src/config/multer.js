// src/config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gerenciador_de_tarefas', // Nome da pasta no Cloudinary
  },
});

const upload = multer({ storage });

module.exports = upload;
