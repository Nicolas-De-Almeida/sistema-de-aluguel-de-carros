package br.com.aluguel.backend.controller;

import br.com.aluguel.backend.dto.AvaliacaoRequest;
import br.com.aluguel.backend.dto.PedidoAnaliseResponse;
import br.com.aluguel.backend.service.AnaliseService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analise/pedidos")
public class AnaliseController {

    private final AnaliseService analiseService;

    public AnaliseController(AnaliseService analiseService) {
        this.analiseService = analiseService;
    }

    @GetMapping
    public List<PedidoAnaliseResponse> listar(@AuthenticationPrincipal Jwt jwt) {
        return analiseService.listar(idDo(jwt));
    }

    @GetMapping("/{id}")
    public PedidoAnaliseResponse buscar(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return analiseService.buscar(idDo(jwt), id);
    }

    @PostMapping("/{id}/avaliacao")
    public PedidoAnaliseResponse avaliar(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id,
        @Valid @RequestBody AvaliacaoRequest dados) {
        return analiseService.avaliar(idDo(jwt), id, dados);
    }

    // O id do usuário vem do token, nunca da URL
    private Long idDo(Jwt jwt) {
        return ((Number) jwt.getClaim("id")).longValue();
    }
}