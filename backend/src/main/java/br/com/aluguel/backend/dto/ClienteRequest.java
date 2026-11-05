package br.com.aluguel.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ClienteRequest(
        @NotBlank(message = "Informe o nome completo") String nome,
        @NotBlank(message = "Informe o RG") String rg,
        @NotNull(message = "Informe o CPF no formato 000.000.000-00")
        @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", message = "Informe o CPF no formato 000.000.000-00") String cpf,
        @NotBlank(message = "Informe o endereço") String endereco,
        @NotBlank(message = "Informe a profissão") String profissao,
        @Valid @Size(max = 3, message = "Informe no máximo 3 empregadores") List<RendimentoDto> rendimentos) {
}