import { api } from "./api";

export const analiseService = {
    listar: () => api("/api/analise/pedidos"),

    buscar: (id) => api(`/api/analise/pedidos/${id}`),

    avaliar: (id, dados) =>
        api(`/api/analise/pedidos/${id}/avaliacao`, { metodo: "POST", corpo: dados }),
};