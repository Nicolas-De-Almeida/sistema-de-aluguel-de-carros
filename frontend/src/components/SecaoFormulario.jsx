export default function SecaoFormulario({ icone: Icone, titulo, descricao, acao, children }) {
    return (
        <section className="border-b border-borda p-6 last:border-b-0 lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-marca-50 text-marca-600">
                        <Icone size={20} />
                    </span>
                    <div>
                        <h2 className="font-bold">{titulo}</h2>
                        <p className="text-sm text-suave">{descricao}</p>
                    </div>
                </div>
                {acao}
            </div>
            {children}
        </section>
    );
}