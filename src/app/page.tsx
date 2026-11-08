"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Evento {
  id: string;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  imagem: string | null;
}

export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha ao comunicar com o servidor. Verifique o banco de dados.");
        }
        return res.json();
      })
      .then((data) => {
        // Proteção essencial: garante que os dados são um Array antes de guardar
        if (Array.isArray(data)) {
          setEventos(data);
        } else {
          console.error("A API não retornou uma lista válida:", data);
          setEventos([]);
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        setErroApi("Não foi possível carregar os eventos. Verifique se o arquivo .env está configurado corretamente com a URL do Supabase.");
        setEventos([]); // Garante que a variável continua a ser um Array vazio
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const deletarEvento = async (id: string) => {
    setEventos((eventosAtuais) => eventosAtuais.filter((evento) => evento.id !== id));
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Falha ao deletar no servidor", error);
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 font-medium animate-pulse">Carregando eventos institucionais...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 pb-5 border-b border-gray-300 flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 bg-[#00823b] rounded-full"></div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Eventos Acadêmicos
            </h1>
            <p className="text-sm mt-1">
              Gerencie os minicursos, palestras e atividades do campus.
            </p>
          </div>
        </div>
      </div>

      {/* Exibe o erro na tela sem "quebrar" a aplicação se a API falhar */}
      {erroApi ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-8 text-center shadow-sm">
          <p className="font-medium text-lg mb-2">Ops! Ocorreu um problema.</p>
          <p className="text-sm">{erroApi}</p>
        </div>
      ) : !Array.isArray(eventos) || eventos.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-lg mb-4">Nenhum evento cadastrado no momento.</p>
          <Link 
            href="/novo" 
            className="inline-block bg-[#00823b] text-white font-medium px-6 py-2.5 rounded-lg hover:bg-[#006a30] transition-colors"
          >
            Cadastrar Primeiro Evento
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {eventos.map((evento) => (
            <div 
              key={evento.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col w-full sm:w-[380px] overflow-hidden"
            >
              
              <div className="p-6 flex items-start gap-4 justify-between flex-grow">
                <div className="flex-1 pr-2">
                  <span className="inline-block bg-green-50 text-[#00823b] text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                    Ativo
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 break-words leading-snug">{evento.titulo}</h2>
                  <p className="text-gray-600 text-sm mb-1 flex items-center gap-1.5">
                    <span>📅</span> {evento.data} às {evento.horario}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-1.5 truncate">
                    <span>📍</span> {evento.local}
                  </p>
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden shadow-inner">
                  {evento.imagem ? (
                    <img 
                      src={evento.imagem} 
                      alt={evento.titulo} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2 font-medium">
                      Sem foto
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3.5 flex justify-between items-center border-t border-gray-100">
                <Link 
                  href={`/evento/${evento.id}`} 
                  className="text-[#00823b] hover:text-[#006a30] font-semibold text-sm transition-colors"
                >
                  Ver detalhes
                </Link>
                <button 
                  onClick={() => deletarEvento(evento.id)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md"
                >
                  Excluir
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}