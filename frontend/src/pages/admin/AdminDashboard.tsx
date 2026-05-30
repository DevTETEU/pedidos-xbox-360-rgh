
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
        <div className="container fade-in" style={{ maxWidth: '1200px', marginTop: '40px' }}>
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1>Painel <span className="accent-text">Administrativo</span></h1>
                    <p style={{ color: '#888' }}>Gestão de Pedidos ALM TEC</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn" style={{ background: 'transparent', border: '1px solid #444', color: '#ccc' }} onClick={() => navigate('/')}>Ir para Loja</button>
                    <button className="btn" style={{ background: 'transparent', border: '1px solid var(--xbox-green)', color: 'var(--xbox-green)' }} onClick={() => setReloadKey((v) => v + 1)}>Atualizar</button>
                    <button className="btn" onClick={exportCurrentPageCsv} disabled={orders.length === 0}>
                        Exportar CSV
                    </button>
                    <button
                        className="btn"
                        style={{ background: '#e74c3c' }}
                        onClick={() => {
                            clearAdminToken();
                            navigate('/admin', { replace: true });
                        }}
                    >
                        Sair
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>Total de Pedidos</span>
                    <h2 style={{ fontSize: '2rem', marginTop: '10px' }}>{totalOrders}</h2>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '20px', borderBottom: '3px solid #e74c3c' }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>Novos</span>
                    <h2 style={{ fontSize: '2rem', marginTop: '10px', color: '#e74c3c' }}>{stats.novo}</h2>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '20px', borderBottom: '3px solid #f39c12' }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>Em Andamento</span>
                    <h2 style={{ fontSize: '2rem', marginTop: '10px', color: '#f39c12' }}>{stats.emAndamento}</h2>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '20px', borderBottom: '3px solid var(--xbox-green)' }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>Concluídos</span>
                    <h2 style={{ fontSize: '2rem', marginTop: '10px', color: 'var(--xbox-green)' }}>{stats.concluido}</h2>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(145deg, rgba(16,124,16,0.1), rgba(20,20,20,0.9))' }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>Receita Total</span>
                    <h2 style={{ fontSize: '1.8rem', marginTop: '10px', color: 'var(--xbox-green)' }}>R$ {stats.revenue.toFixed(2).replace('.', ',')}</h2>
                </div>
            </div>

            <div className="card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                    <h3 style={{ fontSize: '1.5rem' }}>Lista de Pedidos <span style={{ color: '#888', fontSize: '1rem', fontWeight: 'normal' }}>({orders.length} na página)</span></h3>
                    <button
                        className="btn"
                        style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '8px 15px' }}
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
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#888', fontSize: '0.9rem' }}>Buscar</label>
                        <input
                            type="text"
                            placeholder="Cliente, WhatsApp, modelo..."
                            value={searchTerm}
                            onChange={(e) => {
                                setPage(1);
                                setSearchTerm(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#888', fontSize: '0.9rem' }}>Status</label>
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
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#888', fontSize: '0.9rem' }}>Data Inicial</label>
                        <input type="date" value={startDate} onChange={(e) => { setPage(1); setStartDate(e.target.value); }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#888', fontSize: '0.9rem' }}>Data Final</label>
                        <input type="date" value={endDate} onChange={(e) => { setPage(1); setEndDate(e.target.value); }} />
                    </div>
                </div>

                {loading && <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--xbox-green)' }}>Carregando dados...</div>}
                {error && <div style={{ textAlign: 'center', padding: '40px 0', color: '#e74c3c' }}>{error}</div>}
                
                {!loading && !error && orders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>Nenhum pedido encontrado.</div>
                )}
                
                {!loading && !error && orders.length > 0 && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#888' }}>
                                    <th style={{ padding: '15px 10px', fontWeight: '500' }}>ID</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '500' }}>Data</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '500' }}>Cliente</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '500' }}>WhatsApp</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '500' }}>Modelo</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '500' }}>Valor</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '500' }}>Status</th>
                                    <th style={{ padding: '15px 10px', fontWeight: '500', textAlign: 'center' }}>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>#{order.id}</td>
                                        <td style={{ padding: '15px 10px', color: '#ccc' }}>{new Date(order.data).toLocaleDateString('pt-BR')}</td>
                                        <td style={{ padding: '15px 10px' }}>{order.cliente}</td>
                                        <td style={{ padding: '15px 10px', color: '#ccc' }}>{order.whatsapp}</td>
                                        <td style={{ padding: '15px 10px', color: '#ccc' }}>{order.modeloXbox}</td>
                                        <td style={{ padding: '15px 10px', fontWeight: '500' }}>R$ {order.total.toFixed(2).replace('.', ',')}</td>
                                        <td style={{ padding: '15px 10px' }}>
                                            <span style={{
                                                backgroundColor: `${getStatusColor(order.status)}20`,
                                                color: getStatusColor(order.status),
                                                border: `1px solid ${getStatusColor(order.status)}`,
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <button
                                                className="btn"
                                                style={{ padding: '8px 15px', fontSize: '0.85rem' }}
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                            >
                                                Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <span style={{ color: '#888' }}>Página <strong style={{ color: '#fff' }}>{page}</strong> de <strong style={{ color: '#fff' }}>{totalPages}</strong></span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn" style={{ background: 'transparent', border: '1px solid #444', color: '#ccc' }} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                            &larr; Anterior
                        </button>
                        <button className="btn" style={{ background: 'transparent', border: '1px solid #444', color: '#ccc' }} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                            Próxima &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
