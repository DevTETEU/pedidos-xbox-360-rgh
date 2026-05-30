
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container fade-in">
            <div className="header">
                <h1>Desbloqueio Xbox 360 RGH</h1>
                <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
                    Liberte todo o potencial do seu Xbox 360.
                </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '20px' }}>
                    Transforme seu Console
                </h2>
                <ul style={{ listStyle: 'none', textAlign: 'left', display: 'inline-block', marginBottom: '30px' }}>
                    <li style={{ marginBottom: '10px' }}>✅ Jogue diretamente do HD</li>
                    <li style={{ marginBottom: '10px' }}>✅ Interface amigável</li>
                    <li style={{ marginBottom: '10px' }}>✅ Controle total sobre o console</li>
                    <li style={{ marginBottom: '10px' }}>✅ <strong>5 Jogos de Brinde inclusos!</strong></li>
                </ul>

                <br />
                <button
                    className="btn"
                    style={{ fontSize: '1.5rem', padding: '15px 40px' }}
                    onClick={() => navigate('/client')}
                >
                    Fazer Pedido Agora
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ marginLeft: '10px', fontSize: '1.1rem', padding: '12px 28px' }}
                    onClick={() => navigate('/track')}
                >
                    Acompanhar Pedido
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ marginLeft: '10px', fontSize: '1.1rem', padding: '12px 28px' }}
                    onClick={() => navigate('/xbox-tools')}
                >
                    Ferramentas Xbox 360
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ marginLeft: '10px', fontSize: '1.1rem', padding: '12px 28px' }}
                    onClick={() => navigate('/admin')}
                >
                    Login
                </button>
            </div>

            {/* Galeria / Feedbacks Section */}
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#fff', marginBottom: '20px' }}>Nossos Trabalhos</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div className="card">
                        <div style={{ height: '150px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            [Foto do Console 1]
                        </div>
                        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>"Serviço top! Console ficou novo." - João</p>
                    </div>
                    <div className="card">
                        <div style={{ height: '150px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            [Foto do Menu Aurora]
                        </div>
                        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>"Interface muito rápida. Recomendo!" - Maria</p>
                    </div>
                    <div className="card">
                        <div style={{ height: '150px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            [Foto da Biblioteca de Jogos]
                        </div>
                        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>"Instalação rápida e muitos jogos funcionando." - Pedro</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
