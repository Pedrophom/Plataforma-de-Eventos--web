"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MenuCondicional({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === "/login";

  return (
    <>
      {!isAuthPage && (
        <header className="bg-[#00823b] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <Link href="/" className="text-xl font-bold border border-white px-2 py-1"> 
            Painel de Eventos 
          </Link>
  
          <div className="flex items-center gap-6">
            <Link href="/usuarios" className="text-sm font-medium hover:underline"> 
              Usuários 
            </Link>
            <Link href="/novo" className="bg-white text-[#00823b] font-bold px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm"> 
              + Novo Evento 
            </Link>

            {/* Botão de Sair (Client-side, agora num Client Component sem erros!) */}
            <button
              onClick={() => {
                document.cookie = "auth_token=; path=/; max-age=0";
                window.location.href = "/login";
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded transition-colors text-sm"
            >
              Sair
            </button>
          </div>
        </header>
      )}

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </>
  );
}