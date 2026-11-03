package br.com.aluguel.backend.service;

import br.com.aluguel.backend.dto.AuthResponse;
import br.com.aluguel.backend.dto.CadastroRequest;
import br.com.aluguel.backend.dto.LoginRequest;
import br.com.aluguel.backend.dto.TipoConta;
import br.com.aluguel.backend.model.Agente;
import br.com.aluguel.backend.model.Banco;
import br.com.aluguel.backend.model.Cliente;
import br.com.aluguel.backend.model.Empresa;
import br.com.aluguel.backend.model.Usuario;
import br.com.aluguel.backend.repository.UsuarioRepository;
import br.com.aluguel.backend.security.TokenService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional
    public AuthResponse cadastrar(CadastroRequest dados) {
        if (usuarioRepository.existsByLogin(dados.login())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este usuário já existe");
        }

        Usuario usuario = switch (dados.tipo()) {
            case CLIENTE -> new Cliente();
            case EMPRESA -> new Empresa();
            case BANCO -> new Banco();
        };

        usuario.setNome(dados.nome());
        usuario.setLogin(dados.login());
        usuario.setSenha(passwordEncoder.encode(dados.senha()));

        if (usuario instanceof Agente agente) {
            agente.setNomeInstituicao(dados.nomeInstituicao());
        }

        usuarioRepository.save(usuario);
        return montarResposta(usuario);
    }

    public AuthResponse entrar(LoginRequest dados) {
        Usuario usuario = usuarioRepository.findByLogin(dados.login())
                .filter(u -> passwordEncoder.matches(dados.senha(), u.getSenha()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos"));

        return montarResposta(usuario);
    }

    private AuthResponse montarResposta(Usuario usuario) {
        TipoConta tipo = tipoDe(usuario);

        List<String> papeis = switch (tipo) {
            case CLIENTE -> List.of("CLIENTE");
            case EMPRESA -> List.of("AGENTE");
            case BANCO -> List.of("AGENTE", "BANCO");
        };
        String token = tokenService.gerarToken(usuario.getId(), usuario.getLogin(), papeis);
        String instituicao = usuario instanceof Agente agente ? agente.getNomeInstituicao() : null;
        return new AuthResponse(token, usuario.getId(), usuario.getNome(), tipo, instituicao);
    }

    private TipoConta tipoDe(Usuario usuario) {
        if (usuario instanceof Cliente) {
            return TipoConta.CLIENTE;
        }
        if (usuario instanceof Banco) {
            return TipoConta.BANCO;
        }
        return TipoConta.EMPRESA;
    }
}