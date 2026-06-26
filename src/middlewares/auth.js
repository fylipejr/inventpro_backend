const jwt = require('jsonwebtoken');

// Verifica se o token JWT é válido — RF01
function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido. Faça login.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
    }
    req.usuario = payload; // { id_usuario, email, perfil }
    next();
  });
}

// Apenas administradores — RF08
function apenasAdmin(req, res, next) {
  if (req.usuario.perfil !== 'administrador') {
    return res.status(403).json({ mensagem: 'Acesso restrito a administradores.' });
  }
  next();
}

module.exports = { autenticar, apenasAdmin };
