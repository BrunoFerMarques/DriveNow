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

interface Visit {
  id: string;
  date: string;
  car: {
    brand: string;
    model: string;
    imageUrl?: string;
  };
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingVisits, setLoadingVisits] = useState(true);
  const router = useRouter();

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  // Buscar transações
  const fetchTransactions = () => {
    if (user) {
      fetch('/api/transactions')
        .then(res => res.json())
        .then(data => {
          setTransactions(data);
          setLoadingTransactions(false);
        })
        .catch(() => setLoadingTransactions(false));
    }
  };

  // Buscar visitas
  const fetchVisits = () => {
    if (user) {
      fetch('/api/visits')
        .then(res => res.json())
        .then(data => {
          setVisits(data);
          setLoadingVisits(false);
        })
        .catch(() => setLoadingVisits(false));
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchVisits();
  }, [user]);

  // Cancelar transação
  const handleCancel = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Reserva cancelada com sucesso.');
        fetchTransactions();
      } else {
        const data = await res.json();
        alert(`Erro ao cancelar: ${data.error}`);
      }
    } catch {
      alert('Falha ao cancelar reserva.');
    }
  };


 const handleDeleteVisit = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta visita?')) return;

    try {
      const res = await fetch(`/api/visits/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Visita excluída com sucesso!');
        setVisits(prev => prev.filter(v => v.id !== id));
      } else {
        const data = await res.json();
        alert(`Erro: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Falha ao excluir visita.');
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
      {/* ------------------ TRANSACTIONS ------------------ */}
      <h1 className="text-3xl font-bold mb-8 text-neutral-900">Meus Pedidos</h1>

      {loadingTransactions ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-neutral-100 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(t => {
            const displayImage = t.car.imageUrl?.trim() !== '' 
              ? t.car.imageUrl 
              : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';
            
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
                  {t.type === 'RENT' && (
                    <button
                      onClick={() => handleCancel(t.id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {transactions.length === 0 && (
            <p className="text-neutral-500">Você ainda não realizou nenhuma transação.</p>
          )}
        </div>
      )}

      {/* ------------------ VISITS ------------------ */}
      <h1 className="text-3xl font-bold mt-12 mb-8 text-neutral-900">Minhas Visitas</h1>

      {loadingVisits ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-neutral-100 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map(v => {
            const displayImage = v.car.imageUrl?.trim() !== '' 
              ? v.car.imageUrl 
              : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';
            
            return (
              <div key={v.id} className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm">
                <div className="w-24 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={displayImage} alt={v.car.model} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-neutral-900">{v.car.brand} {v.car.model}</h3>
                  <p className="text-sm text-neutral-500">
                    {new Date(v.date).toLocaleDateString('pt-BR')} • {new Date(v.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <button onClick={() => handleDeleteVisit(v.id)} className="ml-auto mt-2 md:mt-0 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all" > Excluir </button>
                </div>
              </div>
            );
          })}

          {visits.length === 0 && (
            <p className="text-neutral-500">Você ainda não agendou nenhuma visita.</p>
          )}
        </div>
      )}
    </div>
  );
}
