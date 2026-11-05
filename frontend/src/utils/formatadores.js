// Digita 12345678900 e vira 123.456.789-00
export function mascararCpf(texto) {
  const digitos = texto.replace(/\D/g, "").slice(0, 11);
  return digitos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// 8500 vira "8.500,00"
export function numeroBR(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// "8.500,00" vira 8500. Texto vazio ou inválido vira null
export function lerMoeda(texto) {
  if (String(texto).trim() === "") {
    return null;
  }
  const numero = Number(String(texto).replace(/\./g, "").replace(",", "."));
  return Number.isNaN(numero) ? null : numero;
}