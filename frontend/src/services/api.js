const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const CHAVE_USUARIO = "aluguel.usuario";

export class ApiError extends Error {
    constructor(status, message, campos = {}) {
        super(message);
        this.status = status;
        this.campos = campos;
    }
}

function lerToken() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_USUARIO))?.token;
    } catch {
        return undefined;
    }}

export async function api(caminho, { metodo = "GET", corpo } = {}) {
    const token = lerToken();

    const resposta = await fetch(`${API_URL}${caminho}`, {
        method: metodo,
        headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: corpo ? JSON.stringify(corpo) : undefined,
    });

    if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));

        // Erros de validação, um texto por campo (ex.: senha)
        const campos = {};
        (dados.errors ?? []).forEach((erro) => {
        campos[erro.field] = erro.defaultMessage;
        });

        const mensagem =
        Object.values(campos)[0] ?? dados.message ?? "Não foi possível concluir a operação";
        throw new ApiError(resposta.status, mensagem, campos);
    }

    return resposta.status === 204 ? null : resposta.json();
}