"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Home, Car, Phone, HelpCircle, User, Shield, Menu, X, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold tracking-tighter font-[family-name:var(--font-outfit)]">
                            Drive<span className="text-blue-600">Now</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="flex items-center gap-2 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                <Home className="w-4 h-4" />
                                Início
                            </Link>
                            <Link href="/catalog" className="flex items-center gap-2 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                <Car className="w-4 h-4" />
                                Catálogo
                            </Link>
                            <Link href="/coming-soon" className="flex items-center gap-2 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                <Phone className="w-4 h-4" />
                                Contato
                            </Link>
                            <Link href="/coming-soon" className="flex items-center gap-2 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                <HelpCircle className="w-4 h-4" />
                                Ajuda
                            </Link>
                            {user && (
                                <Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                    <User className="w-4 h-4" />
                                    Meus Pedidos
                                </Link>
                            )}
                            {user?.role === 'ADMIN' && (
                                <Link href="/admin" className="flex items-center gap-2 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                    <Shield className="w-4 h-4" />
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Auth Buttons Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-neutral-600">Olá, {user.name}</span>
                                <button
                                    onClick={logout}
                                    className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                                >
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors text-sm font-medium">
                                    <LogIn className="w-4 h-4" />
                                    Entrar
                                </Link>
                                <Link href="/register" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                                    <UserPlus className="w-4 h-4" />
                                    Cadastrar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-blue-600 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <Menu className="block h-6 w-6" />
                            ) : (
                                <X className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-neutral-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-50">
                            <Home className="w-4 h-4" /> Início
                        </Link>
                        <Link href="/catalog" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-50">
                            <Car className="w-4 h-4" /> Catálogo
                        </Link>
                        <Link href="/coming-soon" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-50">
                            <Phone className="w-4 h-4" /> Contato
                        </Link>
                        <Link href="/coming-soon" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-50">
                            <HelpCircle className="w-4 h-4" /> Ajuda
                        </Link>
                        {user && (
                            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-50">
                                <User className="w-4 h-4" /> Meus Pedidos
                            </Link>
                        )}
                        {user?.role === 'ADMIN' && (
                            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-blue-600 hover:bg-neutral-50">
                                <Shield className="w-4 h-4" /> Admin
                            </Link>
                        )}

                        <div className="border-t border-neutral-200 pt-4 mt-4">
                            {user ? (
                                <div className="flex items-center justify-between px-3">
                                    <span className="text-sm text-neutral-600">Olá, {user.name}</span>
                                    <button onClick={logout} className="text-red-500 font-medium text-sm">Sair</button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2 px-3">
                                    <Link href="/login" className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200">
                                        <LogIn className="w-4 h-4" /> Entrar
                                    </Link>
                                    <Link href="/register" className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                        <UserPlus className="w-4 h-4" /> Cadastrar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
