import { api } from "./api";

export const clienteService = {
    buscar: () => api("/api/clientes/me"),

    atualizar: (dados) => api("/api/clientes/me", { metodo: "PUT", corpo: dados }),

    excluir: () => api("/api/clientes/me", { metodo: "DELETE" }),
};