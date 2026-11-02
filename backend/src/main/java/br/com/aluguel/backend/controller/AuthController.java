package br.com.aluguel.backend.controller;

import br.com.aluguel.backend.dto.AuthResponse;
import br.com.aluguel.backend.dto.CadastroRequest;
import br.com.aluguel.backend.dto.LoginRequest;
import br.com.aluguel.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse cadastrar(@Valid @RequestBody CadastroRequest dados) {
        return authService.cadastrar(dados);
    }

    @PostMapping("/login")
    public AuthResponse entrar(@Valid @RequestBody LoginRequest dados) {
        return authService.entrar(dados);
    }
}