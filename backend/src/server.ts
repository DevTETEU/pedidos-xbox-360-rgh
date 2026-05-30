
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const VALID_STATUS = ['Novo', 'Em andamento', 'Concluído'];
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

app.use(cors());
app.use(express.json());

function parseOrderId(idParam: string): number | null {
    const parsed = Number(idParam);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    return parsed;
}

function validateCreateOrderPayload(body: any): string | null {
    if (!body || typeof body !== 'object') return 'Payload inválido.';

    const { cliente, whatsapp, observacoes, modeloXbox, desbloqueio, possuiArmazenamento, itens, total } = body;

    if (typeof cliente !== 'string' || !cliente.trim()) return 'Nome do cliente é obrigatório.';
    if (typeof whatsapp !== 'string' || !whatsapp.trim()) return 'WhatsApp é obrigatório.';
    if (observacoes != null && typeof observacoes !== 'string') return 'Observações inválidas.';
    if (typeof modeloXbox !== 'string' || !modeloXbox.trim()) return 'Modelo do console é obrigatório.';
    if (typeof desbloqueio !== 'boolean') return 'Campo desbloqueio inválido.';
    if (typeof possuiArmazenamento !== 'boolean') return 'Campo possuiArmazenamento inválido.';
    if (!Array.isArray(itens) || itens.length === 0) return 'Selecione ao menos um jogo.';
    if (typeof total !== 'number' || Number.isNaN(total) || total < 0) return 'Total inválido.';

    for (const item of itens) {
        if (!item || typeof item !== 'object') return 'Item de pedido inválido.';
        if (!Number.isInteger(item.jogoId) || item.jogoId <= 0) return 'jogoId inválido.';
        if (typeof item.gratuito !== 'boolean') return 'Campo gratuito inválido.';
    }

    return null;
}

function isAuthorizedAdmin(req: any): boolean {
    const authHeader = req.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') return false;
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return false;
    return token === ADMIN_TOKEN;
}

// Health Check
app.get('/', (req, res) => {
    res.send('Xbox 360 RGH API is running!');
});

// GET /api/games - List all games
app.get('/api/games', async (req, res) => {
    try {
        const games = await prisma.game.findMany({
            orderBy: { nome: 'asc' }
        });
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// POST /api/orders - Create new order
app.post('/api/orders', async (req, res) => {
    const { cliente, whatsapp, observacoes, modeloXbox, desbloqueio, possuiArmazenamento, itens, total } = req.body;
    const validationError = validateCreateOrderPayload(req.body);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const order = await prisma.order.create({
            data: {
                cliente,
                whatsapp,
                observacoes,
                modeloXbox,
                desbloqueio,
                possuiArmazenamento,
                total,
                status: 'Novo',
                itens: {
                    create: itens.map((item: { jogoId: number; gratuito: boolean }) => ({
                        jogoId: item.jogoId,
                        gratuito: item.gratuito
                    }))
                }
            }
        });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// ADMIN ROUTES
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body ?? {};

    if (typeof password !== 'string' || !password) {
        return res.status(400).json({ error: 'Senha inválida' });
    }

    if (!ADMIN_PASSWORD || !ADMIN_TOKEN) {
        return res.status(500).json({ error: 'Configuração admin ausente no servidor' });
    }

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    return res.json({ token: ADMIN_TOKEN });
});

// GET /api/orders - List orders
app.get('/api/orders', async (req, res) => {
    if (!isAuthorizedAdmin(req)) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    try {
        const { status, search, startDate, endDate, page = '1', pageSize = '20' } = req.query;
        const pageNumber = Math.max(1, Number(page) || 1);
        const pageSizeNumber = Math.min(100, Math.max(1, Number(pageSize) || 20));

        const where: any = {};

        if (typeof status === 'string' && VALID_STATUS.includes(status)) {
            where.status = status;
        }

        if (typeof search === 'string' && search.trim()) {
            where.OR = [
                { cliente: { contains: search.trim(), mode: 'insensitive' } },
                { whatsapp: { contains: search.trim(), mode: 'insensitive' } },
                { modeloXbox: { contains: search.trim(), mode: 'insensitive' } }
            ];
        }

        if ((typeof startDate === 'string' && startDate) || (typeof endDate === 'string' && endDate)) {
            where.data = {};
            if (typeof startDate === 'string' && startDate) {
                where.data.gte = new Date(`${startDate}T00:00:00.000Z`);
            }
            if (typeof endDate === 'string' && endDate) {
                where.data.lte = new Date(`${endDate}T23:59:59.999Z`);
            }
        }

        const [orders, total, aggregates, byStatus] = await Promise.all([
            prisma.order.findMany({
                where,
                orderBy: { data: 'desc' },
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                include: { itens: { include: { jogo: true } } }
            }),
            prisma.order.count({ where }),
            prisma.order.aggregate({
                where,
                _sum: { total: true }
            }),
            prisma.order.groupBy({
                by: ['status'],
                where,
                _count: { status: true }
            })
        ]);

        const statusMap = byStatus.reduce((acc: any, item: any) => {
            acc[item.status] = item._count.status;
            return acc;
        }, {});

        res.json({
            data: orders,
            meta: {
                total,
                page: pageNumber,
                pageSize: pageSizeNumber,
                totalPages: Math.max(1, Math.ceil(total / pageSizeNumber)),
                stats: {
                    revenue: aggregates._sum.total || 0,
                    novo: statusMap['Novo'] || 0,
                    emAndamento: statusMap['Em andamento'] || 0,
                    concluido: statusMap['Concluído'] || 0
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// GET /api/orders/:id - Get order details
app.get('/api/orders/track', async (req, res) => {
    const { orderId, whatsapp } = req.query;
    const parsedId = parseOrderId(String(orderId || ''));

    if (!parsedId || typeof whatsapp !== 'string' || !whatsapp.trim()) {
        return res.status(400).json({ error: 'Parâmetros inválidos' });
    }

    const normalizedWhatsapp = whatsapp.replace(/\D/g, '');

    try {
        const order = await prisma.order.findUnique({
            where: { id: parsedId }
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        const orderWhatsapp = String(order.whatsapp || '').replace(/\D/g, '');
        if (orderWhatsapp !== normalizedWhatsapp) {
            return res.status(403).json({ error: 'Dados não conferem' });
        }

        res.json({
            id: order.id,
            cliente: order.cliente,
            status: order.status,
            data: order.data,
            total: order.total,
            modeloXbox: order.modeloXbox
        });
    } catch (error) {
        res.status(500).json({ error: 'Falha ao consultar pedido' });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    if (!isAuthorizedAdmin(req)) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    const parsedId = parseOrderId(req.params.id);
    if (!parsedId) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: parsedId },
            include: { itens: { include: { jogo: true } } }
        });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', async (req, res) => {
    if (!isAuthorizedAdmin(req)) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    const { status } = req.body;
    const parsedId = parseOrderId(req.params.id);

    if (!parsedId) {
        return res.status(400).json({ error: 'ID inválido' });
    }
    if (typeof status !== 'string' || !VALID_STATUS.includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
    }

    try {
        const order = await prisma.order.update({
            where: { id: parsedId },
            data: { status }
        });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// For Vercel, we export the app
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
