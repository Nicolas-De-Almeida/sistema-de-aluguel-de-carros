package br.com.aluguel.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CadastroRequest(
        @NotBlank(message = "Informe o nome") String nome,
        @NotBlank(message = "Informe o usuário") @Size(min = 3, message = "O usuário precisa ter ao menos 3 caracteres") String login,
        @NotBlank(message = "Informe a senha") @Size(min = 6, message = "A senha precisa ter ao menos 6 caracteres") String senha,
        @NotNull(message = "Informe o tipo de conta") TipoConta tipo,
        String nomeInstituicao) {
}