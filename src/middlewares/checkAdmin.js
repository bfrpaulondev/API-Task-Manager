/**
 * Verifica se o usuário possui role = 'admin'.
 * Caso contrário, retorna 403 (Acesso Negado).
 */
module.exports = (req, res, next) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. É necessário ser admin.' });
    }
    next();
  };
  