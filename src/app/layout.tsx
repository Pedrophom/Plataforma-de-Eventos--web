import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Plataforma de Eventos",
  description: "Sistema de Gestão de Eventos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-gray-100 text-black">
        
        {/* Cabeçalho Verde IFMA */}
        <header className="bg-[#00823b] text-white shadow-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Painel de Eventos
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/" className="hover:text-gray-200 font-medium">
                Dashboard
              </Link>
              <Link 
                href="/novo" 
                className="bg-white text-[#00823b] hover:bg-gray-100 font-bold px-4 py-2 rounded-md transition-colors"
              >
                + Novo Evento
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}