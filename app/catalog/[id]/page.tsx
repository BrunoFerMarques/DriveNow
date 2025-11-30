"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/src/context/AuthProvider';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Car } from '@/app/src/models/Car';
import { CarService } from '@/app/src/services/CarService';

export default function CarDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [pickupLocation, setPickupLocation] = useState('Caçapava - SP');
    const [processing, setProcessing] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

    useEffect(() => {
        const fetchCar = async () => {
            if (!id) return;
            try {
                const carData = await CarService.getById(id as string);
                if (carData) {
                    setCar(carData);
                } else {
                    alert('Carro não encontrado');
                    router.push('/catalog');
                }
            } catch (error) {
                console.error('Falha ao buscar carro', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id, router]);

    const handleRent = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!startDate) {
            alert('Por favor, selecione uma data de início.');
            return;
        }

        if (paymentMethod === 'CREDIT_CARD') {
            if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
                alert('Por favor, preencha os dados do cartão.');
                return;
            }
        }

        setProcessing(true);
        const result = await CarService.rent({
            carId: car?.id as string,
            days: Number(days),
            pickupLocation,
            startDate,
            paymentMethod
        });

        if (result.success) {
            alert('Reserva realizada com sucesso!');
            router.push('/dashboard');
        } else {
            alert(`Erro: ${result.error}`);
        }
        setProcessing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!car) return null;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/catalog" className="inline-flex items-center text-neutral-600 hover:text-blue-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para o Catálogo
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-200">
                    <div className="grid grid-cols-1 ">
                        <div className="h-96 lg:h-auto bg-neutral-100 relative">
                            <img
                                src={car.displayImage}
                                alt={car.displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="p-8 lg:p-12">
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold text-neutral-900 mb-2 font-[family-name:var(--font-outfit)]">
                                    {car.displayName}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                                    <span className="bg-neutral-100 px-3 py-1 rounded-full flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> {car.year}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Preço da Diária</p>
                                <p className="text-4xl font-bold text-blue-600">
                                    R$ {car.formattedPrice}
                                </p>
                            </div>

                            {car.available ? (
                                <div className="space-y-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                                    <h3 className="text-lg font-semibold text-neutral-900">Configurar Reserva</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Data de Início</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Duração (dias)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={days}
                                                onChange={(e) => setDays(Number(e.target.value))}
                                                className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Local de Retirada</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                            <select
                                                value={pickupLocation}
                                                onChange={(e) => setPickupLocation(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                            >
                                                <option value="Caçapava - SP">Caçapava - SP</option>
                                                <option value="São José dos Campos - SP">São José dos Campos - SP</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-200">
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Pagamento</h3>
                                        <div className="flex gap-4 mb-4">
                                            <button
                                                onClick={() => setPaymentMethod('PIX')}
                                                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${paymentMethod === 'PIX' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
                                            >
                                                PIX
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod('CREDIT_CARD')}
                                                className={`flex-1 py-3 rounded-xl border font-medium transition-all ${paymentMethod === 'CREDIT_CARD' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}
                                            >
                                                Cartão de Crédito
                                            </button>
                                        </div>

                                        {paymentMethod === 'PIX' ? (
                                            <div className="bg-neutral-100 p-4 rounded-xl text-center">
                                                <p className="text-sm text-neutral-500 mb-2">Escaneie o QR Code ou use a chave abaixo</p>
                                                <div className="w-32 h-32 bg-white mx-auto mb-2 flex items-center justify-center border border-neutral-200 rounded-lg">
                                                    <span className="text-xs text-neutral-400">QR Code</span>
                                                </div>
                                                <p className="font-mono text-sm bg-white py-2 px-4 rounded border border-neutral-200 inline-block">
                                                    00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Número do Cartão"
                                                    value={cardDetails.number}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Validade (MM/AA)"
                                                        value={cardDetails.expiry}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="CVV"
                                                        value={cardDetails.cvv}
                                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Nome no Cartão"
                                                    value={cardDetails.name}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-neutral-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-neutral-600">Total Estimado</span>
                                            <span className="text-2xl font-bold text-neutral-900">
                                                R$ {((car.price * 0.0005) * days).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleRent}
                                            disabled={processing}
                                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Processando...' : 'Confirmar Pagamento e Reserva'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-100">
                                    Este veículo está indisponível no momento.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
