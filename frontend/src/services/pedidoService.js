import { api } from "./api";

export const pedidoService = {
    listar: () => api("/api/pedidos"),

    buscar: (id) => api(`/api/pedidos/${id}`),

    criar: (dados) => api("/api/pedidos", { metodo: "POST", corpo: dados }),

    atualizar: (id, dados) => api(`/api/pedidos/${id}`, { metodo: "PUT", corpo: dados }),

    cancelar: (id) => api(`/api/pedidos/${id}/cancelar`, { metodo: "POST" }),
};