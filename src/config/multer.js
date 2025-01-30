// src/config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gerenciador_de_tarefas',
    allowed_formats: [
      'jpg', 'png', 'jpeg',     // Imagens
      'pdf',                    // Documentos PDF
      'csv',                    // Planilhas CSV
      'doc', 'docx',            // Documentos Word
      'xls', 'xlsx',            // Planilhas Excel
      'ppt', 'pptx',            // Apresentações PowerPoint
      'txt',                    // Arquivos de texto
      'gif', 'webp',            // Outros formatos de imagem
      'zip',                    // Arquivos compactados
      'odt'                   ,
      'ods'                   ,
      'odp'                   ,
      'mp3', 'wav', 'ogg', 'flac', // Arquivos de áudio
      'mp4', 'avi', 'mkv', 'webm', // Arquivos de vídeo
      'csv',                    // Planilhas CSV
      'txt',                    // Arquivos de texto
      'gif', 'webp',            // Outros formatos de imagem

    ]
  },
});

const upload = multer({ storage });

module.exports = upload;