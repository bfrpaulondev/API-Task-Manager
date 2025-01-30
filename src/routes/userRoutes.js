// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const checkAdmin = require('../middlewares/checkAdmin');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para cadastro, login e gerenciamento de usuários
 */

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos ou email já em uso
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido (retorna token)
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /usuarios/{id}/role:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Altera o role de um usuário (somente admin)
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role atualizado com sucesso
 *       403:
 *         description: Acesso negado (não é admin)
 */
router.patch('/:id/role', authMiddleware, checkAdmin, userController.updateUserRole);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Lista todos os usuários (somente admin)
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       403:
 *         description: Acesso negado
 */
router.get('/', authMiddleware, checkAdmin, userController.listUsers);

module.exports = router;
