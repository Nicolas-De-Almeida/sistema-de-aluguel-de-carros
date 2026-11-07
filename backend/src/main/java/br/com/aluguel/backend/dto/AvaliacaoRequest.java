package br.com.aluguel.backend.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AvaliacaoRequest(
        @NotNull(message = "Informe a decisão") DecisaoAvaliacao decisao,
        @NotBlank(message = "Registre o parecer")
        @Size(max = 1000, message = "O parecer pode ter no máximo 1000 caracteres") String parecer,
        @Positive(message = "O valor financiado deve ser maior que zero")
        @Digits(integer = 10, fraction = 2, message = "Informe um valor válido") BigDecimal valorFinanciado,
        @Min(value = 1, message = "Informe ao menos 1 parcela")
        @Max(value = 120, message = "Informe no máximo 120 parcelas") Integer numeroParcelas) {
}