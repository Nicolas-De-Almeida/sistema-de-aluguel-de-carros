import Card from "./Card";

const CORES = {
    azul: "bg-marca-50 text-marca-600",
    amarelo: "bg-aviso-fundo text-aviso",
    verde: "bg-sucesso-fundo text-sucesso",
};

export default function CartaoResumo({ icone: Icone, cor = "azul", rotulo, valor }) {
    return (
        <Card className="flex items-center gap-4 p-5">
            <span className={`grid size-11 place-items-center rounded-xl ${CORES[cor]}`}>
                <Icone size={20} />
            </span>
            <div>
                <p className="text-sm text-suave">{rotulo}</p>
                <p className="text-2xl font-bold">{valor}</p>
            </div>
        </Card>
    );
}