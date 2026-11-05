package br.com.aluguel.backend.repository;

import br.com.aluguel.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByCpfAndIdNot(String cpf, Long id);
}