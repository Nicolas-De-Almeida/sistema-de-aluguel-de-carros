import { ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import Avatar from "./Avatar";

export default function Topbar({ titulo }) {
    const { usuario, rotuloPerfil, sair } = useAuth();
    const primeiroNome = usuario.nome.split(" ")[0];

    return (
        <header className="flex h-16 items-center justify-between border-b border-borda bg-white px-6 lg:px-10">
            <nav aria-label="Você está em" className="flex items-center gap-2 text-sm">
                <span className="text-suave">Aluguel de Carros</span>
                    <ChevronRight size={14} className="text-suave" />
                <span className="font-semibold">{titulo}</span>
            </nav>

            <div className="flex items-center gap-4">
                <div className="hidden text-right leading-tight sm:block">
                    <p className="text-sm font-semibold">Olá, {primeiroNome}</p>
                    <p className="text-[13px] text-suave">{rotuloPerfil}</p>
                </div>
                <Avatar nome={usuario.nome} />
                <span className="h-8 w-px bg-borda" />
                <button onClick={sair} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-suave hover:text-texto">
                    <LogOut size={16} /> Sair
                </button>
            </div>
        </header>
    );
}