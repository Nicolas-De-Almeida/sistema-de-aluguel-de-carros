package br.com.aluguel.backend.controller;

import br.com.aluguel.backend.dto.ClienteRequest;
import br.com.aluguel.backend.dto.ClienteResponse;
import br.com.aluguel.backend.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes/me")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ClienteResponse buscar(@AuthenticationPrincipal Jwt jwt) {
        return clienteService.buscar(idDo(jwt));
    }

    @PutMapping
    public ClienteResponse atualizar(@AuthenticationPrincipal Jwt jwt,
                                     @Valid @RequestBody ClienteRequest dados) {
        return clienteService.atualizar(idDo(jwt), dados);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@AuthenticationPrincipal Jwt jwt) {
        clienteService.excluir(idDo(jwt));
    }

    // O id do usuário vem do token, nunca da URL
    private Long idDo(Jwt jwt) {
        return ((Number) jwt.getClaim("id")).longValue();
    }
}