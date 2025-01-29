// src/controllers/userController.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se já existe usuário com o mesmo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Tentativa de registro com email já existente: ${email}`);
      return res.status(400).json({ error: 'Email já está em uso.' });
    }

    // Cria novo usuário
    const user = await User.create({ nome, email, senha });
    logger.info(`Novo usuário registrado: ${user._id} - ${email}`);
    return res.status(201).json({ message: 'Usuário criado com sucesso', userId: user._id });
  } catch (error) {
    logger.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Tentativa de login com email inexistente: ${email}`);
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica senha
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      logger.warn(`Senha incorreta para o usuário: ${email}`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    logger.info(`Login bem-sucedido para: ${email}`);
    return res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    logger.error('Erro ao fazer login:', error);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};
