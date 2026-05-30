
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAdminToken, getAdminToken } from '../../utils/adminAuth';

interface Order {
    id: number;
    cliente: string;
    whatsapp: string;
    modeloXbox: string;
    total: number;
    status: string;
    data: string;
}

interface OrdersResponse {
    data: Order[];
    meta: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        stats: {
            revenue: number;
            novo: number;
            emAndamento: number;
            concluido: number;
        };
    };
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const [stats, setStats] = useState({
        revenue: 0,
        novo: 0,
        emAndamento: 0,
        concluido: 0
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const pageSize = 20;

    const buildQuery = useMemo(() => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (statusFilter !== 'Todos') params.set('status', statusFilter);
        if (searchTerm.trim()) params.set('search', searchTerm.trim());
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        return params.toString();
    }, [endDate, page, searchTerm, startDate, statusFilter]);

    useEffect(() => {
        const adminToken = getAdminToken();
        if (!adminToken) {
            navigate('/admin', { replace: true });
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        setError('');

        fetch(`${API_URL}/api/orders?${buildQuery}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        })
            .then(async res => {
                if (res.status === 401) {
                    clearAdminToken();
                    navigate('/admin', { replace: true });
                    throw new Error('Sessão expirada.');
                }
                if (!res.ok) {
                    throw new Error('Falha ao carregar pedidos.');
                }
                return res.json();
            })
            .then((payload: OrdersResponse) => {
                setOrders(payload.data);
                setTotalPages(payload.meta.totalPages);
                setTotalOrders(payload.meta.total);
                setStats(payload.meta.stats);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Falha ao carregar pedidos.');
                setLoading(false);
            });
    }, [API_URL, buildQuery, navigate, reloadKey]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Novo': return '#e74c3c';
            case 'Em andamento': return '#f39c12';
            case 'Concluído': return '#27ae60';
            default: return '#7f8c8d';
        }
    };

    const exportCurrentPageCsv = () => {
        const headers = ['ID', 'Data', 'Cliente', 'WhatsApp', 'Modelo', 'Status', 'Total'];
        const rows = orders.map((order) => [
            String(order.id),
            new Date(order.data).toLocaleString('pt-BR'),
            order.cliente,
            order.whatsapp,
            order.modeloXbox,
            order.status,
            order.total.toFixed(2)
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pedidos_pagina_${page}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container fade-in">
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Painel Administrativo</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>Ir para Loja</button>
                    <button className="btn btn-secondary" onClick={() => setReloadKey((v) => v + 1)}>Atualizar</button>
                    <button className="btn btn-secondary" onClick={exportCurrentPageCsv} disabled={orders.length === 0}>
                        Exportar CSV
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            clearAdminToken();
                            navigate('/admin', { replace: true });
                        }}
                    >
                        Sair
                    </button>
                </div>
            </div>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div><strong>Total:</strong> {totalOrders}</div>
                <div><strong>Novo:</strong> {stats.novo}</div>
                <div><strong>Em andamento:</strong> {stats.emAndamento}</div>
                <div><strong>Concluído:</strong> {stats.concluido}</div>
                <div><strong>Receita:</strong> R$ {stats.revenue.toFixed(2)}</div>
            </div>

            <div className="card">
                <h3>Pedidos ({orders.length} na página)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '10px', marginTop: '12px' }}>
                    <input
                        type="text"
                        placeholder="Buscar cliente, WhatsApp, modelo"
                        value={searchTerm}
                        onChange={(e) => {
                            setPage(1);
                            setSearchTerm(e.target.value);
                        }}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setPage(1);
                            setStatusFilter(e.target.value);
                        }}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Novo">Novo</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Concluído">Concluído</option>
                    </select>
                    <input type="date" value={startDate} onChange={(e) => { setPage(1); setStartDate(e.target.value); }} />
                    <input type="date" value={endDate} onChange={(e) => { setPage(1); setEndDate(e.target.value); }} />
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            setPage(1);
                            setStatusFilter('Todos');
                            setSearchTerm('');
                            setStartDate('');
                            setEndDate('');
                        }}
                    >
                        Limpar Filtros
                    </button>
                </div>
                {loading && <p style={{ marginTop: '12px' }}>Carregando...</p>}
                {error && <p style={{ marginTop: '12px', color: '#e74c3c' }}>{error}</p>}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>Data</th>
                            <th style={{ padding: '10px' }}>Cliente</th>
                            <th style={{ padding: '10px' }}>WhatsApp</th>
                            <th style={{ padding: '10px' }}>Modelo</th>
                            <th style={{ padding: '10px' }}>Valor</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            <th style={{ padding: '10px' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '10px' }}>#{order.id}</td>
                                <td style={{ padding: '10px' }}>{new Date(order.data).toLocaleDateString('pt-BR')}</td>
                                <td style={{ padding: '10px' }}>{order.cliente}</td>
                                <td style={{ padding: '10px' }}>{order.whatsapp}</td>
                                <td style={{ padding: '10px' }}>{order.modeloXbox}</td>
                                <td style={{ padding: '10px' }}>R$ {order.total.toFixed(2)}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{
                                        backgroundColor: getStatusColor(order.status),
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                        onClick={() => navigate(`/admin/orders/${order.id}`)} // This route needs to be added to App.tsx? Yes, it is added.
                                    >
                                        Ver Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Página {page} de {totalPages}</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                            Anterior
                        </button>
                        <button className="btn btn-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                            Próxima
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
