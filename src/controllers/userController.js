// src/controllers/userController.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Registrar novo usuário
 * - Qualquer pessoa pode se registrar (ou só admin, dependendo da sua regra)
 */
exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha' });
    }

    // Verifica se já existe usuário com o mesmo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Cria novo usuário
    const newUser = new User({
      nome,
      email,
      senha
      // role default = 'user'
    });

    await newUser.save();
    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      userId: newUser._id
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

/**
 * Login de usuário
 * - Retorna token JWT e, opcionalmente, o "nome" e "role"
 */
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      nome: user.nome,
      role: user.role
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

/**
 * Atualizar role de um usuário (somente admin)
 * - Exemplo: PATCH /usuarios/:id/role
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role inválido' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      message: `Role do usuário atualizado para ${role}`,
      userId: user._id
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar role do usuário' });
  }
};

/**
 * Listar todos os usuários (somente admin)
 * - Exemplo: GET /usuarios (opcional, se quiser)
 */
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-senha');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};
