// src/models/TaskType.js
const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Ex.: "Possui extintor?"
  fieldType: { type: String, required: true },  // "checkbox", "text", "file", etc.
  required: { type: Boolean, default: false }
});

const TaskTypeSchema = new mongoose.Schema({
  nome: { type: String, required: true },       // Ex.: "CheckList de Segurança"
  descricao: { type: String },
  fields: [FieldSchema],                        // Campos dinâmicos para este tipo de tarefa
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskType', TaskTypeSchema);
