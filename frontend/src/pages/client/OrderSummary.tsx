
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';

const OrderSummary: React.FC = () => {
    const navigate = useNavigate();
    const {
        client, consoleInfo, selectedGames,
        totalPrice, freeGamesCount, paidGamesCount,
        resetOrder
    } = useOrder();

    React.useEffect(() => {
        if (!client.nome) navigate('/client');
    }, [client.nome, navigate]);

    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = () => {
        setSubmitting(true);

        const gamesText = selectedGames.map(g => `- ${g.nome} (${g.categoria})`).join('%0A');
        
        let message = `*NOVO PEDIDO - XBOX 360*%0A%0A`;
        message += `*Cliente:* ${client.nome}%0A`;
        message += `*WhatsApp:* ${client.whatsapp}%0A`;
        if (client.observacoes) message += `*Obs:* ${client.observacoes}%0A`;
        message += `%0A*CONSOLE*%0A`;
        message += `*Modelo:* ${consoleInfo.modelo}%0A`;
        message += `*Desbloqueio RGH:* ${consoleInfo.desbloqueio ? 'Sim (+R$50)' : 'Não'}%0A`;
        message += `*Armazenamento:* ${consoleInfo.possuiArmazenamento ? 'Possui' : 'Não possui'}%0A`;
        message += `%0A*JOGOS ESCOLHIDOS (${selectedGames.length})*%0A`;
        message += gamesText + '%0A';
        message += `%0A*TOTAL A PAGAR:* R$ ${totalPrice.toFixed(2).replace('.', ',')}%0A`;

        const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5564999785886';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
        
        resetOrder();
        navigate('/');
        setSubmitting(false);
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '800px', marginTop: '40px' }}>
            <div className="header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1>Resumo do <span className="accent-text">Pedido</span></h1>
                <p>Revise suas escolhas antes de enviar.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '15px', color: 'var(--xbox-green)' }}>👤 Dados do Cliente</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Nome</span>
                            <p style={{ fontSize: '1.1rem' }}>{client.nome}</p>
                        </div>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>WhatsApp</span>
                            <p style={{ fontSize: '1.1rem' }}>{client.whatsapp}</p>
                        </div>
                        {client.observacoes && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <span style={{ color: '#888', fontSize: '0.9rem' }}>Observações</span>
                                <p>{client.observacoes}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '15px', color: 'var(--xbox-green)' }}>🎮 Informações do Console</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Modelo</span>
                            <p style={{ fontSize: '1.1rem' }}>{consoleInfo.modelo}</p>
                        </div>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Serviço RGH</span>
                            <p style={{ fontSize: '1.1rem' }}>{consoleInfo.desbloqueio ? 'Sim (+R$ 50,00)' : 'Não'}</p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Armazenamento Externo (HD/PenDrive)</span>
                            <p style={{ fontSize: '1.1rem' }}>{consoleInfo.possuiArmazenamento ? 'Possui' : 'Não Possui'}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: 'var(--xbox-green)' }}>🕹️ Jogos Selecionados</h3>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
                            Total: {selectedGames.length}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <span style={{ color: '#2ecc71', fontSize: '0.9rem' }}>• {freeGamesCount} Grátis</span>
                        <span style={{ color: '#f39c12', fontSize: '0.9rem' }}>• {paidGamesCount} Pagos</span>
                    </div>

                    <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedGames.map(g => (
                            <div key={g.nome} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <div>
                                    <p style={{ fontWeight: '500' }}>{g.nome}</p>
                                    <span style={{ color: '#888', fontSize: '0.8rem' }}>{g.categoria}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ border: '2px solid var(--xbox-green)', background: 'linear-gradient(145deg, rgba(16, 124, 16, 0.1), rgba(20, 20, 20, 0.9))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.5rem' }}>TOTAL A PAGAR</h3>
                        <h1 style={{ color: 'var(--xbox-green)', fontSize: '2.5rem' }}>R$ {totalPrice.toFixed(2).replace('.', ',')}</h1>
                    </div>
                    
                    <button
                        className="btn"
                        style={{ width: '100%', padding: '18px', fontSize: '1.2rem', marginBottom: '15px' }}
                        onClick={handleConfirm}
                        disabled={submitting}
                    >
                        {submitting ? 'Enviando Pedido...' : 'CONFIRMAR PEDIDO'}
                    </button>
                    
                    <button
                        className="btn"
                        style={{ width: '100%', background: 'transparent', border: '1px solid #444', color: '#ccc' }}
                        onClick={() => navigate('/games')}
                        disabled={submitting}
                    >
                        Voltar e Editar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
