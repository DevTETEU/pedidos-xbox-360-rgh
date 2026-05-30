
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAdminToken } from '../../utils/adminAuth';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const redirectPath = (location.state as { from?: string } | null)?.from || '/admin/dashboard';

    const handleLogin = async () => {
        if (!password.trim()) {
            alert('Digite a senha.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                throw new Error('Falha no login');
            }

            const data = await response.json();
            if (!data?.token) {
                throw new Error('Token inválido');
            }

            setAdminToken(data.token);
            navigate(redirectPath, { replace: true });
        } catch (error) {
            console.error(error);
            alert('Senha incorreta ou servidor indisponível.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', padding: '40px 30px' }}>
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem' }}>Acesso <span className="accent-text">Restrito</span></h1>
                    <p style={{ color: '#888', marginTop: '10px' }}>Painel Administrativo ALM TEC</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="password"
                        placeholder="Digite sua senha de acesso"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                void handleLogin();
                            }
                        }}
                        style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '1.2rem' }}
                    />
                    <button className="btn" onClick={handleLogin} style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Verificando...' : 'Entrar no Painel'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
