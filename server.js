// server.js
require('dotenv').config();
const https = require('https');
const fs = require('fs');
const logger = require('./src/config/logger');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

if (process.env.SSL_CERT && process.env.SSL_KEY) {
  // HTTPS
  const options = {
    cert: fs.readFileSync(process.env.SSL_CERT),
    key: fs.readFileSync(process.env.SSL_KEY)
  };
  https.createServer(options, app).listen(PORT, () => {
    logger.info(`Servidor HTTPS rodando na porta ${PORT}`);
  });
} else {
  // HTTP simples (caso não tenha configurado SSL)
  app.listen(PORT, () => {
    logger.info(`Servidor HTTP rodando na porta ${PORT}`);
  });
}
