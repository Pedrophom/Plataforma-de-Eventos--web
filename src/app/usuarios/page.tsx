"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuarios = async () => {
    try {
      const res = await fetch("/api/users");
      const dados = await res.json();
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao carregar utilizadores:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const deletarUsuario = async (id: string, nome: string) => {
    const confirmar = window.confirm(`Tem a certeza que deseja excluir o utilizador ${nome} e todas as suas inscrições?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } else {
        alert("Erro ao excluir utilizador.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-sm border border-gray-200 mt-10 text-black">
      <div className="flex justify-between items-center mb-8 pb-5 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 bg-[#00823b] rounded-full"></div>
          <div>
            <h1 className="text-3xl font-extrabold text-black tracking-tight">Gestão de Utilizadores</h1>
            <p className="text-gray-600 text-sm mt-1">Veja todos os cadastrados e remova contas do sistema.</p>
          </div>
        </div>
        <Link href="/" className="text-sm font-bold text-black hover:underline">
          Voltar a Eventos
        </Link>
      </div>

      {carregando ? (
        <p className="text-center font-medium">A carregar utilizadores...</p>
      ) : usuarios.length === 0 ? (
        <p className="text-center font-medium text-gray-500">Nenhum utilizador registado no sistema.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4 text-sm font-bold text-black">Nome</th>
                <th className="py-3 px-4 text-sm font-bold text-black">E-mail</th>
                <th className="py-3 px-4 text-sm font-bold text-black text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-black font-medium">{usuario.nome}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{usuario.email}</td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => deletarUsuario(usuario.id, usuario.nome)}
                      className="text-red-600 font-bold hover:text-red-800 text-sm"
                    >
                      Excluir Conta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}