package br.com.aluguel.backend.repository;

import br.com.aluguel.backend.model.Agente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgenteRepository extends JpaRepository<Agente, Long> {
}