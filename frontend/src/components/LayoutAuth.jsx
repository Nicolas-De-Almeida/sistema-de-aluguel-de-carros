import { Car, Check } from "lucide-react";
import Card from "./Card";

export default function LayoutAuth({ selo, titulo, texto, children }) {
    return (
        <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
            <section className="flex flex-col bg-[#fbfcfe] px-6 py-8 lg:px-14">
                <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-marca-600 text-white">
                        <Car size={22} />
                    </span>
                    <span className="flex flex-col leading-tight font-semibold">
                        Aluguel
                        <small className="text-[13px] font-medium tracking-[0.18em] text-suave">
                            DE CARROS
                        </small>
                    </span>
                </div>

                <div className="flex flex-1 items-center justify-center py-10">
                    <Card className="w-full max-w-[540px] p-6 sm:p-11">{children}</Card>
                </div>

                <p className="text-[13px] text-suave">
                    © 2026 Aluguel de Carros. Todos os direitos reservados.
                </p>
            </section>

            <section className="hidden items-center bg-linear-to-br from-marca-600 to-marca-800 p-16 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
                <div className="flex max-w-[540px] flex-col items-start gap-5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-sm font-medium">
                        <Check size={16} /> {selo}
                    </span>
                    <h2 className="text-[44px] leading-[1.1] font-bold tracking-tight">{titulo}</h2>
                    <p className="text-[17px] leading-relaxed text-white/80">{texto}</p>
                </div>
            </section>
        </div>
    );
}