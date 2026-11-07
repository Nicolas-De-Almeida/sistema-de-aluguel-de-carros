package br.com.aluguel.backend.repository;

import br.com.aluguel.backend.model.PedidoAluguel;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<PedidoAluguel, Long> {
        List<PedidoAluguel> findByClienteIdOrderByDataCriacaoDescIdDesc(Long clienteId);

        Optional<PedidoAluguel> findByIdAndClienteId(Long id, Long clienteId);

        List<PedidoAluguel> findAllByOrderByDataCriacaoDescIdDesc();
}