// src/controllers/taskController.js
const dayjs = require('dayjs');
const { Parser } = require('json2csv');
const Task = require('../models/Task');
const logger = require('../config/logger');

// Listar tarefas (com filtros)
exports.listTasks = async (req, res) => {
  try {
    const { status, prioridade, ordenar, search } = req.query;
    const userId = req.userId;

    const filter = { user: userId };
    if (status) filter.status = status;
    if (prioridade) filter.prioridade = prioridade;
    if (search) {
      filter.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { descricao: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Task.find(filter);

    if (ordenar === 'dataVencimento') {
      query.sort({ dataVencimento: 1 });
    } else if (ordenar === 'prioridade') {
      // Sort alfabético para prioridade (alta, baixa, media)
      // Uma abordagem mais complexa exigiria "pipeline" ou campo numérico.
      query.sort({ prioridade: 1 });
    }

    const tasks = await query.exec();
    return res.status(200).json(tasks);
  } catch (error) {
    logger.error('Erro ao listar tarefas:', error);
    return res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
};

// Criar tarefa
exports.createTask = async (req, res) => {
  try {
    const { titulo, descricao, prioridade, dataVencimento } = req.body;
    const userId = req.userId;

    if (!titulo || !descricao || !prioridade || !dataVencimento) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const novaTarefa = await Task.create({
      titulo,
      descricao,
      prioridade,
      dataVencimento,
      user: userId
    });

    logger.info(`Tarefa criada: ${novaTarefa._id}`);
    return res.status(201).json(novaTarefa);
  } catch (error) {
    logger.error('Erro ao criar tarefa:', error);
    return res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

// Obter tarefa por ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    return res.status(200).json(task);
  } catch (error) {
    logger.error('Erro ao obter tarefa:', error);
    return res.status(500).json({ error: 'Erro ao obter tarefa' });
  }
};

// Atualizar tarefa
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { titulo, descricao, prioridade, dataVencimento, status } = req.body;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    if (titulo !== undefined) task.titulo = titulo;
    if (descricao !== undefined) task.descricao = descricao;
    if (prioridade !== undefined) task.prioridade = prioridade;
    if (dataVencimento !== undefined) task.dataVencimento = dataVencimento;
    if (status && (status === 'pendente' || status === 'concluida')) {
      task.status = status;
    }

    await task.save();
    logger.info(`Tarefa atualizada: ${task._id}`);
    return res.status(200).json(task);
  } catch (error) {
    logger.error('Erro ao atualizar tarefa:', error);
    return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

// Excluir tarefa
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    await Task.deleteOne({ _id: id });
    logger.info(`Tarefa excluída: ${id}`);
    return res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    logger.error('Erro ao excluir tarefa:', error);
    return res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
};

// Marcar tarefa como concluída
exports.markTaskAsDone = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    task.status = 'concluida';
    await task.save();
    logger.info(`Tarefa marcada como concluída: ${task._id}`);
    return res.status(200).json(task);
  } catch (error) {
    logger.error('Erro ao marcar tarefa como concluída:', error);
    return res.status(500).json({ error: 'Erro ao marcar tarefa como concluída' });
  }
};

// Exportar tarefas em CSV
exports.exportTasksToCSV = async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = await Task.find({ user: userId });

    const parser = new Parser({
      fields: ['_id', 'titulo', 'descricao', 'prioridade', 'dataVencimento', 'status', 'createdAt', 'user']
    });
    const csv = parser.parse(tasks);

    res.header('Content-Type', 'text/csv');
    res.attachment('tarefas.csv');
    return res.send(csv);
  } catch (error) {
    logger.error('Erro ao exportar tarefas para CSV:', error);
    return res.status(500).json({ error: 'Erro ao exportar tarefas para CSV' });
  }
};

// Relatório de produtividade (tarefas concluídas em um período)
exports.getProductivityReport = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const userId = req.userId;

    const filter = {
      user: userId,
      status: 'concluida'
    };

    if (dataInicio) {
      filter.createdAt = { $gte: new Date(dataInicio) };
    }
    if (dataFim) {
      filter.createdAt = filter.createdAt || {};
      filter.createdAt.$lte = new Date(dataFim);
    }

    const concludedTasks = await Task.find(filter);
    const totalConcluidas = concludedTasks.length;

    return res.status(200).json({
      periodo: {
        inicio: dataInicio || 'não definido',
        fim: dataFim || 'não definido'
      },
      totalConcluidas
    });
  } catch (error) {
    logger.error('Erro ao gerar relatório de produtividade:', error);
    return res.status(500).json({ error: 'Erro ao gerar relatório de produtividade' });
  }
};
