// server.js
require('dotenv').config();
const app = require('./src/app');

// Porta padrão da aplicação ou fornecida via variável de ambiente
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
