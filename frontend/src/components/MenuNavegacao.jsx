import { NavLink, useLocation } from "react-router";
import { ClipboardList, FileText, Plus, User } from "lucide-react";
import { useAuth } from "../contexts/useAuth";

// Cada tela nova entra aqui junto com a sua rota
const MENUS = {
    CLIENTE: [
        {
        rotulo: "Meus Pedidos",
        caminho: "/cliente/pedidos",
        icone: FileText,
        ativo: (url) => url.startsWith("/cliente/pedidos") && url !== "/cliente/pedidos/novo",
        },
        { rotulo: "Novo Pedido", caminho: "/cliente/pedidos/novo", icone: Plus },
        { rotulo: "Meus Dados", caminho: "/cliente/dados", icone: User },
    ],
    AGENTE: [
        {
        rotulo: "Pedidos para Análise",
        caminho: "/agente/pedidos",
        icone: ClipboardList,
        ativo: (url) => url.startsWith("/agente/pedidos"),
        contador: true,
        },
    ],
    };

    export default function MenuNavegacao({ horizontal = false, pendentes = 0 }) {
    const { perfil } = useAuth();
    const { pathname } = useLocation();

    return (
        <nav className={horizontal ? "flex gap-2 overflow-x-auto" : "flex flex-col gap-1"}>
            {MENUS[perfil].map(({ rotulo, caminho, icone: Icone, ativo, contador }) => (
                <NavLink key={caminho} to={caminho} end className={({ isActive }) =>
                    `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    (ativo ? ativo(pathname) : isActive)
                        ? "bg-marca-600 text-white"
                        : horizontal
                        ? "text-suave hover:bg-gray-100"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}>
                    <Icone size={18} />
                    {rotulo}
                    {contador && pendentes > 0 && (
                        <span className="ml-auto rounded-full bg-white/25 px-2 py-0.5 text-xs font-semibold text-white">
                        {pendentes}
                        </span>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}