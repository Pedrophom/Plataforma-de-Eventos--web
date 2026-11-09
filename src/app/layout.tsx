import type { Metadata } from "next";
import "./globals.css";
import MenuCondicional from "./MenuCondicional";

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
        <MenuCondicional>
          {children}
        </MenuCondicional>
      </body>
    </html>
  );
}