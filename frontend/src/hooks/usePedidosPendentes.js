import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "../contexts/useAuth";
import { analiseService } from "../services/analiseService";

// Conta os pedidos em análise; atualiza a cada troca de página
export function usePedidosPendentes() {
    const { perfil } = useAuth();
    const { pathname } = useLocation();
    const [pendentes, setPendentes] = useState(0);

    useEffect(() => {
        if (perfil !== "AGENTE") {
        return undefined;
        }

        let cancelado = false;
        analiseService
        .listar()
        .then((lista) => {
            if (!cancelado) {
            setPendentes(lista.filter((a) => a.pedido.status === "EM_ANALISE").length);
            }
        })
        .catch(() => {});

        return () => {
        cancelado = true;
        };
    }, [perfil, pathname]);

    return perfil === "AGENTE" ? pendentes : 0;
}