export default function CampoMoeda({ id, rotulo, erro, ...props }) {
    return (
        <div className="flex flex-col gap-2">
            {rotulo && (
                <label htmlFor={id} className="text-sm font-semibold">
                    {rotulo}
                </label>
            )}
            <div
                className={`flex h-12 items-center overflow-hidden rounded-[10px] border bg-white focus-within:border-marca-600 focus-within:ring-2 focus-within:ring-marca-600/30 ${
                erro ? "border-perigo" : "border-borda"
                }`}>
                <span className="border-r border-borda px-3 text-sm text-suave">R$</span>
                <input
                id={id}
                inputMode="decimal"
                className="h-full w-full px-3.5 text-[15px] outline-none placeholder:text-gray-400"
                {...props}/>
            </div>
            {erro && <p className="text-[13px] text-perigo">{erro}</p>}
        </div>
    );
}