import { Car, LogOut } from "lucide-react";
import { useAuth } from "../contexts/useAuth";
import Avatar from "./Avatar";
import MenuNavegacao from "./MenuNavegacao";

export default function Sidebar({ pendentes = 0 }) {
    const { usuario, rotuloPerfil, sair } = useAuth();

    return (
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-sidebar text-white lg:flex">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
                <span className="grid size-10 place-items-center rounded-xl bg-white/10">
                    <Car size={20} />
                </span>
                <span className="flex flex-col leading-tight font-semibold">
                    Aluguel
                    <small className="text-xs font-medium tracking-[0.18em] text-white/60">DE CARROS</small>
                </span>
            </div>

            <div className="flex-1 px-3 py-6">
                <p className="mb-3 px-3 text-xs font-semibold tracking-[0.12em] text-white/50 uppercase">
                    Menu principal
                </p>
                <MenuNavegacao pendentes={pendentes} />
            </div>

            <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4">
                <Avatar nome={usuario.nome} />
                <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-semibold">{usuario.nome}</p>
                    <p className="truncate text-xs text-white/60">
                        {usuario.nomeInstituicao ?? rotuloPerfil}
                    </p>
                </div>
                <button onClick={sair} aria-label="Sair" className="cursor-pointer text-white/60 hover:text-white">
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    );
}