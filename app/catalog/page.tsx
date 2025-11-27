"use client";

import { useEffect, useState } from 'react';
import CarCard from '@/app/src/components/CarCard';
import { Car } from '@/app/src/models/Car';
import { CarService } from '@/app/src/services/CarService';

export default function Catalog() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            const data = await CarService.getAll();
            setCars(data);
            setLoading(false);
        };

        fetchCars();
    }, []);

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 font-[family-name:var(--font-outfit)]">
                        Nossa Frota
                    </h1>
                    <p className="text-neutral-600 text-lg">
                        Escolha entre nossa coleção exclusiva de veículos para aluguel.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map(car => (
                        <CarCard
                            key={car.id}
                            car={car}
                        />
                    ))}
                    {cars.length === 0 && (
                        <div className="col-span-full text-center py-12 text-neutral-500">
                            Nenhum veículo encontrado.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
