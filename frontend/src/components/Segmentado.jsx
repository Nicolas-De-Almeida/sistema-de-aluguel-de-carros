export default function Segmentado({ opcoes, valor, onChange }) {
    return (
        <div role="radiogroup" className="flex gap-1 rounded-[10px] bg-gray-100 p-1">
        {opcoes.map((opcao) => {
            const ativo = valor === opcao.valor;
            return (
            <button
                key={opcao.valor}
                type="button"
                role="radio"
                aria-checked={ativo}
                onClick={() => onChange(opcao.valor)}
                className={`h-10 flex-1 cursor-pointer rounded-lg text-sm font-semibold transition-colors ${
                ativo ? "bg-white text-marca-600 shadow-sm" : "text-suave hover:text-texto"
                }`}>
                {opcao.rotulo}
            </button>
            );
        })}
        </div>
    );
}