const express = require('express');
const router = express.Router();


let inventario = [
  {
    id: 5,
    nome: "Motor Falcon 58",
    fabricante: "VEX",
    quantidade_atual: 6,
    quantidade_min: 2,
    localizacao: "Bancada A",
    cadastrado_por_id: null
  },
  {
    id: 7,
    nome: "Motor Falcon 500",
    fabricante: "VEX",
    quantidade_atual: 8,
    quantidade_min: 2,
    localizacao: "Bancada B",
    cadastrado_por_id: null
  }
];


router.post('/api/inventario', (req, res) => {
  const { nome, fabricante, quantidade_atual, quantidade_min, localizacao } = req.body;
  
  const novoItem = {
    id: inventario.length > 0 ? Math.max(...inventario.map(i => i.id)) + 1 : 1,
    nome: nome || "Componente COTS",
    fabricante: fabricante || "Genérico",
    quantidade_atual: quantidade_atual || 0,
    quantidade_min: quantidade_min || 0,
    localizacao: localizacao || "Almoxarifado",
    cadastrado_por_id: null
  };

  inventario.push(novoItem);

 
  res.status(201).json({
    message: "Componente cadastrado com sucesso!",
    item: novoItem
  });
});


router.get('/api/inventario', (req, res) => {
  res.status(200).json(inventario);
});

router.get('/api/inventario/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = inventario.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ mensagem: "Componente não encontrado." });
  }
  res.status(200).json(item);
});

router.put('/api/inventario/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = inventario.findIndex(i => i.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ mensagem: "Componente não encontrado." });
  }


  inventario[itemIndex] = {
    ...inventario[itemIndex],
    ...req.body
  };

  res.status(200).json({
    message: "Componente atualizado com sucesso!",
    item: inventario[itemIndex]
  });
});


router.delete('/api/inventario/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = inventario.findIndex(i => i.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ mensagem: "Componente não encontrado." });
  }

  const itemDeletado = inventario[itemIndex];
  inventario.splice(itemIndex, 1);

  res.status(200).json({
    message: "Componente deletado com sucesso!",
    item: itemDeletado
  });
});



router.post('/login', (req, res) => {
  res.status(200).json({ auth: true, token: "mock-jwt-token" });
});

router.post('/usuarios', (req, res) => {
  res.status(201).json({ mensagem: "Usuário cadastrado com sucesso." });
});

router.get('/produtos', (req, res) => {
 res.status(200).json([]);
});

router.post('/produtos', (req, res) => {
  res.status(201).json({ mensagem: "Produto cadastrado com sucesso." });
});

router.put('/produtos/:id', (req, res) => {
  res.status(200).json({ mensagem: "Produto atualizado." });
});

router.delete('/produtos/:id', (req, res) => {
  res.status(200).json({ mensagem: "Produto excluído." });
});

router.post('/movimentacoes', (req, res) => {
  res.status(201).json({ mensagem: "Movimentação registrada com sucesso." });
});

module.exports = router;