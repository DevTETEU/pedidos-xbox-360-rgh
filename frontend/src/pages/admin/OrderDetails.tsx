
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clearAdminToken, getAdminToken } from '../../utils/adminAuth';

interface Game {
    id: number;
    nome: string;
    categoria: string;
}

interface OrderItem {
    id: number;
    gratuito: boolean;
    jogo: Game;
}

interface Order {
    id: number;
    cliente: string;
    whatsapp: string;
    observacoes?: string;
    modeloXbox: string;
    desbloqueio: boolean;
    possuiArmazenamento: boolean;
    status: string;
    total: number;
    data: string;
    itens: OrderItem[];
}

const OrderDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const hasValidId = Boolean(id && Number.isInteger(Number(id)));

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        if (!hasValidId) {
            return;
        }

        const adminToken = getAdminToken();
        if (!adminToken) {
            navigate('/admin', { replace: true });
            return;
        }

        fetch(`${API_URL}/api/orders/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        })
            .then(async res => {
                if (res.status === 401) {
                    clearAdminToken();
                    navigate('/admin', { replace: true });
                    throw new Error('Sessão expirada.');
                }
                if (!res.ok) {
                    throw new Error('Não foi possível carregar o pedido.');
                }
                return res.json();
            })
            .then(data => {
                setOrder(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Não foi possível carregar o pedido.');
                setLoading(false);
            });
    }, [API_URL, hasValidId, id, navigate]);

    const updateStatus = (newStatus: string) => {
        const adminToken = getAdminToken();
        if (!adminToken) {
            clearAdminToken();
            navigate('/admin', { replace: true });
            return;
        }

        fetch(`${API_URL}/api/orders/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(async res => {
                if (res.status === 401) {
                    clearAdminToken();
                    navigate('/admin', { replace: true });
                    throw new Error('Sessão expirada.');
                }
                if (!res.ok) {
                    throw new Error('Falha ao atualizar status.');
                }
                return res.json();
            })
            .then(data => {
                setOrder((current) => current ? { ...current, status: data.status } : current);
            })
            .catch((err) => {
                console.error(err);
                alert('Erro ao atualizar status.');
            });
    };

    const copyWhatsapp = async () => {
        try {
            await navigator.clipboard.writeText(order?.whatsapp || '');
            alert('WhatsApp copiado.');
        } catch (e) {
            console.error(e);
            alert('Não foi possível copiar.');
        }
    };

    if (!hasValidId) return <div className="container">Pedido inválido.</div>;
    if (loading) return <div className="container">Carregando...</div>;
    if (error || !order) return <div className="container">{error || 'Pedido não encontrado.'}</div>;

    return (
        <div className="container fade-in">
            <button className="btn-secondary" onClick={() => navigate('/admin/dashboard')} style={{ marginBottom: '20px' }}>
                &larr; Voltar
            </button>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>Pedido #{order.id}</h1>
                    <div>
                        <select
                            value={order.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: '1px solid #555' }}
                        >
                            <option value="Novo">Novo</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Concluído">Concluído</option>
                        </select>
                    </div>
                </div>

                <p><strong>Cliente:</strong> {order.cliente}</p>
                <p><strong>Data:</strong> {new Date(order.data).toLocaleString('pt-BR')}</p>
                <p><strong>WhatsApp:</strong> {order.whatsapp}
                    <a
                        href={`https://wa.me/${order.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginLeft: '10px', color: '#2ecc71' }}
                    >
                        (Abrir WhatsApp)
                    </a>
                    <button className="btn-secondary" onClick={copyWhatsapp} style={{ marginLeft: '10px', padding: '4px 8px' }}>
                        Copiar
                    </button>
                </p>
                <p><strong>Observações:</strong> {order.observacoes || '-'}</p>
                <p><strong>Console:</strong> {order.modeloXbox}</p>
                <p><strong>Desbloqueio RGH:</strong> {order.desbloqueio ? 'Sim' : 'Não'}</p>
                <p><strong>Armazenamento:</strong> {order.possuiArmazenamento ? 'Sim' : 'Não'}</p>

                <h3>Jogos Escolhidos:</h3>
                <ul>
                    {order.itens?.map((item) => (
                        <li key={item.id}>
                            {item.jogo.nome}
                            {item.gratuito && <span style={{ color: '#f39c12', marginLeft: '5px' }}>(Grátis)</span>}
                        </li>
                    ))}
                </ul>

                <h2 style={{ marginTop: '20px', color: 'var(--color-primary)' }}>Total: R$ {order.total.toFixed(2)}</h2>
            </div>
        </div>
    );
};

export default OrderDetails;
