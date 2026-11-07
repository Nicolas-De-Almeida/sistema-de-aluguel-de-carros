package br.com.aluguel.backend.service;

import br.com.aluguel.backend.dto.AvaliacaoRequest;
import br.com.aluguel.backend.dto.ClienteAnaliseDto;
import br.com.aluguel.backend.dto.DecisaoAvaliacao;
import br.com.aluguel.backend.dto.PedidoAnaliseResponse;
import br.com.aluguel.backend.dto.RendimentoDto;
import br.com.aluguel.backend.model.Agente;
import br.com.aluguel.backend.model.Banco;
import br.com.aluguel.backend.model.Cliente;
import br.com.aluguel.backend.model.ContratoCredito;
import br.com.aluguel.backend.model.PedidoAluguel;
import br.com.aluguel.backend.model.StatusPedido;
import br.com.aluguel.backend.repository.AgenteRepository;
import br.com.aluguel.backend.repository.PedidoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AnaliseService {

    private final PedidoRepository pedidoRepository;
    private final AgenteRepository agenteRepository;
    private final PedidoService pedidoService;

    public AnaliseService(PedidoRepository pedidoRepository,
                          AgenteRepository agenteRepository,
                          PedidoService pedidoService) {
        this.pedidoRepository = pedidoRepository;
        this.agenteRepository = agenteRepository;
        this.pedidoService = pedidoService;
    }

    @Transactional(readOnly = true)
    public List<PedidoAnaliseResponse> listar(Long agenteId) {
        Agente agente = obterAgente(agenteId);
        return pedidoRepository.findAllByOrderByDataCriacaoDescIdDesc().stream()
                .map(pedido -> paraResposta(pedido, agente))
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoAnaliseResponse buscar(Long agenteId, Long pedidoId) {
        return paraResposta(obterPedido(pedidoId), obterAgente(agenteId));
    }

    @Transactional
    public PedidoAnaliseResponse avaliar(Long agenteId, Long pedidoId, AvaliacaoRequest dados) {
        Agente agente = obterAgente(agenteId);
        PedidoAluguel pedido = obterPedido(pedidoId);
        String parecer = dados.parecer().trim();

        try {
            if (dados.decisao() == DecisaoAvaliacao.REJEITAR) {
                pedido.rejeitar(agente, parecer);
            } else {
                aprovar(pedido, agente, parecer, dados);
            }
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }

        return paraResposta(pedido, agente);
    }

    private void aprovar(PedidoAluguel pedido, Agente agente, String parecer, AvaliacaoRequest dados) {
        boolean credito = pedido.isAssociarCredito();

        if (credito && !(agente instanceof Banco)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Pedidos com contrato de crédito só podem ser aprovados por um banco");
        }
        if (credito && (dados.valorFinanciado() == null || dados.numeroParcelas() == null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Informe o valor financiado e o número de parcelas");
        }

        // O status é conferido aqui; se não estiver em análise, lança IllegalStateException
        pedido.aprovar(agente, parecer);

        if (credito) {
            ContratoCredito contrato = new ContratoCredito();
            contrato.setValorFinanciado(dados.valorFinanciado());
            contrato.setNumeroParcelas(dados.numeroParcelas());
            contrato.setBanco((Banco) agente);
            pedido.setContratoCredito(contrato);
        }
    }

    private PedidoAluguel obterPedido(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }

    private Agente obterAgente(Long id) {
        return agenteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agente não encontrado"));
    }

    private PedidoAnaliseResponse paraResposta(PedidoAluguel pedido, Agente agente) {
        Cliente c = pedido.getCliente();

        List<RendimentoDto> rendimentos = c.getRendimentos().stream()
                .map(r -> new RendimentoDto(r.getEntidadeEmpregadora(), r.getValor()))
                .toList();

        ClienteAnaliseDto cliente = new ClienteAnaliseDto(
                c.getNome(), c.getCpf(), c.getRg(), c.getProfissao(), c.getEndereco(),
                c.getDataCadastro(), rendimentos, c.calcularRendaTotal());

        boolean ehBanco = agente instanceof Banco;
        boolean podeAvaliar = pedido.getStatus() == StatusPedido.EM_ANALISE;
        boolean podeAprovar = podeAvaliar && (!pedido.isAssociarCredito() || ehBanco);
        boolean precisaCredito = podeAvaliar && pedido.isAssociarCredito() && ehBanco;

        return new PedidoAnaliseResponse(
                pedidoService.paraResposta(pedido), cliente, podeAvaliar, podeAprovar, precisaCredito);
    }
}