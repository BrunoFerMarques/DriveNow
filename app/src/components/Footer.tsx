import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-white py-12 border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="text-2xl font-bold tracking-tighter font-[family-name:var(--font-outfit)] mb-4 block">
                            Drive<span className="text-blue-500">Now</span>
                        </Link>
                        <p className="text-neutral-400 text-sm">
                            A plataforma líder em aluguel e venda de veículos premium. Experiência, qualidade e exclusividade.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 text-neutral-200">Navegação</h3>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">Início</Link></li>
                            <li><Link href="/catalog" className="hover:text-blue-400 transition-colors">Catálogo</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contato</Link></li>
                            <li><Link href="/help" className="hover:text-blue-400 transition-colors">Ajuda</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 text-neutral-200">Contato</h3>
                        <ul className="space-y-2 text-sm text-neutral-400">
                            <li>São José dos Campos, SP</li>

                            <li>+55 (12) 981377347</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 text-neutral-200">Redes Sociais</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                                <span>IG</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                                <span>FB</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-blue-600 transition-all">
                                <span>LN</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500 text-sm">
                    &copy; {new Date().getFullYear()} DriveNow. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}
