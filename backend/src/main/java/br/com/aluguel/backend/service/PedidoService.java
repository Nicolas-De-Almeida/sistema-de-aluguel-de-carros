package br.com.aluguel.backend.service;

import br.com.aluguel.backend.dto.AutomovelDto;
import br.com.aluguel.backend.dto.ContratoCreditoDto;
import br.com.aluguel.backend.dto.PedidoRequest;
import br.com.aluguel.backend.dto.PedidoResponse;
import br.com.aluguel.backend.model.Automovel;
import br.com.aluguel.backend.model.Cliente;
import br.com.aluguel.backend.model.ContratoCredito;
import br.com.aluguel.backend.model.PedidoAluguel;
import br.com.aluguel.backend.repository.ClienteRepository;
import br.com.aluguel.backend.repository.PedidoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(Long clienteId) {
        return pedidoRepository.findByClienteIdOrderByDataCriacaoDescIdDesc(clienteId).stream()
                .map(this::paraResposta)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(Long clienteId, Long id) {
        return paraResposta(obter(clienteId, id));
    }

    @Transactional
    public PedidoResponse criar(Long clienteId, PedidoRequest dados) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
        exigirDadosCompletos(cliente);

        Automovel automovel = new Automovel();
        preencher(automovel, dados.automovel());

        PedidoAluguel pedido = new PedidoAluguel();
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setAssociarCredito(dados.associarCredito());

        // O id só existe depois de salvar, por isso o número é montado em seguida
        pedidoRepository.save(pedido);
        pedido.setNumero(pedido.getDataCriacao().getYear() + "-" + String.format("%03d", pedido.getId()));

        return paraResposta(pedido);
    }

    @Transactional
    public PedidoResponse atualizar(Long clienteId, Long id, PedidoRequest dados) {
        PedidoAluguel pedido = obter(clienteId, id);

        if (!pedido.podeSerEditado()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Apenas pedidos em análise podem ser editados");
        }

        preencher(pedido.getAutomovel(), dados.automovel());
        pedido.setAssociarCredito(dados.associarCredito());
        return paraResposta(pedido);
    }

    @Transactional
    public PedidoResponse cancelar(Long clienteId, Long id) {
        PedidoAluguel pedido = obter(clienteId, id);
        try {
            pedido.cancelar();
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
        return paraResposta(pedido);
    }

    // Busca pelo id E pelo dono: um cliente nunca enxerga o pedido de outro
    private PedidoAluguel obter(Long clienteId, Long id) {
        return pedidoRepository.findByIdAndClienteId(id, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }

    private void exigirDadosCompletos(Cliente cliente) {
        boolean incompleto = vazio(cliente.getRg()) || vazio(cliente.getCpf())
                || vazio(cliente.getEndereco()) || vazio(cliente.getProfissao())
                || cliente.getScoreCredito() == null
                || cliente.getRendimentos().isEmpty();

        if (incompleto) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Complete seus dados pessoais, informe seu score de crédito e ao menos um empregador antes de criar um pedido");
        }
    }

    private boolean vazio(String texto) {
        return texto == null || texto.isBlank();
    }

    private void preencher(Automovel automovel, AutomovelDto dados) {
        automovel.setMatricula(dados.matricula().trim());
        automovel.setAno(dados.ano());
        automovel.setMarca(dados.marca().trim());
        automovel.setModelo(dados.modelo().trim());
        automovel.setPlaca(dados.placa().trim().toUpperCase());
        automovel.setProprietario(dados.proprietario());
        automovel.setValor(dados.valor());
    }

    // Público porque o AnaliseService também usa
    public PedidoResponse paraResposta(PedidoAluguel pedido) {
        Automovel a = pedido.getAutomovel();
        AutomovelDto automovel = new AutomovelDto(
                a.getMatricula(), a.getAno(), a.getMarca(), a.getModelo(), a.getPlaca(),
                a.getProprietario(), a.getValor());

        ContratoCreditoDto contrato = null;
        ContratoCredito c = pedido.getContratoCredito();
        if (c != null) {
            contrato = new ContratoCreditoDto(
                    c.getValorFinanciado(), c.getNumeroParcelas(), c.getBanco().getNomeInstituicao());
        }

        String avaliadoPor = pedido.getAgenteAvaliador() != null
                ? pedido.getAgenteAvaliador().getNomeInstituicao()
                : null;

        return new PedidoResponse(
                pedido.getId(),
                pedido.getNumero(),
                pedido.getDataCriacao(),
                pedido.getStatus(),
                pedido.isAssociarCredito(),
                pedido.getParecer(),
                pedido.getDataAvaliacao(),
                avaliadoPor,
                pedido.podeSerEditado(),
                pedido.podeSerCancelado(),
                automovel,
                contrato);
    }
}