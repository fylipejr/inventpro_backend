-- InventPro — Criação do banco de dados
-- DRS v4.0

CREATE DATABASE IF NOT EXISTS inventpro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventpro;

-- RF01 / RF02 — Tabela de usuários (contas)
CREATE TABLE IF NOT EXISTS contas (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  senha      VARCHAR(255) NOT NULL,
  perfil     VARCHAR(20)  NOT NULL DEFAULT 'funcionario'
  -- perfil: 'administrador' | 'funcionario'
);

-- RF03 / RF06 / RF08 — Tabela de produtos (mercadorias)
CREATE TABLE IF NOT EXISTS mercadorias (
  id_produto INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100)  NOT NULL,
  codigo     VARCHAR(50)   NOT NULL UNIQUE,   -- código único (RF03)
  quantidade INT           NOT NULL DEFAULT 0,
  preco      DECIMAL(10,2) NOT NULL
);

-- RF04 / RF05 / RF07 — Tabela de movimentações (registros)
CREATE TABLE IF NOT EXISTS registros (
  id_registro   INT AUTO_INCREMENT PRIMARY KEY,
  tipo          VARCHAR(10)  NOT NULL,         -- 'entrada' | 'saida'
  quantidade    INT          NOT NULL,
  data_registro DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_produto    INT          NOT NULL,
  id_usuario    INT          NOT NULL,
  FOREIGN KEY (id_produto)  REFERENCES mercadorias(id_produto),
  FOREIGN KEY (id_usuario)  REFERENCES contas(id_usuario)
);
