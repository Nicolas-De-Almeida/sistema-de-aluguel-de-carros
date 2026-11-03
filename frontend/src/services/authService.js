import { api } from "./api";

export const authService = {
    entrar: (login, senha) =>
        api("/api/auth/login", { metodo: "POST", corpo: { login, senha } }),

    cadastrar: (dados) =>
        api("/api/auth/cadastro", { metodo: "POST", corpo: dados }),
    };