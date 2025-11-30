"use client"
import Link from 'next/link';
import CarCard from '@/app/src/components/CarCard';
import { CarService } from './src/services/CarService';
import { useEffect, useState } from 'react';
import { Car } from './src/models/Car';


function PopularCarsSection() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            const data = await CarService.getAllByPopularity();
            setCars(            data.slice(0, 3));
            setLoading(false);
        };

        fetchCars();
    }, []);


    return (
        <section className="py-24 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-neutral-900">Mais Populares</h2>
                    <p className="text-neutral-600">Os veículos mais desejados pelos nossos clientes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cars.map((car: any) => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/catalog" className="text-blue-600 font-bold hover:underline">
                        Ver todos os veículos &rarr;
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2800&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white font-[family-name:var(--font-outfit)] drop-shadow-lg">
                        Dirija o Extraordinário.
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-200 mb-10 font-light drop-shadow-md">
                        Alugue ou compre os veículos mais exclusivos do mundo com apenas alguns cliques.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/catalog"
                            className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
                        >
                            Ver Frota
                        </Link>
                        <Link href="/register" className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                            Criar Conta
                        </Link>
                    </div>
                </div>
            </section>

            <PopularCarsSection />


        </div>
    );
}
