
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';

const ClientData: React.FC = () => {
    const navigate = useNavigate();
    const { client, setClient } = useOrder();

    const [name, setName] = useState(client.nome || '');
    const [whatsapp, setWhatsapp] = useState(client.whatsapp || '');
    const [observations, setObservations] = useState(client.observacoes || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'nome') {
            setName(value);
        } else if (name === 'observacoes') {
            setObservations(value);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 11) value = value.slice(0, 11); // Limit size

        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 9) {
            value = `${value.slice(0, 10)}-${value.slice(10)}`;
        }

        setWhatsapp(value);
    };

    const handleNext = () => {
        if (!name.trim() || name.length < 3) {
            alert('Por favor, digite um nome válido (mínimo 3 letras).');
            return;
        }
        if (whatsapp.length < 15) {
            alert('Por favor, digite um WhatsApp válido com DDD.');
            return;
        }
        setClient({
            nome: name,
            whatsapp: whatsapp,
            observacoes: observations,
        });
        navigate('/console');
    };

    return (
        <div className="container fade-in">
            <div className="header">
                <h1>Seus Dados</h1>
            </div>
            <div className="card">
                <label>Nome Completo *</label>
                <input
                    type="text"
                    name="nome"
                    value={name}
                    onChange={handleChange}
                    placeholder="Ex: João da Silva"
                />

                <label>WhatsApp (com DDD) *</label>
                <input
                    type="tel"
                    name="whatsapp"
                    value={whatsapp}
                    onChange={handlePhoneChange}
                    placeholder="Ex: 11 99999-9999"
                />

                <label>Observações (Opcional)</label>
                <textarea
                    name="observacoes"
                    value={observations}
                    onChange={handleChange}
                    placeholder="Ex: Quero foco em jogos de futebol e corrida..."
                    rows={3}
                />

                <button className="btn" style={{ width: '100%' }} onClick={handleNext}>
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default ClientData;
