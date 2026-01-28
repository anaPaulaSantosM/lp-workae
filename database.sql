-- Script para criar as tabelas 'users' e 'profiles' no seu banco de dados PostgreSQL (Neon).

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    foto TEXT,
    nome TEXT,
    idade INTEGER,
    cidade TEXT,
    estado TEXT,
    formacao TEXT,
    idiomas TEXT,
    telefone TEXT,
    cursos_extras TEXT,
    projetos TEXT,
    hobbies TEXT,
    erro_aprendizado TEXT,
    nao_sabe TEXT,
    superacao TEXT,
    inspiracao TEXT,
    motivacao TEXT,
    musica TEXT,
    lugar_sonho TEXT,
    porque_contratar TEXT,
    data_contratacao DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
