
import React, { createContext, useContext, useMemo, useState } from 'react';

interface Game {
    id: number;
    nome: string;
    categoria: string;
}

interface ClientData {
    nome: string;
    whatsapp: string;
    observacoes: string;
}

interface ConsoleData {
    modelo: string;
    desbloqueio: boolean;
    possuiArmazenamento: boolean;
}

interface OrderContextType {
    client: ClientData;
    setClient: React.Dispatch<React.SetStateAction<ClientData>>;
    consoleInfo: ConsoleData;
    setConsoleInfo: React.Dispatch<React.SetStateAction<ConsoleData>>;
    selectedGames: Game[];
    addGame: (game: Game) => void;
    removeGame: (gameNome: string) => void;
    toggleGame: (game: Game) => void;
    totalPrice: number;
    freeGamesCount: number;
    paidGamesCount: number;
    resetOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [client, setClient] = useState<ClientData>({ nome: '', whatsapp: '', observacoes: '' });
    const [consoleInfo, setConsoleInfo] = useState<ConsoleData>({
        modelo: 'Xbox 360 Slim',
        desbloqueio: true,
        possuiArmazenamento: false
    });
    const [selectedGames, setSelectedGames] = useState<Game[]>([]);
    const freeGamesCount = useMemo(
        () => (consoleInfo.desbloqueio ? Math.min(selectedGames.length, 5) : 0),
        [consoleInfo.desbloqueio, selectedGames.length]
    );
    const paidGamesCount = useMemo(
        () => Math.max(0, selectedGames.length - freeGamesCount),
        [freeGamesCount, selectedGames.length]
    );
    const totalPrice = useMemo(() => {
        const rghPrice = consoleInfo.desbloqueio ? 50 : 0;
        return rghPrice + (paidGamesCount * 5);
    }, [consoleInfo.desbloqueio, paidGamesCount]);

    const addGame = (game: Game) => {
        setSelectedGames((current) => {
            if (current.some((g) => g.nome === game.nome)) return current;
            return [...current, game];
        });
    };

    const removeGame = (gameNome: string) => {
        setSelectedGames((current) => current.filter((g) => g.nome !== gameNome));
    };

    const toggleGame = (game: Game) => {
        if (selectedGames.find(g => g.nome === game.nome)) {
            removeGame(game.nome);
        } else {
            addGame(game);
        }
    };

    const resetOrder = () => {
        setClient({ nome: '', whatsapp: '', observacoes: '' });
        setConsoleInfo({ modelo: 'Xbox 360 Slim', desbloqueio: true, possuiArmazenamento: false });
        setSelectedGames([]);
    };

    return (
        <OrderContext.Provider value={{
            client, setClient,
            consoleInfo, setConsoleInfo,
            selectedGames, addGame, removeGame, toggleGame,
            totalPrice, freeGamesCount, paidGamesCount,
            resetOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrder = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
