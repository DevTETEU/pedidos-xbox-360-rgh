import React, { useMemo, useState } from 'react';

const STORAGE_OPTIONS = [
    { label: '16 GB', value: 16 },
    { label: '32 GB', value: 32 },
    { label: '64 GB', value: 64 },
    { label: '120 GB', value: 120 },
    { label: '250 GB', value: 250 },
    { label: '500 GB', value: 500 },
    { label: '1 TB', value: 1000 }
];

const FAQ_ITEMS = [
    {
        question: 'Quanto tempo leva o desbloqueio RGH?',
        answer: 'Geralmente entre 1 e 3 dias uteis, dependendo da fila e do modelo do console.'
    },
    {
        question: 'Precisa de internet para jogar?',
        answer: 'Nao. Jogos instalados no armazenamento podem rodar offline normalmente.'
    },
    {
        question: 'Posso usar HD externo e pen drive?',
        answer: 'Sim. HD externo costuma ser melhor para bibliotecas grandes; pen drive serve para uso leve.'
    },
    {
        question: 'Tem risco de perda de dados?',
        answer: 'O ideal e fazer backup dos saves antes do servico de desbloqueio e instalacao de jogos.'
    }
];

const XboxTools: React.FC = () => {
    const [storageGb, setStorageGb] = useState(120);
    const [avgGameSizeGb, setAvgGameSizeGb] = useState(8);
    const [useFat32, setUseFat32] = useState(true);

    const [checklist, setChecklist] = useState({
        backup: false,
        energia: false,
        controleTestado: false,
        hdOuPendrive: false
    });

    const estimatedGames = useMemo(() => {
        const usableStorage = storageGb * (useFat32 ? 0.9 : 0.93);
        if (avgGameSizeGb <= 0) return 0;
        return Math.max(0, Math.floor(usableStorage / avgGameSizeGb));
    }, [avgGameSizeGb, storageGb, useFat32]);

    const checklistScore = useMemo(
        () => Object.values(checklist).filter(Boolean).length,
        [checklist]
    );

    return (
        <div className="container fade-in">
            <div className="header">
                <h1>Ferramentas Xbox 360</h1>
                <p className="subtitle">Recursos úteis para planejar desbloqueio, jogos e entrega.</p>
            </div>

            <div className="card">
                <h3>Calculadora de Armazenamento</h3>
                <p style={{ marginBottom: '12px', color: '#aaa' }}>
                    Estimativa de quantos jogos cabem no seu armazenamento.
                </p>

                <label>Capacidade de armazenamento</label>
                <select
                    value={storageGb}
                    onChange={(e) => setStorageGb(Number(e.target.value))}
                >
                    {STORAGE_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <label>Tamanho medio por jogo (GB)</label>
                <input
                    type="number"
                    min={1}
                    max={20}
                    value={avgGameSizeGb}
                    onChange={(e) => setAvgGameSizeGb(Number(e.target.value))}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <input
                        type="checkbox"
                        checked={useFat32}
                        onChange={(e) => setUseFat32(e.target.checked)}
                        style={{ width: 'auto', marginBottom: 0 }}
                        id="fat32"
                    />
                    <label htmlFor="fat32" style={{ marginBottom: 0 }}>Considerar formatacao FAT32</label>
                </div>

                <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '12px' }}>
                    <p><strong>Estimativa:</strong> {estimatedGames} jogos</p>
                    <p style={{ fontSize: '0.9rem', color: '#aaa' }}>
                        Valor aproximado. Alguns jogos ocupam muito mais espaco que a media.
                    </p>
                </div>
            </div>

            <div className="card">
                <h3>Checklist Pre-Servico</h3>
                <p style={{ marginBottom: '12px', color: '#aaa' }}>Evite atrasos na entrega com estes itens.</p>

                {[
                    ['backup', 'Backup dos saves importantes'],
                    ['energia', 'Cabo de energia em boas condicoes'],
                    ['controleTestado', 'Controle testado e funcionando'],
                    ['hdOuPendrive', 'HD externo/Pendrive disponivel']
                ].map(([key, label]) => (
                    <label key={key} style={{ display: 'block', marginBottom: '8px' }}>
                        <input
                            type="checkbox"
                            checked={checklist[key as keyof typeof checklist]}
                            onChange={(e) => setChecklist((prev) => ({ ...prev, [key]: e.target.checked }))}
                            style={{ width: 'auto', marginRight: '8px' }}
                        />
                        {label}
                    </label>
                ))}

                <div style={{ marginTop: '12px', color: checklistScore === 4 ? '#2ecc71' : '#f39c12' }}>
                    <strong>Progresso:</strong> {checklistScore}/4 itens concluidos
                </div>
            </div>

            <div className="card">
                <h3>FAQ Rapido</h3>
                {FAQ_ITEMS.map((item) => (
                    <details key={item.question} style={{ marginBottom: '10px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{item.question}</summary>
                        <p style={{ marginTop: '8px', color: '#ccc' }}>{item.answer}</p>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default XboxTools;
