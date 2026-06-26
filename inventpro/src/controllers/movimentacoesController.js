const db = require('../../config/db');

// RF04 — Entrada de Produtos
// RF05 — Saída de Produtos (sem estoque negativo)
// POST /movimentacoes
async function registrarMovimentacao(req, res) {
  const { id_produto, tipo, quantidade } = req.body;
  const id_usuario = req.usuario.id_usuario;

  if (!id_produto || !tipo || !quantidade) {
    return res.status(400).json({ erro: 'Campos obrigatórios: id_produto, tipo, quantidade.' });
  }

  if (!['entrada', 'saida'].includes(tipo)) {
    return res.status(400).json({ erro: 'Tipo inválido. Use: entrada | saida' });
  }

  if (quantidade <= 0) {
    return res.status(400).json({ erro: 'Quantidade deve ser maior que zero.' });
  }

  const conn = await require('../../config/db').getConnection();
  try {
    await conn.beginTransaction();

    // Busca produto com lock para evitar condição de corrida
    const [rows] = await conn.query(
      'SELECT * FROM mercadorias WHERE id_produto = ? FOR UPDATE',
      [id_produto]
    );

    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    const produto = rows[0];

    // RF05 — Regra de negócio: não permitir estoque negativo
    if (tipo === 'saida' && produto.quantidade < quantidade) {
      await conn.rollback();
      return res.status(400).json({
        erro: `Estoque insuficiente. Disponível: ${produto.quantidade} unidades.`,
      });
    }

    // Atualiza quantidade
    const novaQuantidade =
      tipo === 'entrada'
        ? produto.quantidade + quantidade
        : produto.quantidade - quantidade;

    await conn.query(
      'UPDATE mercadorias SET quantidade = ? WHERE id_produto = ?',
      [novaQuantidade, id_produto]
    );

    // Salva no histórico (RF07)
    const [resultado] = await conn.query(
      'INSERT INTO registros (tipo, quantidade, id_produto, id_usuario) VALUES (?, ?, ?, ?)',
      [tipo, quantidade, id_produto, id_usuario]
    );

    await conn.commit();

    return res.status(201).json({
      mensagem: `${tipo === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso.`,
      movimentacao: {
        id_registro: resultado.insertId,
        tipo,
        quantidade,
        id_produto,
        produto: produto.nome,
        quantidade_anterior: produto.quantidade,
        quantidade_atual: novaQuantidade,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error('Erro ao registrar movimentação:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  } finally {
    conn.release();
  }
}

// RF07 — Relatório de Movimentações
// GET /movimentacoes?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD&tipo=entrada
async function listarMovimentacoes(req, res) {
  const { data_inicio, data_fim, tipo, id_produto } = req.query;

  let sql = `
    SELECT 
      r.id_registro,
      r.tipo,
      r.quantidade,
      r.data_registro,
      m.nome AS produto,
      m.codigo AS codigo_produto,
      c.nome AS usuario
    FROM registros r
    JOIN mercadorias m ON r.id_produto = m.id_produto
    JOIN contas c ON r.id_usuario = c.id_usuario
    WHERE 1=1
  `;
  const params = [];

  if (data_inicio) {
    sql += ' AND DATE(r.data_registro) >= ?';
    params.push(data_inicio);
  }
  if (data_fim) {
    sql += ' AND DATE(r.data_registro) <= ?';
    params.push(data_fim);
  }
  if (tipo) {
    sql += ' AND r.tipo = ?';
    params.push(tipo);
  }
  if (id_produto) {
    sql += ' AND r.id_produto = ?';
    params.push(id_produto);
  }

  sql += ' ORDER BY r.data_registro DESC';

  try {
    const [rows] = await db.query(sql, params);
    return res.status(200).json({ total: rows.length, movimentacoes: rows });
  } catch (err) {
    console.error('Erro ao listar movimentações:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
}

module.exports = { registrarMovimentacao, listarMovimentacoes };
