"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Inscricao {
  id: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  horario: string;
  local: string;
  imagem: string | null;
  inscricoes?: Inscricao[];
}

function DetalhesEventoConteudo() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [evento, setEvento] = useState<Evento | null>(null);
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mostrarInscritos, setMostrarInscritos] = useState(false);

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

  const removerInscricao = async (inscricaoId: string, nomeUsuario: string) => {
    const confirmar = window.confirm(`Remover a inscrição de ${nomeUsuario} neste evento?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/registrations/${inscricaoId}`, { method: "DELETE" });
      if (res.ok) {
        setEvento((prev) => 
          prev ? { ...prev, inscricoes: prev.inscricoes?.filter(i => i.id !== inscricaoId) } : prev
        );
      } else {
        alert("Erro ao remover inscrição.");
      }
    } catch (error) {
      console.error("Erro:", error);
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
          
          {/* GRUPO DE BOTÕES AQUI */}
          <div className="mt-6 flex flex-col gap-3">
            <button 
              onClick={() => setEditando(true)}
              className="w-full bg-[#00823b] hover:bg-[#006a30] text-white font-bold py-3.5 rounded-lg transition-colors"
            >
              Editar Evento
            </button>

            <button 
              onClick={() => setMostrarInscritos(!mostrarInscritos)}
              className="w-full bg-white border-2 border-[#00823b] text-[#00823b] font-bold py-3.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {mostrarInscritos ? "Ocultar Inscritos" : "Visualizar Inscritos"}
            </button>
          </div>

          {/* TABELA CONDICIONAL */}
          {mostrarInscritos && (
            <div className="mt-8 border-t border-gray-200 pt-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black">
                  Participantes Inscritos ({evento?.inscricoes?.length || 0})
                </h2>
              </div>

              {!evento?.inscricoes || evento.inscricoes.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded border border-gray-200 text-center">
                  <p className="text-gray-500 text-sm">Nenhum utilizador inscrito neste evento ainda.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-3 text-xs font-bold text-black border-b border-gray-200 uppercase">Nome</th>
                        <th className="py-2 px-3 text-xs font-bold text-black border-b border-gray-200 uppercase">E-mail</th>
                        <th className="py-2 px-3 text-xs font-bold text-black text-right border-b border-gray-200 uppercase">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evento.inscricoes.map((inscricao) => (
                        <tr key={inscricao.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-3 text-sm text-black font-semibold">{inscricao.usuario.nome}</td>
                          <td className="py-3 px-3 text-sm text-gray-600">{inscricao.usuario.email}</td>
                          <td className="py-3 px-3 text-right">
                            <button 
                              onClick={() => removerInscricao(inscricao.id, inscricao.usuario.nome)}
                              className="text-red-600 font-bold hover:text-red-800 text-xs bg-red-50 px-2 py-1 rounded"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

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