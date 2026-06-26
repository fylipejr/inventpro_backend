const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authController');
const { cadastrarUsuario, listarUsuarios } = require('../controllers/usuariosController');
const { cadastrarProduto, listarProdutos, buscarProduto, atualizarProduto, excluirProduto } = require('../controllers/produtosController');
const { registrarMovimentacao, listarMovimentacoes } = require('../controllers/movimentacoesController');
const { autenticar, apenasAdmin } = require('../middlewares/auth');

// ── Autenticação ─────────────────────────────────────────────
// RF01 — Login
router.post('/login', login);

// ── Usuários ─────────────────────────────────────────────────
// RF02 — Cadastro de Usuários
router.post('/usuarios', cadastrarUsuario);
router.get('/usuarios', autenticar, apenasAdmin, listarUsuarios);

// ── Produtos ─────────────────────────────────────────────────
// RF03 — Cadastro de Produtos
router.post('/produtos', autenticar, cadastrarProduto);
// RF06 — Consulta de Estoque
router.get('/produtos', autenticar, listarProdutos);
router.get('/produtos/:id', autenticar, buscarProduto);
// Atualização
router.put('/produtos/:id', autenticar, atualizarProduto);
// RF08 — Exclusão (apenas administrador)
router.delete('/produtos/:id', autenticar, apenasAdmin, excluirProduto);

// ── Movimentações ─────────────────────────────────────────────
// RF04 / RF05 — Entrada e Saída de Produtos
router.post('/movimentacoes', autenticar, registrarMovimentacao);
// RF07 — Relatório de Movimentações
router.get('/movimentacoes', autenticar, listarMovimentacoes);

module.exports = router;
