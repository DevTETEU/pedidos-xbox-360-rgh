
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container fade-in">
            <div className="header">
                <img src="/logo.png" alt="ALM TEC - Pedidos Xbox 360 RGH" className="logo fade-in" />
                <h1 className="fade-in delay-100">Desbloqueio <span className="text-gradient">Xbox 360 RGH</span></h1>
                <p className="subtitle fade-in delay-200">
                    Liberte todo o potencial do seu Xbox 360. <br />
                    Acesso total aos seus jogos, menus personalizados e muito mais.
                </p>
            </div>

            <div className="card text-center fade-in delay-300" style={{ padding: '50px' }}>
                <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>
                    Transforme seu Console
                </h2>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginBottom: '40px' }}>
                    <div style={{ background: 'rgba(16, 124, 16, 0.1)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(16, 124, 16, 0.3)' }}>
                        🎮 Jogue do HD/Pendrive
                    </div>
                    <div style={{ background: 'rgba(16, 124, 16, 0.1)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(16, 124, 16, 0.3)' }}>
                        🎨 Interface Aurora
                    </div>
                    <div style={{ background: 'rgba(16, 124, 16, 0.1)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(16, 124, 16, 0.3)' }}>
                        ⚡ Controle de Temperatura
                    </div>
                    <div style={{ background: 'rgba(255, 193, 7, 0.1)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255, 193, 7, 0.3)', color: '#ffc107', fontWeight: 'bold' }}>
                        🎁 5 Jogos Brinde!
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                    <button
                        className="btn"
                        style={{ fontSize: '1.25rem', padding: '16px 40px', minWidth: '250px' }}
                        onClick={() => navigate('/client')}
                    >
                        🚀 Fazer Pedido Agora
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/track')}
                    >
                        📦 Acompanhar Pedido
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/xbox-tools')}
                    >
                        🛠️ Ferramentas
                    </button>
                </div>
            </div>

            {/* Galeria / Feedbacks Section */}
            <div style={{ marginTop: '60px' }} className="fade-in delay-300">
                <div className="text-center">
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Por Que Escolher a <span className="text-gradient">ALM TEC</span>?</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px' }}>Serviço de qualidade comprovada por centenas de clientes.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div className="card">
                        <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🛡️</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Segurança Garantida</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Procedimentos feitos com solda de precisão e higienização completa da placa e troca de pasta térmica.</p>
                    </div>
                    
                    <div className="card">
                        <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⚡</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Pronto para Jogar</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Console já sai configurado com Aurora, DashLaunch e Freestyle. É só ligar e aproveitar.</p>
                    </div>
                    
                    <div className="card">
                        <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🤝</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Suporte Especializado</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Tiramos todas suas dúvidas pós-desbloqueio e ajudamos na instalação dos primeiros jogos.</p>
                    </div>
                </div>
            </div>
            
            <div className="text-center" style={{ marginTop: '40px', padding: '20px 0', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                <p>&copy; {new Date().getFullYear()} ALM TEC. Todos os direitos reservados.</p>
                <div style={{ marginTop: '10px' }}>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'none', cursor: 'pointer', background: 'none', color: 'inherit' }} onClick={() => navigate('/admin')}>
                        Acesso Administrativo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
