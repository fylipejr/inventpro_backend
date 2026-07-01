require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

const PORT = process.env.PORT || 3333;


fastify.register(cors);


fastify.get('/health', async (request, reply) => {
  return reply.status(200).send({ status: 'ok', sistema: 'InventPro', versao: '1.0.0' });
});


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


async function inventProRoutes(fastifyApp, options) {


  fastifyApp.post('/api/inventario', async (request, reply) => {
    const { nome, fabricante, quantidade_atual, quantidade_min, localizacao } = request.body || {};

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

    return reply.status(201).send({
      message: "Componente cadastrado com sucesso!",
      item: novoItem
    });
  });

  fastifyApp.get('/api/inventario', async (request, reply) => {
    return reply.status(200).send(inventario);
  });


  fastifyApp.get('/api/inventario/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const item = inventario.find(i => i.id === id);

    if (!item) {
      return reply.status(404).send({ mensagem: "Componente não encontrado." });
    }
    return reply.status(200).send(item);
  });


  fastifyApp.put('/api/inventario/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const itemIndex = inventario.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return reply.status(404).send({ mensagem: "Componente não encontrado." });
    }

    inventario[itemIndex] = {
      ...inventario[itemIndex],
      ...request.body
    };

    return reply.status(200).send({
      message: "Componente atualizado com sucesso!",
      item: inventario[itemIndex]
    });
  });


  fastifyApp.delete('/api/inventario/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const itemIndex = inventario.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return reply.status(404).send({ mensagem: "Componente não encontrado." });
    }

    const itemDeletado = inventario[itemIndex];
    inventario.splice(itemIndex, 1);

    return reply.status(200).send({
      message: "Componente deletado com sucesso!",
      item: itemDeletado
    });
  });


  fastifyApp.post('/login', async (request, reply) => {
    return reply.status(200).send({ auth: true, token: "mock-jwt-token" });
  });

  fastifyApp.post('/usuarios', async (request, reply) => {
    return reply.status(201).send({ mensagem: "Usuário cadastrado com sucesso." });
  });

  fastifyApp.get('/produtos', async (request, reply) => {
    return reply.status(200).send([]);
  });

  fastifyApp.post('/produtos', async (request, reply) => {
    return reply.status(201).send({ mensagem: "Produto cadastrado com sucesso." });
  });

  fastifyApp.put('/produtos/:id', async (request, reply) => {
    return reply.status(200).send({ mensagem: "Produto atualizado." });
  });

  fastifyApp.delete('/produtos/:id', async (request, reply) => {
    return reply.status(200).send({ mensagem: "Produto excluído." });
  });

  fastifyApp.post('/movimentacoes', async (request, reply) => {
    return reply.status(201).send({ mensagem: "Movimentação registrada com sucesso." });
  });
}


fastify.register(inventProRoutes);


fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({ mensagem: 'Rota não encontrada.' });
});


const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`InventPro rodando perfeitamente em http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();