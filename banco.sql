CREATE TABLE IF NOT EXISTS contas (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL
);


CREATE TABLE IF NOT EXISTS mercadorias (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    codigo VARCHAR(50) UNIQUE, 
    quantidade_atual INT NOT NULL DEFAULT 0,
    quantidade_min INT NOT NULL DEFAULT 0,
    localizacao VARCHAR(100) DEFAULT 'Almoxarifado',
    cadastrado_por_id INT NULL,
    FOREIGN KEY (cadastrado_por_id) REFERENCES contas(id_usuario) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS registros (
    id_registro SERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL, 
    quantidade INT NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    id_produto INT NOT NULL,
    FOREIGN KEY (id_produto) REFERENCES mercadorias(id_produto) ON DELETE CASCADE
);


INSERT INTO mercadorias (id_produto, nome, fabricante, codigo, quantidade_atual, quantidade_min, localizacao) VALUES 
(5, 'Motor Falcon 58', 'VEX', 'COTS-005', 6, 2, 'Bancada A'),
(7, 'Motor Falcon 500', 'VEX', 'COTS-007', 8, 2, 'Bancada B')
ON CONFLICT (id_produto) DO NOTHING;