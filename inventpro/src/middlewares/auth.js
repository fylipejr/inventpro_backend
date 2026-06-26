const jwt = require('jsonwebtoken');

// Middleware de autenticação — RF01
function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido. Faça login para continuar.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
    req.usuario = payload; // { id_usuario, email, perfil }
    next();
  });
}

// Middleware de autorização — apenas administradores (RF08)
function apenasAdmin(req, res, next) {
  if (req.usuario.perfil !== 'administrador') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
  }
  next();
}

module.exports = { autenticar, apenasAdmin };
