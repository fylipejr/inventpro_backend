const db = require('../../config/db');

// RF03 — Cadastro de Produtos
// POST /produtos
async function cadastrarProduto(req, res) {
  const { nome, codigo, quantidade, preco } = req.body;

  if (!nome || !codigo || quantidade === undefined || !preco) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, codigo, quantidade, preco.' });
  }

  if (quantidade < 0) {
    return res.status(400).json({ erro: 'Quantidade não pode ser negativa.' });
  }

  try {
    // Verifica código único — Regra de negócio RF03
    const [existente] = await db.query('SELECT id_produto FROM mercadorias WHERE codigo = ?', [codigo]);
    if (existente.length > 0) {
      return res.status(409).json({ erro: 'Código de produto já existe. Cada produto deve ter código único.' });
    }

    const [resultado] = await db.query(
      'INSERT INTO mercadorias (nome, codigo, quantidade, preco) VALUES (?, ?, ?, ?)',
      [nome, codigo, quantidade, preco]
    );

    return res.status(201).json({
      mensagem: 'Produto cadastrado com sucesso.',
      produto: { id_produto: resultado.insertId, nome, codigo, quantidade, preco },
    });
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
}

// RF06 — Consulta de Estoque
// GET /produtos
async function listarProdutos(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id_produto, nome, codigo, quantidade, preco FROM mercadorias ORDER BY nome'
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
}

// GET /produtos/:id — busca produto por ID
async function buscarProduto(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM mercadorias WHERE id_produto = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
}

// PUT /produtos/:id — atualiza produto
async function atualizarProduto(req, res) {
  const { id } = req.params;
  const { nome, codigo, preco } = req.body;

  try {
    const [existente] = await db.query('SELECT * FROM mercadorias WHERE id_produto = ?', [id]);
    if (existente.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    // Verifica código único se foi alterado
    if (codigo && codigo !== existente[0].codigo) {
      const [codigoDuplicado] = await db.query(
        'SELECT id_produto FROM mercadorias WHERE codigo = ? AND id_produto != ?',
        [codigo, id]
      );
      if (codigoDuplicado.length > 0) {
        return res.status(409).json({ erro: 'Código de produto já existe.' });
      }
    }

    await db.query(
      'UPDATE mercadorias SET nome = ?, codigo = ?, preco = ? WHERE id_produto = ?',
      [
        nome  || existente[0].nome,
        codigo || existente[0].codigo,
        preco  || existente[0].preco,
        id,
      ]
    );

    const [atualizado] = await db.query('SELECT * FROM mercadorias WHERE id_produto = ?', [id]);
    return res.status(200).json({ mensagem: 'Produto atualizado com sucesso.', produto: atualizado[0] });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
}

// RF08 — Exclusão de Produtos (apenas administrador)
// DELETE /produtos/:id
async function excluirProduto(req, res) {
  const { id } = req.params;

  try {
    const [existente] = await db.query('SELECT id_produto FROM mercadorias WHERE id_produto = ?', [id]);
    if (existente.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    await db.query('DELETE FROM mercadorias WHERE id_produto = ?', [id]);
    return res.status(200).json({ mensagem: 'Produto excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
}

module.exports = { cadastrarProduto, listarProdutos, buscarProduto, atualizarProduto, excluirProduto };
