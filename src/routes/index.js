const express = require('express');
const router  = express.Router();

const { login }                          = require('../controllers/authController');
const { cadastrarUsuario, listarUsuarios } = require('../controllers/usuariosController');
const {
  cadastrarProduto, listarProdutos,
  buscarProduto, atualizarProduto, excluirProduto,
} = require('../controllers/produtosController');
const { registrarMovimentacao, listarMovimentacoes } = require('../controllers/movimentacoesController');
const { autenticar, apenasAdmin } = require('../middlewares/auth');

// ── Autenticação ─────────────────────────────
// RF01 — Login
router.post('/login', login);

// ── Usuários ─────────────────────────────────
// RF02 — Cadastro
router.post('/usuarios',               cadastrarUsuario);
router.get('/usuarios', autenticar, apenasAdmin, listarUsuarios);

// ── Produtos ─────────────────────────────────
// RF03 — Cadastrar produto
router.post('/produtos',               autenticar,              cadastrarProduto);
// RF06 — Consultar estoque
router.get('/produtos',                autenticar,              listarProdutos);
router.get('/produtos/:id',            autenticar,              buscarProduto);
// Atualizar
router.put('/produtos/:id',            autenticar,              atualizarProduto);
// RF08 — Excluir (somente administrador)
router.delete('/produtos/:id',         autenticar, apenasAdmin, excluirProduto);

// ── Movimentações ─────────────────────────────
// RF04 / RF05 — Entrada e Saída
router.post('/movimentacoes',          autenticar,              registrarMovimentacao);
// RF07 — Relatório
router.get('/movimentacoes',           autenticar,              listarMovimentacoes);

module.exports = router;
