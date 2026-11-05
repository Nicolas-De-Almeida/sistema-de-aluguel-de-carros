import { Link } from "react-router";
import { classesBotao } from "./estilosBotao";

export default function BotaoLink({ variante = "primario", className = "", ...props }) {
    return <Link className={classesBotao(variante, className)} {...props} />;
}