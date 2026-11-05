package br.com.aluguel.backend.controller;

import br.com.aluguel.backend.dto.PedidoRequest;
import br.com.aluguel.backend.dto.PedidoResponse;
import br.com.aluguel.backend.service.PedidoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<PedidoResponse> listar(@AuthenticationPrincipal Jwt jwt) {
        return pedidoService.listar(idDo(jwt));
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return pedidoService.buscar(idDo(jwt), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse criar(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody PedidoRequest dados) {
        return pedidoService.criar(idDo(jwt), dados);
    }

    @PutMapping("/{id}")
    public PedidoResponse atualizar(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id,
        @Valid @RequestBody PedidoRequest dados) {
        return pedidoService.atualizar(idDo(jwt), id, dados);
    }

    @PostMapping("/{id}/cancelar")
    public PedidoResponse cancelar(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        return pedidoService.cancelar(idDo(jwt), id);
    }

    // O id do usuário vem do token, nunca da URL
    private Long idDo(Jwt jwt) {
        return ((Number) jwt.getClaim("id")).longValue();
    }
}