import { Navigate } from "react-router";
import { useAuth } from "../contexts/useAuth";

export default function PrivateRoute({ perfil, children }) {
    const { estaLogado, perfil: perfilAtual, paginaInicial } = useAuth();

    if (!estaLogado) {
        return <Navigate to="/login" replace />;
    }

    // Cliente não entra nas telas de agente, e vice-versa
    if (perfil && perfil !== perfilAtual) {
        return <Navigate to={paginaInicial} replace/>;
    }

    return children;
}