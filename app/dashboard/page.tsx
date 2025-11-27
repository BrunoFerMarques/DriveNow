"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/src/context/AuthProvider';
import { useRouter } from 'next/navigation';

interface Transaction {
    id: string;
    type: 'RENT' | 'SALE';
    totalValue: number;
    startDate?: string;
    endDate?: string;
    car: {
        brand: string;
        model: string;
        imageUrl?: string;
    };
    createdAt: string;
}

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchTransactions = () => {
        if (user) {
            fetch('/api/transactions')
                .then(res => res.json())
                .then(data => {
                    setTransactions(data);
                    setLoading(false);
                })
                .catch(err => setLoading(false));
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user]);

    const handleCancel = async (id: string) => {
        if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;

        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Reserva cancelada com sucesso.');
                fetchTransactions(); // Refresh list
            } else {
                const data = await res.json();
                alert(`Erro ao cancelar: ${data.error}`);
            }
        } catch (error) {
            alert('Falha ao cancelar reserva.');
        }
    };

    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-neutral-900">Meus Pedidos</h1>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-neutral-100 rounded-xl" />)}
                </div>
            ) : (
                <div className="space-y-4">
                    {transactions.map(t => {
                        const displayImage = (t.car.imageUrl && t.car.imageUrl.trim() !== '') ? t.car.imageUrl : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';

                        return (
                            <div key={t.id} className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
                                <div className="w-24 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={displayImage} alt={t.car.model} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg text-neutral-900">{t.car.brand} {t.car.model}</h3>
                                    <p className="text-sm text-neutral-500">
                                        {t.type === 'RENT' ? 'Aluguel' : 'Compra'} • {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>

                                <div className="text-right w-full md:w-auto">
                                    <p className="font-bold text-lg text-neutral-900">R$ {t.totalValue.toLocaleString('pt-BR')}</p>
                                    {t.type === 'RENT' && t.startDate && t.endDate && (
                                        <p className="text-xs text-neutral-500 mb-2">
                                            {new Date(t.startDate).toLocaleDateString('pt-BR')} - {new Date(t.endDate).toLocaleDateString('pt-BR')}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => handleCancel(t.id)}
                                        className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline"
                                    >
                                        Cancelar Reserva
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {transactions.length === 0 && (
                        <p className="text-neutral-500">Você ainda não realizou nenhuma transação.</p>
                    )}
                </div>
            )}
        </div>
    );
}
