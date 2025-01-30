// src/controllers/taskController.js
const dayjs = require('dayjs');
const Task = require('../models/Task');
const TaskType = require('../models/TaskType');

/**
 * Criar nova tarefa
 * - Admin pode atribuir a outro usuário, associar a um workflow, setar taskType, etc.
 * - Usuário comum pode criar tarefa apenas para si mesmo, dependendo da regra de negócio.
 */
exports.createTask = async (req, res) => {
  try {
    const {
      titulo, descricao, prioridade, dataVencimento,
      workflow, taskType, assignedTo, instructions,
      customFields
    } = req.body;

    if (!titulo || !descricao || !prioridade || !dataVencimento) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Monta objeto
    const newTaskData = {
      titulo,
      descricao,
      prioridade,
      dataVencimento,
      createdBy: req.userId,
      instructions,
      // userRole === admin => pode atribuir a outro user
      // ou associar workflow e taskType
    };

    if (req.userRole === 'admin') {
      if (assignedTo) {
        newTaskData.assignedTo = assignedTo;
        newTaskData.assignedAt = new Date();
      }
      if (workflow) {
        newTaskData.workflow = workflow;
      }
      if (taskType) {
        newTaskData.taskType = taskType;
      }
      // Se veio customFields, salvar
      if (customFields) {
        newTaskData.customFields = customFields;
      }
    } else {
      // Se user comum, a tarefa é atribuída a si mesmo
      newTaskData.assignedTo = req.userId;
      newTaskData.assignedAt = new Date();
      // Se quiser permitir user definir customFields mesmo sem admin
      if (customFields) {
        newTaskData.customFields = customFields;
      }
    }

    const task = await Task.create(newTaskData);
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

/**
 * Listar tarefas
 * - Admin pode ver todas as tarefas (?adminView=true) ou aplicar filtros
 * - User vê somente as suas (ou as que criou?), depende da regra
 */
exports.listTasks = async (req, res) => {
  try {
    let filter = {};
    const { adminView, status, workflow, taskType, favorite } = req.query;

    if (req.userRole !== 'admin' || !adminView) {
      // user comum: ver tarefas atribuídas a si (ou criadas por si, se quiser)
      filter.$or = [
        { assignedTo: req.userId },
        { createdBy: req.userId }
      ];
    }

    // Filtros opcionais
    if (status) filter.status = status;
    if (workflow) filter.workflow = workflow;
    if (taskType) filter.taskType = taskType;
    if (favorite === 'true') filter.isFavorite = true;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'nome email')
      .populate('createdBy', 'nome email')
      .populate('workflow', 'nome')
      .populate('taskType', 'nome');

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
};

/**
 * Obter detalhes de uma tarefa
 * - Verifica se user tem permissão
 */
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate('assignedTo', 'nome email')
      .populate('createdBy', 'nome email')
      .populate('workflow', 'nome')
      .populate('taskType', 'nome fields');

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica permissão (admin ou dono/assigned)
    if (req.userRole !== 'admin') {
      const isOwner = task.createdBy && task.createdBy._id.toString() === req.userId;
      const isAssigned = task.assignedTo && task.assignedTo._id.toString() === req.userId;
      if (!isOwner && !isAssigned) {
        return res.status(403).json({ error: 'Sem permissão para ver esta tarefa' });
      }
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter tarefa' });
  }
};

/**
 * Atualizar tarefa
 * - Ao atualizar, salvar versão anterior em "history"
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo, descricao, prioridade, dataVencimento, status,
      workflow, taskType, assignedTo, instructions, customFields
    } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica permissão
    if (req.userRole !== 'admin') {
      // user comum só pode atualizar se for dono ou assigned
      if (
        task.createdBy.toString() !== req.userId &&
        task.assignedTo?.toString() !== req.userId
      ) {
        return res.status(403).json({ error: 'Sem permissão para atualizar esta tarefa' });
      }
    }

    // Salvar versão anterior
    const oldVersion = {
      updatedAt: new Date(),
      changes: {
        titulo: task.titulo,
        descricao: task.descricao,
        prioridade: task.prioridade,
        dataVencimento: task.dataVencimento,
        status: task.status,
        workflow: task.workflow,
        taskType: task.taskType,
        assignedTo: task.assignedTo,
        instructions: task.instructions,
        customFields: task.customFields
      }
    };
    task.history.push(oldVersion);

    // Atualiza campos
    if (titulo !== undefined) task.titulo = titulo;
    if (descricao !== undefined) task.descricao = descricao;
    if (prioridade !== undefined) task.prioridade = prioridade;
    if (dataVencimento !== undefined) task.dataVencimento = dataVencimento;
    if (instructions !== undefined) task.instructions = instructions;
    
    // Admin pode mudar workflow, taskType, assignedTo, status
    if (req.userRole === 'admin') {
      if (workflow !== undefined) task.workflow = workflow;
      if (taskType !== undefined) task.taskType = taskType;
      if (assignedTo !== undefined) {
        task.assignedTo = assignedTo;
        task.assignedAt = new Date();
      }
      if (status !== undefined) {
        task.status = status;
        if (status === 'concluida') {
          task.completedAt = new Date();
          task.completedBy = req.userId;
        }
      }
    } else {
      // user pode mudar status (ex. "em-andamento", "revisao", "concluida"?), customFields
      if (status && ['em-andamento', 'revisao', 'concluida'].includes(status)) {
        task.status = status;
        if (status === 'concluida') {
          task.completedAt = new Date();
          task.completedBy = req.userId;
        }
      }
    }

    // customFields (usuário pode preencher?)
    if (customFields !== undefined) {
      // Sobrescreve ou mescla customFields
      task.customFields = customFields;
    }

    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

/**
 * Excluir tarefa
 * - Admin pode excluir qualquer tarefa
 * - User só exclui se for dono ou assigned (depende da regra)
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica permissão
    if (req.userRole !== 'admin') {
      if (
        task.createdBy.toString() !== req.userId &&
        task.assignedTo?.toString() !== req.userId
      ) {
        return res.status(403).json({ error: 'Sem permissão para excluir' });
      }
    }

    await Task.deleteOne({ _id: id });
    return res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
};

/**
 * Upload de arquivos (já configurado com multer)
 * - rota: POST /tarefas/:id/files
 */
exports.uploadFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica permissão
    if (req.userRole !== 'admin') {
      if (
        task.createdBy.toString() !== req.userId &&
        task.assignedTo?.toString() !== req.userId
      ) {
        return res.status(403).json({ error: 'Sem permissão para enviar arquivos' });
      }
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    req.files.forEach(file => {
      task.files.push({
        url: file.path, // URL retornada pelo Cloudinary
        originalName: file.originalname,
        fileType: file.mimetype
      });
    });

    await task.save();
    return res.status(200).json({
      message: 'Upload realizado com sucesso',
      task
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao fazer upload de arquivos' });
  }
};

/**
 * Marcar/Desmarcar favorito
 * - PATCH /tarefas/:id/favorite
 * body: { isFavorite: true/false }
 */
exports.markFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFavorite } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica permissão
    if (task.assignedTo?.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Somente quem recebeu a tarefa (ou admin) pode favoritá-la' });
    }

    task.isFavorite = Boolean(isFavorite);
    await task.save();
    return res.status(200).json({ message: 'Favorito atualizado', task });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao marcar como favorito' });
  }
};
