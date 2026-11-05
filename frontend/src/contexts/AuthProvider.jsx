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
const ROTULOS_PERFIL = {
  CLIENTE: "Cliente",
  BANCO: "Agente financeiro",
  EMPRESA: "Agente (empresa)",
};
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
    // Mantém o nome do topo e do menu em dia depois de editar os dados
    function atualizarUsuario(parcial) {
        guardar({ ...usuario, ...parcial });
    }
    // Empresa e Banco são "agentes"; só o cliente tem o perfil CLIENTE
    const perfil = usuario ? (usuario.tipo === "CLIENTE" ? "CLIENTE" : "AGENTE") : null;
    const paginaInicial = perfil === "AGENTE" ? "/agente/pedidos" : "/cliente/pedidos";

    const valor = {
        usuario,
        perfil,
        paginaInicial,
        rotuloPerfil: usuario ? ROTULOS_PERFIL[usuario.tipo] : "",
        estaLogado: Boolean(usuario),
        entrar,
        cadastrar,
        sair,
        atualizarUsuario
    };

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}