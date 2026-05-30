
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
        <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
            <div className="card" style={{ textAlign: 'center' }}>
                <h1>Admin Login</h1>
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            void handleLogin();
                        }
                    }}
                />
                <button className="btn" onClick={handleLogin} style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
