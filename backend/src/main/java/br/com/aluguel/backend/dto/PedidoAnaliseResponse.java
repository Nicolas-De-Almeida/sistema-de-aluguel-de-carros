package br.com.aluguel.backend.dto;

public record PedidoAnaliseResponse(
        PedidoResponse pedido,
        ClienteAnaliseDto cliente,
        boolean podeAvaliar,
        boolean podeAprovar,
        boolean precisaCredito) {
}