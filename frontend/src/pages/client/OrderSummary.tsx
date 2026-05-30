
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

    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = () => {
        setSubmitting(true);

        // Prepare items with free/paid flag
        // Logic: First 5 (or logic in context) are free. 
        // Wait, context has count but not individual mapping.
        // I need to map the games to "free" or "paid" for the backend.

        let freeQuota = consoleInfo.desbloqueio ? 5 : 0;
        const items = selectedGames.map((game) => {
            const isFree = freeQuota > 0;
            if (isFree) freeQuota--;
            return {
                jogoId: game.id,
                gratuito: isFree
            };
        });

        const payload = {
            cliente: client.nome,
            whatsapp: client.whatsapp,
            observacoes: client.observacoes,
            modeloXbox: consoleInfo.modelo,
            desbloqueio: consoleInfo.desbloqueio,
            possuiArmazenamento: consoleInfo.possuiArmazenamento,
            total: totalPrice,
            itens: items
        };

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error('Falha ao enviar');
                return res.json();
            })
            .then(data => {
                alert(`Pedido #${data.id} enviado com sucesso! Entraremos em contato.`);
                resetOrder();
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                alert('Erro ao enviar pedido. Tente novamente.');
                setSubmitting(false);
            });
    };

    return (
        <div className="container fade-in">
            <div className="header">
                <h1>Resumo do Pedido</h1>
            </div>

            <div className="card">
                <h3>👤 Dados do Cliente</h3>
                <p><strong>Nome:</strong> {client.nome}</p>
                <p><strong>WhatsApp:</strong> {client.whatsapp}</p>
                {client.observacoes && <p><strong>Obs:</strong> {client.observacoes}</p>}
            </div>

            <div className="card">
                <h3>🎮 Informações do Console</h3>
                <p><strong>Modelo:</strong> {consoleInfo.modelo}</p>
                <p><strong>Serviço RGH:</strong> {consoleInfo.desbloqueio ? 'Sim (+R$50,00)' : 'Não'}</p>
                <p><strong>Armazenamento Externo:</strong> {consoleInfo.possuiArmazenamento ? 'Possui' : 'Não Possui'}</p>
            </div>

            <div className="card">
                <h3>🕹️ Jogos Selecionados ({selectedGames.length})</h3>
                <p><small>Jogos Grátis: {freeGamesCount} | Jogos Pagos: {paidGamesCount}</small></p>

                <ul style={{ maxHeight: '200px', overflowY: 'auto', margin: '10px 0', paddingLeft: '20px' }}>
                    {selectedGames.map(g => (
                        <li key={g.id}>{g.nome} <span style={{ color: '#888', fontSize: '0.8rem' }}>({g.categoria})</span></li>
                    ))}
                </ul>
            </div>

            <div className="card" style={{ border: '2px solid var(--color-primary)', backgroundColor: 'rgba(16, 124, 16, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>TOTAL A PAGAR</h3>
                    <h1 style={{ color: 'var(--color-primary)' }}>R$ {totalPrice.toFixed(2)}</h1>
                </div>
                <button
                    className="btn"
                    style={{ width: '100%', marginTop: '20px', fontSize: '1.2rem' }}
                    onClick={handleConfirm}
                    disabled={submitting}
                >
                    {submitting ? 'Enviando...' : 'CONFIRMAR PEDIDO ✅'}
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ width: '100%', marginTop: '10px' }}
                    onClick={() => navigate('/games')}
                    disabled={submitting}
                >
                    Voltar e Editar
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
