function iniciais(nome) {
    const partes = nome.trim().split(/\s+/);
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (primeira + ultima).toUpperCase();
}

export default function Avatar({ nome, className = "" }) {
    return (
        <span className={`grid size-9 shrink-0 place-items-center rounded-full bg-marca-50 text-xs font-bold text-marca-600 ${className}`}>
        {iniciais(nome)}
        </span>
    );
}