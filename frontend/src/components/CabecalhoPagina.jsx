export default function CabecalhoPagina({ titulo, descricao, children }) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-[28px] font-bold tracking-tight">{titulo}</h1>
                {descricao && <p className="mt-1 text-suave">{descricao}</p>}
            </div>
            {children}
        </div>
    );
}