import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import alunosRoutes from './routes/alunos.js';
import turmasRoutes from './routes/turmas.js';
import ocorrenciasRoutes from './routes/ocorrencias.js';
import usuariosRoutes from './routes/usuarios.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Segurança
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
}));

// Rate limit (100 req / 15min por IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' },
});
app.use('/api/', limiter);

// Body parser & logs
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/auth',        authRoutes);
app.use('/api/alunos',      alunosRoutes);
app.use('/api/turmas',      turmasRoutes);
app.use('/api/ocorrencias', ocorrenciasRoutes);
app.use('/api/usuarios',    usuariosRoutes);
app.use('/api/dashboard',   dashboardRoutes);

// Handler de erro global
app.use((err, _req, res, _next) => {
    console.error('[ERRO]', err);
    if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Dados inválidos', detalhes: err.errors });
    }
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor',
    });
});

// 404
app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 API:  http://localhost:${PORT}/api`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
});
