import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../db.js';

const router = express.Router();

const loginSchema = z.object({
    login: z.string().min(2).max(50),
    senha: z.string().min(4).max(100),
});

router.post('/login', async (req, res, next) => {
    try {
        const { login, senha } = loginSchema.parse(req.body);

        const result = await query(
            'SELECT id, login, senha_hash, nome, perfil, ativo FROM usuarios WHERE login = $1',
            [login]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        const usuario = result.rows[0];

        if (!usuario.ativo) {
            return res.status(403).json({ error: 'Usuário desativado' });
        }

        const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaOk) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        // Atualiza último acesso
        await query('UPDATE usuarios SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = $1', [usuario.id]);

        const token = jwt.sign(
            { id: usuario.id, login: usuario.login, perfil: usuario.perfil, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        res.json({
            token,
            usuario: {
                id: usuario.id,
                login: usuario.login,
                nome: usuario.nome,
                perfil: usuario.perfil,
            },
        });
    } catch (err) {
        next(err);
    }
});

router.get('/me', async (req, res, next) => {
    // Usuário precisa estar autenticado — middleware aplicado individualmente
    const { autenticar } = await import('../middleware/auth.js');
    autenticar(req, res, () => {
        res.json({ usuario: req.usuario });
    });
});

export default router;
