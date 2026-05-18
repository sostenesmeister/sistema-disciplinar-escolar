import jwt from 'jsonwebtoken';

export function autenticar(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    const token = header.substring(7);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

export function autorizar(...perfisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({
                error: 'Acesso negado. Perfis permitidos: ' + perfisPermitidos.join(', '),
            });
        }
        next();
    };
}
