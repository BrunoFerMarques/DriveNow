import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import { AuthProvider } from "@/src/context/AuthProvider";
import Footer from "@/src/components/Footer";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "DriveNow - Aluguel e Compra de Carros",
    description: "A melhor plataforma para alugar e comprar veículos exclusivos.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
            <body className="antialiased bg-white text-neutral-900 selection:bg-blue-500/30">
                <AuthProvider>
                    <Navbar />
                    <main className="pt-16 min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
