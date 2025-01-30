require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticação.
 * Verifica o header "Authorization: Bearer <token>".
 * Decodifica o token, busca o usuário no BD e seta (req.userId, req.userRole).
 */
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Ex.: "Bearer <token>"
    const [bearer, token] = authHeader.split(' ');
    if (!token || bearer.toLowerCase() !== 'bearer') {
      return res.status(401).json({ error: 'Token não fornecido no formato Bearer' });
    }

    // Verifica token com JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Busca o usuário no banco para obter a role
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Anexa dados ao req
    req.userId = user._id.toString();
    req.userRole = user.role;

    // Prossegue para o próximo middleware/rota
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};
