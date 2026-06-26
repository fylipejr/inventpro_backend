# InventPro — API de Controle de Estoque

## Stack
| Camada | Tecnologia |
|---|---|
| Back-end | Node.js + Express |
| Banco de dados | MySQL |
| Autenticação | JWT |
| Criptografia de senha | bcrypt |

## Como rodar

```bash

npm install


cp .env.example .env

npm start

```

## Rotas da API

| Método | Rota | RF | Autenticação |
|---|---|---|---|
| POST | /login | RF01 | ❌ |
| POST | /usuarios | RF02 | ❌ |
| GET | /usuarios | RF02 | Admin |
| POST | /produtos | RF03 | ✅ |
| GET | /produtos | RF06 | ✅ |
| GET | /produtos/:id | RF06 | ✅ |
| PUT | /produtos/:id | — | ✅ |
| DELETE | /produtos/:id | RF08 | Admin |
| POST | /movimentacoes | RF04/RF05 | ✅ |
| GET | /movimentacoes | RF07 | ✅ |

## Exemplos de uso no Postman

### RF01 — Login
```
POST /login
{ "email": "admin@email.com", "senha": "123456" }
```

### RF02 — Cadastro de Usuário
```
POST /usuarios
{ "nome": "Fylipe", "email": "fylipe@email.com", "senha": "123456", "perfil": "administrador" }
```

### RF03 — Cadastro de Produto
```
POST /produtos   (Authorization: Bearer <token>)
{ "nome": "Parafuso M6", "codigo": "PAR-001", "quantidade": 100, "preco": 0.50 }
```

### RF04 — Entrada de Produto
```
POST /movimentacoes   (Authorization: Bearer <token>)
{ "id_produto": 1, "tipo": "entrada", "quantidade": 50 }
```

### RF05 — Saída de Produto
```
POST /movimentacoes   (Authorization: Bearer <token>)
{ "id_produto": 1, "tipo": "saida", "quantidade": 10 }
```

### RF06 — Consulta de Estoque
```
GET /produtos   (Authorization: Bearer <token>)
```

### RF07 — Relatório de Movimentações
```
GET /movimentacoes?data_inicio=2026-01-01&data_fim=2026-12-31   (Authorization: Bearer <token>)
```

### RF08 — Excluir Produto (admin)
```
DELETE /produtos/1   (Authorization: Bearer <token do admin>)
```
