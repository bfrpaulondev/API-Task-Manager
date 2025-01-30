// src/controllers/workflowController.js
const Workflow = require('../models/Workflow');

/**
 * Criar Workflow (somente admin)
 */
exports.createWorkflow = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'Nome do workflow é obrigatório' });
    }

    const newWorkflow = await Workflow.create({
      nome,
      descricao,
      createdBy: req.userId
    });

    return res.status(201).json(newWorkflow);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar workflow' });
  }
};

/**
 * Listar Workflows (somente admin)
 */
exports.listWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find()
      .populate('createdBy', 'nome email');
    return res.status(200).json(workflows);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar workflows' });
  }
};

/**
 * Obter Workflow por ID (somente admin)
 */
exports.getWorkflowById = async (req, res) => {
  try {
    const { id } = req.params;
    const wf = await Workflow.findById(id).populate('createdBy', 'nome email');
    if (!wf) {
      return res.status(404).json({ error: 'Workflow não encontrado' });
    }
    return res.status(200).json(wf);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter workflow' });
  }
};

/**
 * Atualizar Workflow (somente admin)
 */
exports.updateWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    const wf = await Workflow.findById(id);
    if (!wf) {
      return res.status(404).json({ error: 'Workflow não encontrado' });
    }

    if (nome !== undefined) wf.nome = nome;
    if (descricao !== undefined) wf.descricao = descricao;

    await wf.save();
    return res.status(200).json(wf);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar workflow' });
  }
};

/**
 * Excluir Workflow (somente admin)
 */
exports.deleteWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const wf = await Workflow.findById(id);
    if (!wf) {
      return res.status(404).json({ error: 'Workflow não encontrado' });
    }

    await Workflow.deleteOne({ _id: id });
    return res.status(200).json({ message: 'Workflow excluído com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao excluir workflow' });
  }
};
