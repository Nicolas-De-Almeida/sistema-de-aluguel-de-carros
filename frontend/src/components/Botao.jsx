const variantes = {
  primario: "border-marca-600 bg-marca-600 text-white hover:bg-marca-700",
  secundario: "border-borda bg-white text-texto hover:bg-fundo",
};

export default function Botao({ variante = "primario", className = "", ...props }) {
    return (
        <button
        className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-5 text-[15px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantes[variante]} ${className}`}
        {...props}/>
    );
}