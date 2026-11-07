package br.com.aluguel.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ClienteAnaliseDto(
        String nome,
        String cpf,
        String rg,
        String profissao,
        String endereco,
        Integer scoreCredito,
        LocalDate clienteDesde,
        List<RendimentoDto> rendimentos,
        BigDecimal rendaTotal) {
}