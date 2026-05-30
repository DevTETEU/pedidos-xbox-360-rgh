import React, { useState } from 'react';

interface TrackedOrder {
    id: number;
    cliente: string;
    status: string;
    data: string;
    total: number;
    modeloXbox: string;
}

const TrackOrder: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<TrackedOrder | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const handleTrack = async () => {
        if (!orderId.trim() || !whatsapp.trim()) {
            setError('Informe o número do pedido e WhatsApp.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const query = new URLSearchParams({
                orderId: orderId.trim(),
                whatsapp: whatsapp.trim()
            }).toString();

            const response = await fetch(`${API_URL}/api/orders/track?${query}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Falha ao consultar pedido.');
            }

            setResult(data);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Falha ao consultar pedido.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in">
            <div className="header">
                <h1>Acompanhar Pedido</h1>
                <p>Consulte seu status com o ID do pedido e seu WhatsApp.</p>
            </div>
            <div className="card">
                <label>Número do Pedido</label>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Ex: 123" />

                <label>WhatsApp</label>
                <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Ex: (11) 99999-9999" />

                <button className="btn" style={{ width: '100%', marginTop: '14px' }} onClick={handleTrack} disabled={loading}>
                    {loading ? 'Consultando...' : 'Consultar Status'}
                </button>

                {error && <p style={{ marginTop: '12px', color: '#e74c3c' }}>{error}</p>}

                {result && (
                    <div style={{ marginTop: '16px', borderTop: '1px solid #333', paddingTop: '12px' }}>
                        <p><strong>Pedido:</strong> #{result.id}</p>
                        <p><strong>Cliente:</strong> {result.cliente}</p>
                        <p><strong>Status:</strong> {result.status}</p>
                        <p><strong>Data:</strong> {new Date(result.data).toLocaleString('pt-BR')}</p>
                        <p><strong>Modelo:</strong> {result.modeloXbox}</p>
                        <p><strong>Total:</strong> R$ {result.total.toFixed(2)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
