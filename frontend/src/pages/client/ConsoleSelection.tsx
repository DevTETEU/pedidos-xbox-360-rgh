
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';

const ConsoleSelection: React.FC = () => {
    const navigate = useNavigate();
    const { consoleInfo, setConsoleInfo } = useOrder();

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConsoleInfo({ ...consoleInfo, modelo: e.target.value });
    };

    const handleUnlockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConsoleInfo({ ...consoleInfo, desbloqueio: e.target.checked });
    };

    return (
        <div className="container fade-in">
            <div className="header">
                <h1>Sobre o Console</h1>
                <p className="subtitle">Precisamos de detalhes sobre o seu console para o desbloqueio.</p>
            </div>
            <div className="card">
                <label>Qual o modelo do seu Xbox 360?</label>
                <select value={consoleInfo.modelo} onChange={handleModelChange}>
                    <option value="Xbox 360 Fat">Xbox 360 Fat (Antigo)</option>
                    <option value="Xbox 360 Slim">Xbox 360 Slim</option>
                    <option value="Xbox 360 Super Slim">Xbox 360 Super Slim</option>
                </select>

                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        checked={consoleInfo.desbloqueio}
                        onChange={handleUnlockChange}
                        id="rgh"
                        style={{ width: 'auto', margin: 0 }}
                    />
                    <label htmlFor="rgh" style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
                        Desejo fazer o desbloqueio RGH (+R$50,00)
                    </label>
                </div>

                {consoleInfo.desbloqueio && (
                    <div style={{ marginTop: '10px', color: 'var(--color-primary)' }}>
                        <strong>🎉 Inclui 5 jogos de brinde!</strong>
                    </div>
                )}

                <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={() => navigate('/client')}>Voltar</button>
                    <button className="btn" style={{ flex: 1 }} onClick={() => navigate('/storage')}>Continuar</button>
                </div>
            </div>
        </div>
    );
};

export default ConsoleSelection;
