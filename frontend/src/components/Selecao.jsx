export default function Selecao({ id, rotulo, erro, opcoes, ...props }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-semibold">
                {rotulo}
            </label>
            <select
                id={id}
                name={id}
                className={`h-12 w-full rounded-[10px] border bg-white px-3 text-[15px] focus:border-marca-600 focus:ring-2 focus:ring-marca-600/30 focus:outline-none ${
                erro ? "border-perigo" : "border-borda"
                }`}
                {...props}>
                {opcoes.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                    {opcao.rotulo}
                </option>
                ))}
            </select>
            {erro && <p className="text-[13px] text-perigo">{erro}</p>}
        </div>
    );
}