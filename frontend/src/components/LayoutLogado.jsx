import MenuNavegacao from "./MenuNavegacao";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function LayoutLogado({ titulo, children }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar titulo={titulo} />
                {/* Em telas pequenas o menu lateral some e o menu aparece aqui */}
                <div className="border-b border-borda bg-white px-4 py-2 lg:hidden">
                <MenuNavegacao horizontal />
                </div>
                <main className="w-full flex-1 p-6 lg:p-10">{children}</main>
            </div>
        </div>
    );
}