"use client";

import Link from 'next/link';

interface CarCardProps {
    id: string;
    brand: string;
    model: string;
    year: number;
    imageUrl?: string;
    type: 'RENT' | 'SALE';
    price: number;
    available: boolean;
}

export default function CarCard({ id, brand, model, year, imageUrl, type, price, available }: CarCardProps) {
    const displayImage = (imageUrl && imageUrl.trim() !== '') ? imageUrl : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000';

    return (
        <Link href={`/catalog/${id}`} className="block group relative bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
            {/* Image */}
            <div className="h-48 bg-neutral-100 w-full flex items-center justify-center relative overflow-hidden">
                <img
                    src={displayImage}
                    alt={`${brand} ${model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-600">
                        Aluguel
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{brand} {model}</h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 text-xs text-neutral-500">
                    <span className="bg-neutral-100 px-2 py-1 rounded">{year}</span>
                    <span className={`px-2 py-1 rounded ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {available ? 'Disponível' : 'Indisponível'}
                    </span>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wide">Diária</p>
                        <p className="text-2xl font-bold text-neutral-900">
                            R$ {(price * 0.0005).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-neutral-900 text-white p-2 rounded-full group-hover:bg-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}

