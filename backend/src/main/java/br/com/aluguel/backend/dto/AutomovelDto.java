package br.com.aluguel.backend.dto;

import br.com.aluguel.backend.model.TipoProprietario;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record AutomovelDto(
        @NotBlank(message = "Informe a matrícula") String matricula,
        @NotNull(message = "Informe o ano")
        @Min(value = 1900, message = "Informe um ano válido")
        @Max(value = 2100, message = "Informe um ano válido") Integer ano,
        @NotBlank(message = "Informe a marca") String marca,
        @NotBlank(message = "Informe o modelo") String modelo,
        @NotBlank(message = "Informe a placa")
        @Pattern(regexp = "(?i)[A-Z]{3}-?\\d[A-Z0-9]\\d{2}", message = "Informe a placa no formato ABC-1D23") String placa,
        @NotNull(message = "Informe o proprietário") TipoProprietario proprietario,
        @NotNull(message = "Informe o valor do veículo")
        @Positive(message = "O valor do veículo deve ser maior que zero")
        @Digits(integer = 10, fraction = 2, message = "Informe um valor válido") BigDecimal valor) {
}