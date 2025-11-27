import Link from 'next/link';
import { Construction } from 'lucide-react';

export default function ComingSoon() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
                <Construction className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4 font-[family-name:var(--font-outfit)]">
                Em Breve
            </h1>
            <p className="text-lg text-neutral-600 max-w-md mb-8">
                Estamos trabalhando duro para trazer esta funcionalidade para você. Fique ligado para novidades!
            </p>
            <Link
                href="/"
                className="bg-neutral-900 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/25"
            >
                Voltar para o Início
            </Link>
        </div>
    );
}
