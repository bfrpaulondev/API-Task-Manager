// src/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  prioridade: { type: String, enum: ['baixa', 'media', 'alta'], required: true },
  dataVencimento: { type: Date, required: true },
  status: { type: String, enum: ['pendente', 'concluida'], default: 'pendente' },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Task', TaskSchema);
