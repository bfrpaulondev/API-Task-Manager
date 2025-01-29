// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

/**
 * @swagger
 * tags:
 *   name: Tarefas
 *   description: Endpoints para gerenciamento de tarefas
 */

/**
 * @swagger
 * /tarefas:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Lista todas as tarefas do usuário atual (filtradas e ordenadas)
 *     tags: [Tarefas]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: prioridade
 *         schema:
 *           type: string
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tarefas obtida com sucesso
 */
router.get('/', taskController.listTasks);

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
 *               dataVencimento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 */
router.post('/', taskController.createTask);

/**
 * @swagger
 * /tarefas/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtém os detalhes de uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Detalhes da tarefa
 */
router.get('/:id', taskController.getTaskById);

/**
 * @swagger
 * /tarefas/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Atualiza os detalhes de uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
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
 *               dataVencimento:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 */
router.put('/:id', taskController.updateTask);

/**
 * @swagger
 * /tarefas/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Exclui uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Tarefa excluída com sucesso
 */
router.delete('/:id', taskController.deleteTask);

/**
 * @swagger
 * /tarefas/{id}/concluir:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Marca uma tarefa como concluída
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Tarefa marcada como concluída
 */
router.patch('/:id/concluir', taskController.markTaskAsDone);

/**
 * @swagger
 * /tarefas/export/csv:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Exporta a lista de tarefas do usuário para um arquivo CSV
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: CSV gerado
 */
router.get('/export/csv', taskController.exportTasksToCSV);

/**
 * @swagger
 * /tarefas/relatorio/produtividade:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Gera um relatório de produtividade (tarefas concluídas em um período)
 *     tags: [Tarefas]
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Relatório de produtividade
 */
router.get('/relatorio/produtividade', taskController.getProductivityReport);

module.exports = router;
