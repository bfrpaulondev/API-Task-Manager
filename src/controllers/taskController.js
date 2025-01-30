// src/controllers/taskController.js

const dayjs = require('dayjs');
const Task = require('../models/Task');
const TaskType = require('../models/TaskType');
const csv = require('csv-parser');
const stream = require('stream');
const { cloudinary } = require('../config/cloudinary');
const { v4: uuidv4 } = require('uuid');

/**
 * Criar nova tarefa
 * - Admin pode atribuir a outro usuário, associar a um workflow, setar taskType, etc.
 * - Usuário comum pode criar tarefa apenas para si mesmo, dependendo da regra de negócio.
 */
exports.createTask = async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      prioridade,
      dataVencimento,
      workflow,
      taskType,
      assignedTo,
      instructions,
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
      dataVencimento: dayjs(dataVencimento).toDate(),
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
    console.error('Erro ao criar tarefa:', error);
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

    if (req.userRole !== 'admin' || adminView !== 'true') {
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
    console.error('Erro ao listar tarefas:', error);
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
    console.error('Erro ao obter tarefa:', error);
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
      titulo,
      descricao,
      prioridade,
      dataVencimento,
      status,
      workflow,
      taskType,
      assignedTo,
      instructions,
      customFields
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
    if (dataVencimento !== undefined) task.dataVencimento = dayjs(dataVencimento).toDate();
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
    console.error('Erro ao atualizar tarefa:', error);
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
    console.error('Erro ao excluir tarefa:', error);
    return res.status(500).json({ error: 'Erro ao excluir tarefa' });
  }
};

/**
 * Upload de arquivos (já configurado com multer e Cloudinary)
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

    // Array para armazenar informações dos arquivos carregados
    const uploadedFiles = [];

    // Processar cada arquivo
    for (const file of req.files) {
      uploadedFiles.push({
        url: file.path, // URL retornada pelo Cloudinary
        originalName: file.originalname,
        fileType: file.mimetype,
      });

      // Se o arquivo for CSV, processar seu conteúdo (opcional)
      if (file.mimetype === 'text/csv') {
        const results = [];
        const readableStream = new stream.Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);

        await new Promise((resolve, reject) => {
          readableStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
              console.log('Dados do CSV:', results);
              // Implemente a lógica para processar os dados do CSV conforme necessário
              resolve();
            })
            .on('error', (err) => {
              console.error('Erro ao processar CSV:', err);
              reject(err);
            });
        });

        // Exemplo: salvar os dados do CSV em um campo customizado da tarefa
        // Assumindo que 'customFields' pode armazenar os dados
        task.customFields = {
          ...task.customFields,
          csvData: results
        };
      }
    }

    // Atualizar a tarefa com os novos arquivos
    task.files = [...task.files, ...uploadedFiles];
    await task.save();

    return res.status(200).json({
      message: 'Upload realizado com sucesso',
      task,
    });

  } catch (error) {
    console.error('Erro ao fazer upload de arquivos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * Marcar/Desmarcar favorito
 * - PATCH /tarefas/:id/favorite
 * - body: { isFavorite: true/false }
 */
exports.markFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFavorite } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Verifica permissão (usuário pode marcar/desmarcar apenas suas tarefas ou admin)
    if (req.userRole !== 'admin') {
      if (
        task.createdBy.toString() !== req.userId &&
        task.assignedTo?.toString() !== req.userId
      ) {
        return res.status(403).json({ error: 'Sem permissão para marcar como favorito' });
      }
    }

    task.isFavorite = Boolean(isFavorite);
    await task.save();
    return res.status(200).json({ message: 'Favorito atualizado', task });
  } catch (error) {
    console.error('Erro ao marcar como favorito:', error);
    return res.status(500).json({ error: 'Erro ao marcar como favorito' });
  }
};
