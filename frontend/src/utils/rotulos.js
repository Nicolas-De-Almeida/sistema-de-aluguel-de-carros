export const PROPRIETARIOS = [
    { valor: "CLIENTE", rotulo: "Cliente" },
    { valor: "EMPRESA", rotulo: "Empresa" },
    { valor: "BANCO", rotulo: "Banco" },
];

export function rotuloProprietario(valor) {
    return PROPRIETARIOS.find((p) => p.valor === valor)?.rotulo ?? valor;
}