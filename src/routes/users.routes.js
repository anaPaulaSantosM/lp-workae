const express = require('express');
const router = express.Router();


const pool = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Cadastro de usuário (e-mail e senha)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hash]
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            res.status(409).json({ error: 'E-mail já cadastrado.' });
        } else {
            res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
        }
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'workae_secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// Cadastro/atualização do perfil do candidato
router.post('/cadastrar-perfil-candidato', async (req, res) => {
    const {
        user_id, foto, nome, idade, cidade, estado, formacao, idiomas, telefone, cursos, projetos, hobbies,
        erro, nao_sabe, superacao, inspiracao, motivacao, musica, lugar, porque_contratar, data_contratacao
    } = req.body;
    if (!user_id) return res.status(400).json({ error: 'Usuário não autenticado.' });
    try {
        // Upsert do perfil
        const result = await pool.query(
            `INSERT INTO profiles (
                user_id, foto, nome, idade, cidade, estado, formacao, idiomas, telefone, cursos_extras, projetos, hobbies,
                erro_aprendizado, nao_sabe, superacao, inspiracao, motivacao, musica, lugar_sonho, porque_contratar, data_contratacao
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
            )
            ON CONFLICT (user_id) DO UPDATE SET
                foto = EXCLUDED.foto,
                nome = EXCLUDED.nome,
                idade = EXCLUDED.idade,
                cidade = EXCLUDED.cidade,
                estado = EXCLUDED.estado,
                formacao = EXCLUDED.formacao,
                idiomas = EXCLUDED.idiomas,
                telefone = EXCLUDED.telefone,
                cursos_extras = EXCLUDED.cursos_extras,
                projetos = EXCLUDED.projetos,
                hobbies = EXCLUDED.hobbies,
                erro_aprendizado = EXCLUDED.erro_aprendizado,
                nao_sabe = EXCLUDED.nao_sabe,
                superacao = EXCLUDED.superacao,
                inspiracao = EXCLUDED.inspiracao,
                motivacao = EXCLUDED.motivacao,
                musica = EXCLUDED.musica,
                lugar_sonho = EXCLUDED.lugar_sonho,
                porque_contratar = EXCLUDED.porque_contratar,
                data_contratacao = EXCLUDED.data_contratacao
            RETURNING *;`,
            [
                user_id, foto, nome, idade, cidade, estado, formacao, idiomas, telefone, cursos, projetos, hobbies,
                erro, nao_sabe, superacao, inspiracao, motivacao, musica, lugar, porque_contratar, data_contratacao
            ]
        );
        res.status(200).json({ profile: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar perfil.' });
    }
});

module.exports = router;
