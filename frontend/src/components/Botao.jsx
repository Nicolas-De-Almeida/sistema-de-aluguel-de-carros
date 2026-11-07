import { classesBotao } from "./estilosBotao";

export default function Botao({ variante = "primario", className = "", ...props }) {
    return <button className={classesBotao(variante, className)} {...props} />;
}