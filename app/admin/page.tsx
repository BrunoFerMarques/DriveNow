"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthProvider';
import { useRouter } from 'next/navigation';

interface Car {
    id: string;
    brand: string;
    model: string;
    year: number;
    type: 'RENT' | 'SALE';
    price: number;
    imageUrl?: string;
    available: boolean;
}

export default function Admin() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [cars, setCars] = useState<Car[]>([]);
    const [loadingCars, setLoadingCars] = useState(true);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        brand: '', model: '', year: 2024, type: 'RENT', price: 0, imageUrl: '', available: true
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const fetchCars = async () => {
        setLoadingCars(true);
        try {
            // Fetch all cars (including unavailable ones ideally, but our public API filters them)
            // For admin, we might want a specific endpoint or just filter client-side if the API returns all.
            // Current /api/cars returns only available ones. 
            // Let's assume we need to modify /api/cars to allow admins to see all, or add a param.
            // For now, let's use the public one and maybe miss hidden cars. 
            // TODO: Update /api/cars to show all for admin.
            const res = await fetch('/api/cars?all=true');
            const data = await res.json();
            setCars(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCars(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchCars();
        }
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            });
            const json = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, imageUrl: json.link }));
            } else {
                alert('Erro no upload: ' + json.error);
            }
        } catch (err) {
            alert('Erro ao enviar imagem');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/api/cars/${editId}` : '/api/cars';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    year: Number(formData.year),
                    price: Number(formData.price)
                })
            });

            if (res.ok) {
                alert(isEditing ? 'Veículo atualizado!' : 'Veículo cadastrado!');
                resetForm();
                fetchCars();
            } else {
                alert('Erro ao salvar');
            }
        } catch (err) {
            alert('Erro ao conectar');
        }
    };

    const handleEdit = (car: Car) => {
        setIsEditing(true);
        setEditId(car.id);
        setFormData({
            brand: car.brand,
            model: car.model,
            year: car.year,
            type: car.type,
            price: car.price,
            imageUrl: car.imageUrl || '',
            available: car.available
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este veículo?')) return;

        try {
            const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCars();
            } else {
                alert('Erro ao excluir');
            }
        } catch (err) {
            alert('Erro ao conectar');
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ brand: '', model: '', year: 2024, type: 'RENT', price: 0, imageUrl: '', available: true });
    };

    if (authLoading || !user || user.role !== 'ADMIN') return null;

    return (
        <div className="min-h-screen p-8 md:p-12 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-neutral-900">Painel Administrativo</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-lg sticky top-24">
                        <h2 className="text-xl font-bold mb-6">{isEditing ? 'Editar Veículo' : 'Novo Veículo'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1">Marca</label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1">Modelo</label>
                                <input
                                    type="text"
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-700 mb-1">Ano</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-700 mb-1">Tipo</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="RENT">Aluguel</option>
                                        <option value="SALE">Venda</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1">Preço</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1">Imagem</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                {uploading && <p className="text-xs text-blue-500">Enviando imagem...</p>}
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-500"
                                    placeholder="URL da imagem"
                                />
                                {formData.imageUrl && (
                                    <img src={formData.imageUrl} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={formData.available}
                                    onChange={e => setFormData({ ...formData, available: e.target.checked })}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="available" className="text-sm text-neutral-700">Disponível / Visível</label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition-all text-sm"
                                >
                                    {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-all text-sm font-medium"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-6">Frota Atual</h2>

                        {loadingCars ? (
                            <div className="animate-pulse space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-neutral-100 rounded-lg" />)}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cars.map(car => (
                                    <div key={car.id} className={`flex items-center gap-4 p-4 rounded-xl border ${car.available ? 'border-neutral-200 bg-white' : 'border-neutral-200 bg-neutral-50 opacity-75'}`}>
                                        <div className="w-20 h-14 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {car.imageUrl && (
                                                <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover" />
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-neutral-900">{car.brand} {car.model}</h3>
                                                {!car.available && <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">Oculto</span>}
                                            </div>
                                            <p className="text-xs text-neutral-500">
                                                {car.year} • {car.type === 'RENT' ? 'Aluguel' : 'Venda'} • R$ {car.price}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(car)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                onClick={() => handleDelete(car.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {cars.length === 0 && <p className="text-neutral-500 text-center py-8">Nenhum veículo cadastrado.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
