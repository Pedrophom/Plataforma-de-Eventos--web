"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoEvento() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  // Estado para armazenar os dados digitados
  const [formulario, setFormulario] = useState({
    titulo: "",
    descricao: "",
    data: "",
    horario: "",
    local: "",
    imagem: "",
  });

  // Atualiza o estado conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setCarregando(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      if (res.ok) {
        // Sem alerta! Limpa os dados silenciosamente e volta para o Dashboard
        setFormulario({ titulo: "", descricao: "", data: "", horario: "", local: "", imagem: "" });
        router.push("/"); 
        router.refresh(); 
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Criar Novo Evento</h1>
        <Link href="/" className="text-black font-medium hover:underline"> Voltar </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Título</label>
          <input 
            type="text" name="titulo" 
            value={formulario.titulo} /* CORREÇÃO: Adicionado value */
            required onChange={handleChange} 
            className="w-full border border-gray-300 rounded p-2 text-black" 
            placeholder="Ex: Minicurso de Linux"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Descrição</label>
          <textarea 
            name="descricao" 
            value={formulario.descricao} /* CORREÇÃO: Adicionado value */
            required onChange={handleChange} rows={3}
            className="w-full border border-gray-300 rounded p-2 text-black" 
            placeholder="Detalhes sobre o evento..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Data</label>
            <input 
              type="date" name="data" 
              value={formulario.data} /* CORREÇÃO: Adicionado value */
              required onChange={handleChange} 
              className="w-full border border-gray-300 rounded p-2 text-black" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Horário</label>
            <input 
              type="time" name="horario" 
              value={formulario.horario} /* CORREÇÃO: Adicionado value */
              required onChange={handleChange} 
              className="w-full border border-gray-300 rounded p-2 text-black" 
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Local</label>
          <input 
            type="text" name="local" 
            value={formulario.local} /* CORREÇÃO: Adicionado value */
            required onChange={handleChange} 
            className="w-full border border-gray-300 rounded p-2 text-black" 
            placeholder="Ex: Laboratório 1 - IFMA"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">URL da Imagem (Opcional)</label>
          <input 
            type="url" name="imagem" 
            value={formulario.imagem} /* CORREÇÃO: Adicionado value */
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded p-2 text-black" 
            placeholder="https://link-da-imagem.com/foto.jpg"
          />
        </div>

        <button 
          type="submit" 
          disabled={carregando}
          className="w-full bg-[#00823b] hover:bg-[#006a30] text-white font-bold py-3 rounded-lg shadow-sm transition-colors"
        >
          {carregando ? "Salvando..." : "Salvar Evento"}
        </button>
      </form>
    </div>
  );
}