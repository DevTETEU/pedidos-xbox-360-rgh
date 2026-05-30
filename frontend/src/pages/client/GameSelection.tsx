import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';

interface Game {
    id: number;
    nome: string;
    categoria: string;
}

const GameSelection: React.FC = () => {
    const navigate = useNavigate();
    const {
        selectedGames, toggleGame,
        paidGamesCount, totalPrice,
        consoleInfo
    } = useOrder();

    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Todas');

    // Categories derived from data or static
    const CATEGORIES = ['Todas', 'Ação', 'Aventura', 'Corrida', 'Esporte', 'RPG', 'Tiro (FPS)', 'Infantil'];

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        fetch(`${API_URL}/api/games`)
            .then(res => res.json())
            .then(data => {
                setGames(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching games:', err);
                setLoading(false);
            });
    }, [API_URL]);

    const filteredGames = useMemo(() => {
        return games.filter(game => {
            const matchesSearch = game.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'Todas' || game.categoria === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [games, searchTerm, activeCategory]);

    if (loading) return <div className="container center"><h2>Carregando catálogo de jogos...</h2></div>;

    return (
        <div className="container fade-in">
            <div className="header">
                <h1>Seleção de Jogos</h1>
                <p>Escolha seus jogos favoritos. {consoleInfo.desbloqueio ? 'Os primeiros 5 são grátis!' : 'Apenas R$4,00 cada.'}</p>
            </div>

            {/* Sticky Stats Bar */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 100,
                backgroundColor: 'var(--color-surface)',
                padding: '15px 20px',
                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                marginBottom: '20px',
                border: '1px solid var(--color-border)',
                borderTop: 'none'
            }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                        <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Selecionados:</span>
                        <strong style={{ fontSize: '1.2rem', marginLeft: '5px' }}>{selectedGames.length}</strong>
                    </div>
                    {consoleInfo.desbloqueio && (
                        <div>
                            <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>Grátis (Restantes):</span>
                            <strong style={{ fontSize: '1.2rem', marginLeft: '5px' }}>{Math.max(0, 5 - selectedGames.length)}</strong>
                        </div>
                    )}
                    <div>
                        <span style={{ color: '#e74c3c', fontSize: '0.9rem' }}>Pagos:</span>
                        <strong style={{ fontSize: '1.2rem', marginLeft: '5px' }}>{paidGamesCount}</strong>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Total Estimado:</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        R$ {totalPrice.toFixed(2)}
                    </div>
                </div>
                <button className="btn" onClick={() => navigate('/summary')} style={{ padding: '8px 20px' }}>
                    Concluir
                </button>
            </div>

            <div className="card">
                {/* Search & Filter */}
                <input
                    type="text"
                    placeholder="🔍 Buscar jogo..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '15px' }}
                />

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`btn ${activeCategory === cat ? '' : 'btn-secondary'} `}
                            onClick={() => setActiveCategory(cat)}
                            style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', padding: '8px 16px' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Game Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {filteredGames.map(game => {
                    const isSelected = !!selectedGames.find(g => g.id === game.id);
                    return (
                        <div
                            key={game.id}
                            className="card"
                            onClick={() => toggleGame(game)}
                            style={{
                                cursor: 'pointer',
                                border: isSelected ? '2px solid var(--color-primary)' : '2px solid transparent',
                                backgroundColor: isSelected ? 'rgba(16, 124, 16, 0.1)' : 'var(--color-surface)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '15px'
                            }}
                        >
                            <div style={{ flex: 1, paddingRight: '10px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{game.nome}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{game.categoria}</div>
                            </div>
                            <div style={{
                                width: '24px', height: '24px',
                                borderRadius: '50%',
                                border: '2px solid ' + (isSelected ? 'var(--color-primary)' : '#555'),
                                backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 'bold'
                            }}>
                                {isSelected && '✓'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredGames.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    Nenhum jogo encontrado.
                </div>
            )}
        </div>
    );
};

export default GameSelection;
