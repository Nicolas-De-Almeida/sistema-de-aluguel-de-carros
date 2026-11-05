package br.com.aluguel.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record PedidoRequest(
        @Valid @NotNull(message = "Informe os dados do automóvel") AutomovelDto automovel,
        boolean associarCredito) {
}