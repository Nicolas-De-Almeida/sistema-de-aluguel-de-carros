import Botao from "./Botao";

export default function ModalConfirmacao({
    aberto,
    titulo,
    texto,
    rotuloConfirmar,
    onConfirmar,
    onCancelar,
    carregando = false,
}) {
    if (!aberto) {
        return null;
    }

    return (
        <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 id="modal-titulo" className="text-lg font-bold">
                    {titulo}
                </h2>
                <p className="mt-2 leading-relaxed text-suave">{texto}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <Botao variante="secundario" onClick={onCancelar} disabled={carregando}>
                        Cancelar
                    </Botao>
                    <Botao variante="perigo" onClick={onConfirmar} disabled={carregando}>
                        {carregando ? "Aguarde..." : rotuloConfirmar}
                    </Botao>
                </div>
            </div>
        </div>
    );
}