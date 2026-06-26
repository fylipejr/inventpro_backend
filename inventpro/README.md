# InventPro — Backend API

Sistema de controle de estoque para empresas industriais.

## Stack Tecnológica

| Camada       | Tecnologia         |
|--------------|--------------------|
| Back-end     | Node.js + Express  |
| Banco de dados | MySQL            |
| Autenticação | JWT (jsonwebtoken) |
| Criptografia | bcrypt             |
| ORM/Query    | mysql2/promise     |

## Pré-requisitos

- Node.js v18+
- MySQL 8+

## Instalação

```bash
git clone <url-do-repositorio>
cd inventpro
npm install
cp .env.example .env
# Edite o .env com suas credenciais
```

## Banco de Dados

Execute o script SQL para criar as tabelas:

```bash
mysql -u root -p < config/schema.sql
```

## Rodar o servidor

```bash
node index.js
```

## Rotas da API

| Método | Rota              | RF    | Descrição                        | Auth |
|--------|-------------------|-------|----------------------------------|------|
| POST   | /login            | RF01  | Login com JWT                    | ❌   |
| POST   | /usuarios         | RF02  | Cadastrar usuário                | ❌   |
| GET    | /usuarios         | RF02  | Listar usuários                  | Admin|
| POST   | /produtos         | RF03  | Cadastrar produto                | ✅   |
| GET    | /produtos         | RF06  | Consultar estoque                | ✅   |
| GET    | /produtos/:id     | RF06  | Buscar produto por ID            | ✅   |
| PUT    | /produtos/:id     | -     | Atualizar produto                | ✅   |
| DELETE | /produtos/:id     | RF08  | Excluir produto (admin)          | Admin|
| POST   | /movimentacoes    | RF04/5| Registrar entrada ou saída       | ✅   |
| GET    | /movimentacoes    | RF07  | Relatório de movimentações       | ✅   |

## Requisitos Funcionais Implementados

- **RF01** — Login com JWT e controle de perfil (administrador/funcionário)
- **RF02** — Cadastro de usuários com senha criptografada (bcrypt)
- **RF03** — Cadastro de produtos com código único
- **RF04** — Entrada de produtos com incremento de estoque
- **RF05** — Saída de produtos sem permitir estoque negativo
- **RF06** — Consulta de estoque com listagem de todos os produtos
- **RF07** — Relatório de movimentações com filtros por período e tipo
- **RF08** — Exclusão de produtos restrita a administradores

## Requisitos Não Funcionais

- **RNF04** — Senhas criptografadas com bcrypt (salt rounds: 10)
- **RNF03** — API REST compatível com qualquer cliente (Postman, browser, mobile)
