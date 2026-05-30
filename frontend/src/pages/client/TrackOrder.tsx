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
        <div className="container fade-in" style={{ maxWidth: '600px', marginTop: '60px' }}>
            <div className="header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1><span className="accent-text">Acompanhar</span> Pedido</h1>
                <p>Consulte seu status com o ID do pedido e seu WhatsApp.</p>
            </div>
            
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Número do Pedido</label>
                    <input 
                        value={orderId} 
                        onChange={(e) => setOrderId(e.target.value)} 
                        placeholder="Ex: 123" 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>WhatsApp (apenas números ou formatado)</label>
                    <input 
                        value={whatsapp} 
                        onChange={(e) => setWhatsapp(e.target.value)} 
                        placeholder="Ex: (11) 99999-9999" 
                    />
                </div>

                <button 
                    className="btn" 
                    style={{ width: '100%', marginTop: '10px' }} 
                    onClick={handleTrack} 
                    disabled={loading}
                >
                    {loading ? 'Consultando...' : 'Consultar Status'}
                </button>

                {error && <p style={{ marginTop: '12px', color: '#ff4d4d', textAlign: 'center', fontWeight: '500' }}>{error}</p>}
            </div>

            {result && (
                <div className="card fade-in" style={{ marginTop: '30px', borderTop: '4px solid var(--xbox-green)' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--xbox-green)' }}>Status Atualizado</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Pedido ID</span>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>#{result.id}</p>
                        </div>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Status</span>
                            <p style={{ 
                                fontSize: '1.1rem', 
                                fontWeight: 'bold', 
                                color: result.status === 'Concluído' ? 'var(--xbox-green)' : 
                                       result.status === 'Em andamento' ? '#f39c12' : '#3498db'
                            }}>
                                {result.status}
                            </p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Cliente</span>
                            <p style={{ fontSize: '1.1rem' }}>{result.cliente}</p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Modelo</span>
                            <p style={{ fontSize: '1.1rem' }}>{result.modeloXbox}</p>
                        </div>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Data</span>
                            <p>{new Date(result.data).toLocaleDateString('pt-BR')} às {new Date(result.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div>
                            <span style={{ color: '#888', fontSize: '0.9rem' }}>Total</span>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--xbox-green)' }}>
                                R$ {result.total.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackOrder;
