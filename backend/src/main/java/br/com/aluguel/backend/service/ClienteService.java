package br.com.aluguel.backend.service;

import br.com.aluguel.backend.dto.ClienteRequest;
import br.com.aluguel.backend.dto.ClienteResponse;
import br.com.aluguel.backend.dto.RendimentoDto;
import br.com.aluguel.backend.model.Cliente;
import br.com.aluguel.backend.model.Rendimento;
import br.com.aluguel.backend.repository.ClienteRepository;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscar(Long id) {
        return paraResposta(obter(id));
    }

    @Transactional
    public ClienteResponse atualizar(Long id, ClienteRequest dados) {
        Cliente cliente = obter(id);

        if (clienteRepository.existsByCpfAndIdNot(dados.cpf(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este CPF já está cadastrado");
        }

        cliente.setNome(dados.nome());
        cliente.setRg(dados.rg());
        cliente.setCpf(dados.cpf());
        cliente.setEndereco(dados.endereco());
        cliente.setProfissao(dados.profissao());

        // Substitui a lista inteira; os antigos são removidos pelo orphanRemoval
        cliente.getRendimentos().clear();
        List<RendimentoDto> novos = dados.rendimentos() == null ? List.of() : dados.rendimentos();
        for (RendimentoDto dto : novos) {
            Rendimento rendimento = new Rendimento();
            rendimento.setEntidadeEmpregadora(dto.entidadeEmpregadora());
            rendimento.setValor(dto.valor());
            cliente.adicionarRendimento(rendimento);
        }

        return paraResposta(cliente);
    }

    @Transactional
    public void excluir(Long id) {
        Cliente cliente = obter(id);
        try {
            clienteRepository.delete(cliente);
            clienteRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Não é possível excluir a conta porque existem pedidos vinculados a ela");
        }
    }

    private Cliente obter(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }

    private ClienteResponse paraResposta(Cliente cliente) {
        List<RendimentoDto> rendimentos = cliente.getRendimentos().stream()
                .map(r -> new RendimentoDto(r.getEntidadeEmpregadora(), r.getValor()))
                .toList();

        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getLogin(),
                cliente.getRg(),
                cliente.getCpf(),
                cliente.getEndereco(),
                cliente.getProfissao(),
                cliente.getDataCadastro(),
                rendimentos);
    }
}