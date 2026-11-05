package br.com.aluguel.backend.dto;

import br.com.aluguel.backend.model.StatusPedido;
import java.time.LocalDate;

public record PedidoResponse(
        Long id,
        String numero,
        LocalDate dataCriacao,
        StatusPedido status,
        boolean associarCredito,
        String parecer,
        LocalDate dataAvaliacao,
        String avaliadoPor,
        boolean podeSerEditado,
        boolean podeSerCancelado,
        AutomovelDto automovel,
        ContratoCreditoDto contratoCredito) {
}