package br.com.aluguel.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record ClienteResponse(
        Long id,
        String nome,
        String login,
        String rg,
        String cpf,
        String endereco,
        String profissao,
        LocalDate dataCadastro,
        List<RendimentoDto> rendimentos) {
}