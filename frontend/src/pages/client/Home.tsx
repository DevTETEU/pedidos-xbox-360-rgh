import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container fade-in">
            <div className="header" style={{ paddingBottom: '20px' }}>
                <img src="/logo.png" alt="ALM TEC" className="logo fade-in" style={{ width: '120px', height: 'auto', marginBottom: '20px' }} />
                <h1 className="fade-in delay-100" style={{ fontSize: '3.5rem' }}>
                    Desbloqueio <br />
                    <span className="text-gradient" style={{ fontSize: '4.5rem' }}>Xbox 360 RGH</span>
                </h1>
                <p className="subtitle fade-in delay-200" style={{ marginTop: '20px', lineHeight: '1.8' }}>
                    Liberte todo o potencial do seu console. Jogue via HD, controle <br />a temperatura e tenha a interface Aurora configurada.
                </p>
                
                <div className="fade-in delay-300" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                    <button className="btn" onClick={() => navigate('/client')} style={{ fontSize: '1.2rem', padding: '18px 48px' }}>
                        🚀 Iniciar Pedido
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigate('/track')} style={{ fontSize: '1.1rem', padding: '18px 36px' }}>
                        📦 Acompanhar
                    </button>
                </div>
            </div>

            <div className="fade-in delay-400" style={{ marginTop: '40px' }}>
                <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--color-primary)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }}></div>
                    
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '40px', textAlign: 'center' }}>Vantagens do Serviço</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        {[
                            { icon: '🎮', title: 'Jogos do HD', desc: 'Esqueça os CDs arranhados. Rode tudo do Pendrive ou HD Externo.' },
                            { icon: '🎨', title: 'Aurora Dash', desc: 'Interface linda, moderna e com capas automáticas via internet.' },
                            { icon: '❄️', title: 'Refrigeração', desc: 'Ajuste de ventoinhas e troca de pasta térmica inclusos.' },
                            { icon: '🎁', title: '5 Jogos Grátis', desc: 'Ao fazer o RGH conosco, você ganha 5 jogos da sua escolha.' }
                        ].map((item, idx) => (
                            <div key={idx} style={{ 
                                background: 'rgba(255, 255, 255, 0.02)', 
                                padding: '24px', 
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                                <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#fff' }}>{item.title}</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center fade-in delay-400" style={{ marginTop: '60px', padding: '30px 0', borderTop: '1px solid var(--color-border)' }}>
                <p style={{ color: 'var(--color-text-secondary)' }}>&copy; {new Date().getFullYear()} ALM TEC. Qualidade garantida.</p>
                <button className="btn-secondary" style={{ marginTop: '20px', padding: '8px 16px', fontSize: '0.8rem', background: 'transparent', border: 'none', color: '#666' }} onClick={() => navigate('/admin')}>
                    Acesso Restrito
                </button>
            </div>
        </div>
    );
};

export default Home;
