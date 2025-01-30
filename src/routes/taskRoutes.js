// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');
const multer = require('../config/multer'); // Config Multer para uploads

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: CRUD de tarefas, uploads, favoritos, etc.
 */

/**
 * @swagger
 * /tarefas:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - prioridade
 *               - dataVencimento
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               prioridade:
 *                 type: string
 *                 enum: [baixa, media, alta]
 *               dataVencimento:
 *                 type: string
 *               workflow:
 *                 type: string
 *               taskType:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               instructions:
 *                 type: string
 *               customFields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fieldName:
 *                       type: string
 *                     fieldType:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       201:
 *         description: Tarefa criada
 */
router.post('/', authMiddleware, taskController.createTask);

/**
 * @swagger
 * /tarefas:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Lista tarefas
 *     tags: [Tarefas]
 *     parameters:
 *       - in: query
 *         name: adminView
 *         schema:
 *           type: boolean
 *         description: Se admin, listar todas as tarefas
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: workflow
 *         schema:
 *           type: string
 *       - in: query
 *         name: taskType
 *         schema:
 *           type: string
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de tarefas
 */
router.get('/', authMiddleware, taskController.listTasks);

/**
 * @swagger
 * /tarefas/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obter detalhes de uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes da tarefa
 */
router.get('/:id', authMiddleware, taskController.getTaskById);

/**
 * @swagger
 * /tarefas/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Atualiza uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               prioridade:
 *                 type: string
 *                 enum: [baixa, media, alta]
 *               dataVencimento:
 *                 type: string
 *               status:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *               workflow:
 *                 type: string
 *               taskType:
 *                 type: string
 *               instructions:
 *                 type: string
 *               customFields:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 */
router.put('/:id', authMiddleware, taskController.updateTask);

/**
 * @swagger
 * /tarefas/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Excluir uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarefa excluída
 */
router.delete('/:id', authMiddleware, taskController.deleteTask);

/**
 * @swagger
 * /tarefas/{id}/files:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Faz upload de arquivos para a tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 */
router.post('/:id/files', authMiddleware, upload.array('files'), taskController.uploadFiles);

/**
 * @swagger
 * /tarefas/{id}/favorite:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Marcar ou desmarcar tarefa como favorita
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da tarefa
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isFavorite:
 *                 type: boolean
 *                 description: true para favoritar, false para desfavoritar
 *     responses:
 *       200:
 *         description: Atualização de favorito bem-sucedida
 */
router.patch('/:id/favorite', authMiddleware, taskController.markFavorite);

module.exports = router;
