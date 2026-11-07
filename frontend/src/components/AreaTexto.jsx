export default function AreaTexto({ id, rotulo, erro, ...props }) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-semibold">
                {rotulo}
            </label>
            <textarea
                id={id}
                name={id}
                rows={5}
                className={`w-full resize-y rounded-[10px] border bg-white px-3.5 py-3 text-[15px] placeholder:text-gray-400 focus:border-marca-600 focus:ring-2 focus:ring-marca-600/30 focus:outline-none ${
                erro ? "border-perigo" : "border-borda"
                }`}
                {...props}/>
            {erro && <p className="text-[13px] text-perigo">{erro}</p>}
        </div>
    );
}