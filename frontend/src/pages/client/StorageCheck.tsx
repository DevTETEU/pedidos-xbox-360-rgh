
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';

const StorageCheck: React.FC = () => {
    const navigate = useNavigate();
    const { consoleInfo, setConsoleInfo } = useOrder();

    const handleSelection = (hasStorage: boolean) => {
        setConsoleInfo({ ...consoleInfo, possuiArmazenamento: hasStorage });
        if (!hasStorage) {
            // Just select and show warning, don't auto navigate? Or navigate but show warning there?
            // Prompt says: "Se Não, mostrar alerta: É necessário armazenamento externo..."
        }
    };

    const handleNext = () => {
        navigate('/games');
    };

    return (
        <div className="container fade-in">
            <div className="header">
                <h1>Armazenamento</h1>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
                <h3>Você possui HD Externo ou Pen Drive para instalar os jogos?</h3>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '30px 0' }}>
                    <button
                        className={`btn ${consoleInfo.possuiArmazenamento ? '' : 'btn-secondary'}`}
                        onClick={() => handleSelection(true)}
                        style={{ minWidth: '100px' }}
                    >
                        Sim
                    </button>
                    <button
                        className={`btn ${!consoleInfo.possuiArmazenamento ? '' : 'btn-secondary'}`}
                        onClick={() => handleSelection(false)}
                        style={{ minWidth: '100px' }}
                    >
                        Não
                    </button>
                </div>

                {!consoleInfo.possuiArmazenamento && (
                    <div style={{ backgroundColor: '#e74c3c33', padding: '15px', borderRadius: '8px', border: '1px solid var(--color-danger)', marginBottom: '20px' }}>
                        <h4 style={{ color: 'var(--color-danger)' }}>⚠️ Atenção</h4>
                        <p>É <strong>obrigatório</strong> ter um HD Externo ou Pendrive para que possamos instalar os jogos.</p>
                    </div>
                )}

                <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/console')}>Voltar</button>
                    <button className="btn" style={{ flex: 1 }} onClick={handleNext}>Continuar para Jogos</button>
                </div>
            </div>
        </div>
    );
};

export default StorageCheck;
