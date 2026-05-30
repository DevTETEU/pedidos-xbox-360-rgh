
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


    if (!hasValidId) return <div className="container">Pedido inválido.</div>;
    if (loading) return <div className="container">Carregando...</div>;
    if (error || !order) return <div className="container">{error || 'Pedido não encontrado.'}</div>;

    return (
        <div className="container fade-in" style={{ maxWidth: '800px', marginTop: '40px' }}>
            <button 
                className="btn" 
                style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', marginBottom: '30px', padding: '10px 20px' }} 
                onClick={() => navigate('/admin/dashboard')}
            >
                &larr; Voltar ao Painel
            </button>

            <div className="card" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem' }}>Pedido <span className="accent-text">#{order.id}</span></h1>
                        <p style={{ color: '#888', marginTop: '5px' }}>
                            Data do pedido: {new Date(order.data).toLocaleDateString('pt-BR')} às {new Date(order.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' }}>Status do Pedido</label>
                        <select
                            value={order.status}
                            onChange={(e) => updateStatus(e.target.value)}
                            style={{ 
                                padding: '10px 15px', 
                                backgroundColor: 'transparent', 
                                color: 'white', 
                                border: '1px solid var(--xbox-green)', 
                                borderRadius: '8px',
                                outline: 'none',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="Novo" style={{ background: '#222' }}>Novo</option>
                            <option value="Em andamento" style={{ background: '#222' }}>Em andamento</option>
                            <option value="Concluído" style={{ background: '#222' }}>Concluído</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '40px' }}>
                    <div>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>Cliente</span>
                        <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{order.cliente}</p>
                    </div>
                    <div>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>WhatsApp</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{order.whatsapp}</p>
                            <a
                                href={`https://wa.me/55${order.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: '#2ecc71', textDecoration: 'none', fontSize: '0.9rem', padding: '4px 10px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '20px' }}
                            >
                                Iniciar Conversa
                            </a>
                        </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px' }}>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>Observações do Cliente</span>
                        <p style={{ fontSize: '1.1rem', marginTop: '5px' }}>{order.observacoes || 'Nenhuma observação informada.'}</p>
                    </div>
                    <div>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>Modelo do Console</span>
                        <p style={{ fontSize: '1.1rem' }}>{order.modeloXbox}</p>
                    </div>
                    <div>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>Serviço RGH</span>
                        <p style={{ fontSize: '1.1rem' }}>{order.desbloqueio ? 'Solicitado' : 'Não Solicitado'}</p>
                    </div>
                    <div>
                        <span style={{ color: '#888', fontSize: '0.9rem' }}>Armazenamento Externo</span>
                        <p style={{ fontSize: '1.1rem' }}>{order.possuiArmazenamento ? 'Possui (HD/PenDrive)' : 'Não Possui'}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '15px', color: 'var(--xbox-green)' }}>🕹️ Jogos Escolhidos ({order.itens?.length || 0})</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                        {order.itens?.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '500' }}>{item.jogo.nome}</p>
                                </div>
                                {item.gratuito && (
                                    <span style={{ background: 'rgba(243, 156, 18, 0.1)', color: '#f39c12', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>Grátis</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#888' }}>Valor Total</h2>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--xbox-green)' }}>R$ {order.total.toFixed(2).replace('.', ',')}</h1>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
