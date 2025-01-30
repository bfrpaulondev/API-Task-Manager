// src/routes/workflowRoutes.js
const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const authMiddleware = require('../middlewares/auth');
const checkAdmin = require('../middlewares/checkAdmin');

/**
 * @swagger
 * tags:
 *   name: Workflows
 *   description: Endpoints para criação e gerenciamento de Workflows (somente admin)
 */

/**
 * @swagger
 * /workflows:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Cria um novo workflow (somente admin)
 *     tags: [Workflows]
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
 *     responses:
 *       201:
 *         description: Workflow criado com sucesso
 *       403:
 *         description: Acesso negado se não for admin
 */
router.post('/', authMiddleware, checkAdmin, workflowController.createWorkflow);

/**
 * @swagger
 * /workflows:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Lista todos os workflows (somente admin)
 *     tags: [Workflows]
 *     responses:
 *       200:
 *         description: Lista de workflows
 */
router.get('/', authMiddleware, checkAdmin, workflowController.listWorkflows);

/**
 * @swagger
 * /workflows/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtém detalhes de um workflow (somente admin)
 *     tags: [Workflows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do workflow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do workflow
 */
router.get('/:id', authMiddleware, checkAdmin, workflowController.getWorkflowById);

/**
 * @swagger
 * /workflows/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Atualiza um workflow (somente admin)
 *     tags: [Workflows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do workflow
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
 *     responses:
 *       200:
 *         description: Workflow atualizado
 */
router.put('/:id', authMiddleware, checkAdmin, workflowController.updateWorkflow);

/**
 * @swagger
 * /workflows/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Exclui um workflow (somente admin)
 *     tags: [Workflows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do workflow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workflow excluído
 */
router.delete('/:id', authMiddleware, checkAdmin, workflowController.deleteWorkflow);

module.exports = router;
