import { useState } from "react";
import { AuthContext } from "./authContext";
import { CHAVE_USUARIO } from "../services/api";
import { authService } from "../services/authService";

function lerUsuarioSalvo() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_USUARIO));
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(lerUsuarioSalvo);

    function guardar(dados) {
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados));
        setUsuario(dados);
    }

    async function entrar(login, senha) {
        guardar(await authService.entrar(login, senha));
    }

    async function cadastrar(dados) {
        guardar(await authService.cadastrar(dados));
    }

    function sair() {
        localStorage.removeItem(CHAVE_USUARIO);
        setUsuario(null);
    }

    // Empresa e Banco são "agentes"; só o cliente tem o perfil CLIENTE
    const perfil = usuario ? (usuario.tipo === "CLIENTE" ? "CLIENTE" : "AGENTE") : null;
    const paginaInicial = perfil === "AGENTE" ? "/agente/pedidos" : "/cliente/pedidos";

    const valor = {
        usuario,
        perfil,
        paginaInicial,
        estaLogado: Boolean(usuario),
        entrar,
        cadastrar,
        sair,
    };

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}