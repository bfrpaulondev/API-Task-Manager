// src/routes/taskTypeRoutes.js
const express = require('express');
const router = express.Router();
const taskTypeController = require('../controllers/taskTypeController');
const authMiddleware = require('../middlewares/auth');
const checkAdmin = require('../middlewares/checkAdmin');

/**
 * @swagger
 * tags:
 *   name: TaskTypes
 *   description: Endpoints para criação e gerenciamento de tipos de tarefas (campos dinâmicos, somente admin)
 */

/**
 * @swagger
 * /taskTypes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Cria um novo tipo de tarefa (somente admin)
 *     tags: [TaskTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     fieldType:
 *                       type: string
 *                     required:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Tipo de tarefa criado com sucesso
 *       403:
 *         description: Acesso negado se não for admin
 */
router.post('/', authMiddleware, checkAdmin, taskTypeController.createTaskType);

/**
 * @swagger
 * /taskTypes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Lista todos os tipos de tarefa
 *     tags: [TaskTypes]
 *     responses:
 *       200:
 *         description: Lista de tipos de tarefa
 */
router.get('/', authMiddleware, taskTypeController.listTaskTypes);

/**
 * @swagger
 * /taskTypes/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtém detalhes de um tipo de tarefa
 *     tags: [TaskTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tipo de tarefa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do tipo de tarefa
 */
router.get('/:id', authMiddleware, taskTypeController.getTaskTypeById);

/**
 * @swagger
 * /taskTypes/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Atualiza um tipo de tarefa (somente admin)
 *     tags: [TaskTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tipo de tarefa
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     fieldType:
 *                       type: string
 *                     required:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Tipo de tarefa atualizado
 */
router.put('/:id', authMiddleware, checkAdmin, taskTypeController.updateTaskType);

/**
 * @swagger
 * /taskTypes/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Exclui um tipo de tarefa (somente admin)
 *     tags: [TaskTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tipo de tarefa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tipo de tarefa excluído
 */
router.delete('/:id', authMiddleware, checkAdmin, taskTypeController.deleteTaskType);

module.exports = router;
