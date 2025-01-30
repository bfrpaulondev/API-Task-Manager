// src/config/multer.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

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
      'gif', 'webp', 'mpeg',    // Outros formatos de imagem
      'zip',                    // Arquivos compactados
      'odt', 'ods', 'odp',      // OpenDocument formats
      'mp3', 'wav', 'ogg', 'flac', // Arquivos de áudio
      'mp4', 'avi', 'mkv', 'webm'  // Arquivos de vídeo
    ]
  },
});

const upload = multer({ storage });

export default upload;
