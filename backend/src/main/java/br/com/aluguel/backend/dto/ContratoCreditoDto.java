package br.com.aluguel.backend.dto;

import java.math.BigDecimal;

public record ContratoCreditoDto(BigDecimal valorFinanciado, int numeroParcelas, String banco) {
}