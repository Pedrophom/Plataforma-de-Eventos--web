"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  local: string;
  imagem: string | null;
}

function DetalhesEventoConteudo() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [evento, setEvento] = useState<Evento | null>(null);
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [formulario, setFormulario] = useState({
    titulo: "", descricao: "", data: "", horario: "", local: "", imagem: "",
  });

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/events/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvento(data);
        setFormulario({
          titulo: data.titulo || "", 
          descricao: data.descricao || "", 
          data: data.data || "",
          horario: data.horario || "", 
          local: data.local || "", 
          imagem: data.imagem || "",
        });
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar evento", err);
        setCarregando(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      if (res.ok) {
        setEvento({ ...evento, ...formulario } as Evento);
        setEditando(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao atualizar evento", error);
    }
  };

  if (carregando) return <p className="text-center mt-12 text-black font-medium">A carregar detalhes do evento...</p>;
  if (!evento) return <p className="text-center mt-12 text-black font-medium">Evento não encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-sm border border-gray-200 mt-10 text-black">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-black tracking-tight">
          {editando ? "Editar Evento" : "Detalhes do Evento"}
        </h1>
        {/* Link alterado para preto */}
        <Link href="/" className="text-sm font-bold text-black hover:underline transition-colors">
          Voltar ao Dashboard
        </Link>
      </div>

      {!editando ? (
        <div className="space-y-6">
          <div>
            <span className="text-sm font-bold text-black">Título:</span>
            <p className="text-base text-black break-words mt-1">{evento.titulo}</p>
          </div>
          
          <div>
            <span className="text-sm font-bold text-black">Descrição:</span>
            <p className="mt-1 text-black text-base whitespace-pre-wrap break-words">{evento.descricao}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-bold text-black">Data:</span>
              <p className="text-black text-base mt-1">{evento.data}</p>
            </div>
            <div>
              <span className="text-sm font-bold text-black">Horário:</span>
              <p className="text-black text-base mt-1">{evento.horario}</p>
            </div>
          </div>

          <div>
            <span className="text-sm font-bold text-black">Local:</span>
            <p className="text-black text-base mt-1 break-words">{evento.local}</p>
          </div>
          
          {evento.imagem && (
            <div>
              <span className="text-sm font-bold text-black block mb-2">Imagem:</span>
              <img 
                src={evento.imagem} 
                alt={evento.titulo} 
                className="w-full h-auto max-h-72 rounded-lg object-cover border border-gray-200" 
              />
            </div>
          )}
          
          {/* Botão alterado para verde IFMA */}
          <button 
            onClick={() => setEditando(true)}
            className="w-full bg-[#00823b] hover:bg-[#006a30] text-white font-bold py-3.5 rounded-lg transition-colors mt-4"
          >
            Editar Evento
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-black text-sm font-bold mb-2">Título</label>
            <input type="text" name="titulo" value={formulario.titulo} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#00823b]" />
          </div>
          
          <div>
            <label className="block text-black text-sm font-bold mb-2">Descrição</label>
            <textarea name="descricao" value={formulario.descricao} onChange={handleChange} required rows={4} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#00823b] resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-black text-sm font-bold mb-2">Data</label>
              <input type="date" name="data" value={formulario.data} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#00823b]" />
            </div>
            <div>
              <label className="block text-black text-sm font-bold mb-2">Horário</label>
              <input type="time" name="horario" value={formulario.horario} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#00823b]" />
            </div>
          </div>

          <div>
            <label className="block text-black text-sm font-bold mb-2">Local</label>
            <input type="text" name="local" value={formulario.local} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#00823b]" />
          </div>

          <div>
            <label className="block text-black text-sm font-bold mb-2">URL da Imagem</label>
            <input type="url" name="imagem" value={formulario.imagem} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#00823b]" />
          </div>
          
          <div className="flex gap-4 pt-2">
            <button type="button" onClick={() => setEditando(false)} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-black font-bold py-3.5 rounded-lg transition-colors text-sm">
              Cancelar
            </button>
            <button type="submit" className="w-1/2 bg-[#00823b] hover:bg-[#006a30] text-white font-bold py-3.5 rounded-lg transition-colors text-sm">
              Guardar Alterações
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function DetalhesEvento() {
  return (
    <Suspense fallback={<p className="text-center mt-12 text-black font-medium">A carregar página...</p>}>
      <DetalhesEventoConteudo />
    </Suspense>
  );
}