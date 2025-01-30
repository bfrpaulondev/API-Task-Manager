// src/controllers/taskTypeController.js
const TaskType = require('../models/TaskType');

/**
 * Criar Tipo de Tarefa (somente admin)
 * Exemplo de body:
 * {
 *   "nome": "CheckList de Segurança",
 *   "descricao": "Verifica itens de segurança",
 *   "fields": [
 *     { "name": "Possui extintor?", "fieldType": "checkbox", "required": true },
 *     { "name": "Foto do local", "fieldType": "file" }
 *   ]
 * }
 */
exports.createTaskType = async (req, res) => {
  try {
    const { nome, descricao, fields } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome do tipo de tarefa é obrigatório' });
    }

    const newType = await TaskType.create({
      nome,
      descricao,
      fields,
      createdBy: req.userId
    });

    return res.status(201).json(newType);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar tipo de tarefa' });
  }
};

/**
 * Listar todos os tipos de tarefa
 * (Pode ser público ou só admin, dependendo da regra)
 */
exports.listTaskTypes = async (req, res) => {
  try {
    const types = await TaskType.find()
      .populate('createdBy', 'nome email');
    return res.status(200).json(types);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar tipos de tarefa' });
  }
};

/**
 * Obter tipo de tarefa por ID
 */
exports.getTaskTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const taskType = await TaskType.findById(id)
      .populate('createdBy', 'nome email');
    if (!taskType) {
      return res.status(404).json({ error: 'Tipo de tarefa não encontrado' });
    }
    return res.status(200).json(taskType);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter tipo de tarefa' });
  }
};

/**
 * Atualizar tipo de tarefa (somente admin)
 */
exports.updateTaskType = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, fields } = req.body;

    const taskType = await TaskType.findById(id);
    if (!taskType) {
      return res.status(404).json({ error: 'Tipo de tarefa não encontrado' });
    }

    if (nome !== undefined) taskType.nome = nome;
    if (descricao !== undefined) taskType.descricao = descricao;
    if (fields !== undefined) taskType.fields = fields;

    await taskType.save();
    return res.status(200).json(taskType);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar tipo de tarefa' });
  }
};

/**
 * Excluir tipo de tarefa (somente admin)
 */
exports.deleteTaskType = async (req, res) => {
  try {
    const { id } = req.params;
    const taskType = await TaskType.findById(id);
    if (!taskType) {
      return res.status(404).json({ error: 'Tipo de tarefa não encontrado' });
    }

    await TaskType.deleteOne({ _id: id });
    return res.status(200).json({ message: 'Tipo de tarefa excluído com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao excluir tipo de tarefa' });
  }
};
