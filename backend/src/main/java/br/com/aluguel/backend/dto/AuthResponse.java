package br.com.aluguel.backend.dto;

public record AuthResponse(String token, Long id, String nome, TipoConta tipo) {
}