export const PROPRIETARIOS = [
    { valor: "CLIENTE", rotulo: "Cliente" },
    { valor: "EMPRESA", rotulo: "Empresa" },
    { valor: "BANCO", rotulo: "Banco" },
];

export function rotuloProprietario(valor) {
    return PROPRIETARIOS.find((p) => p.valor === valor)?.rotulo ?? valor;
}

// Classifica o score de crédito (0 a 1000) para exibição ao agente
export function faixaScore(score) {
    if (score <= 500) {
        return { rotulo: "Baixo", classes: "bg-perigo-fundo text-perigo" };
    }
    if (score <= 700) {
        return { rotulo: "Regular", classes: "bg-aviso-fundo text-aviso" };
    }
    if (score <= 850) {
        return { rotulo: "Bom", classes: "bg-sucesso-fundo text-sucesso" };
    }
    return { rotulo: "Excelente", classes: "bg-sucesso-fundo text-sucesso" };
}