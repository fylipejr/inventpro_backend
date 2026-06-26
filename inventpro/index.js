require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/', routes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', sistema: 'InventPro', versao: '1.0.0' });
});


app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.listen(PORT, () => {
  console.log(` InventPro rodando na porta ${PORT}`);
});

module.exports = app;
