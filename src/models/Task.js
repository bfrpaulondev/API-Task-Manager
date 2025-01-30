// src/models/Task.js
const mongoose = require('mongoose');

// Informações de arquivo (fotos, vídeos, docs etc.)
const FileSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
}, { _id: false });

// Respostas para campos dinâmicos
const CustomFieldSchema = new mongoose.Schema({
  fieldName: { type: String, required: true },   // "Possui extintor?"
  fieldType: { type: String, required: true },   // "checkbox", "text", etc.
  value: { type: mongoose.Schema.Types.Mixed },  // Armazena string, boolean, ou outro
});

const TaskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  prioridade: { type: String, enum: ['baixa', 'media', 'alta'], required: true },
  dataVencimento: { type: Date, required: true },

  // Tipo de tarefa (campos dinâmicos)
  taskType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskType'
  },

  // Respostas do usuário para os campos do taskType
  customFields: [CustomFieldSchema],

  // Arquivos enviados para esta tarefa
  files: [FileSchema],

  // Pode ter vários status (ex.: pendente, em-andamento, revisao, aprovado, rejeitado, concluida)
  status: { 
    type: String,
    enum: ['pendente', 'em-andamento', 'revisao', 'aprovado', 'rejeitado', 'concluida'],
    default: 'pendente'
  },
  createdAt: { type: Date, default: Date.now },

  // Quem criou?
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Pra quem foi atribuída
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: { type: Date },

  // Controle de quando o usuário inicia e termina
  startTime: { type: Date },
  completedAt: { type: Date },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Se o usuário quer favoritar essa tarefa
  isFavorite: { type: Boolean, default: false },

  // Instruções extras do admin
  instructions: { type: String },

  // Histórico de alterações (versionamento)
  history: [
    {
      updatedAt: { type: Date },
      changes: { type: Object }  // snapshot do estado anterior
    }
  ],

  // Vinculada a algum workflow
  workflow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow'
  }
});

module.exports = mongoose.model('Task', TaskSchema);
