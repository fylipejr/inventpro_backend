const bcrypt = require('bcrypt');
const db     = require('../../config/db');

// RF02 — Cadastro de Usuários
// POST /usuarios
async function cadastrarUsuario(req, res) {
  const { nome, email, senha, perfil } = req.body;

  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios: nome, email, senha, perfil.' });
  }

  const perfisValidos = ['administrador', 'funcionario'];
  if (!perfisValidos.includes(perfil)) {
    return res.status(400).json({ mensagem: `Perfil inválido. Use: administrador | funcionario` });
  }

  try {
    const [existente] = await db.query(
      'SELECT id_usuario FROM contas WHERE email = ?', [email]
    );
    if (existente.length > 0) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
    }

    // Criptografa a senha — RNF04
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const [resultado] = await db.query(
      'INSERT INTO contas (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, senhaCriptografada, perfil]
    );

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso.',
      usuario: { id_usuario: resultado.insertId, nome, email, perfil },
    });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
}

// GET /usuarios — lista todos (apenas admin)
async function listarUsuarios(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id_usuario, nome, email, perfil FROM contas ORDER BY id_usuario'
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
}

module.exports = { cadastrarUsuario, listarUsuarios };
