package br.com.aluguel.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record RendimentoDto(
        @NotBlank(message = "Informe o empregador") String entidadeEmpregadora,
        @NotNull(message = "Informe o rendimento")
        @Positive(message = "O rendimento deve ser maior que zero") BigDecimal valor) {
}