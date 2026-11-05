package br.com.aluguel.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "pedido_aluguel")
public class PedidoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ex.: 2025-048. O service preenche depois que o id existe
    @Column(unique = true)
    private String numero;

    private LocalDate dataCriacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.EM_ANALISE;

    private boolean associarCredito;

    @Column(length = 1000)
    private String parecer;

    private LocalDate dataAvaliacao;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Salvar o pedido também salva o automóvel informado no formulário
    @ManyToOne(optional = false, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "automovel_id")
    private Automovel automovel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agente_avaliador_id")
    private Agente agenteAvaliador;

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private ContratoCredito contratoCredito;

    @PrePersist
    protected void definirDataCriacao() {
        this.dataCriacao = LocalDate.now();
    }

    // Regras de negócio do pedido

    public boolean podeSerEditado() {
        return status == StatusPedido.EM_ANALISE;
    }
    public boolean podeSerCancelado() {
        return status == StatusPedido.EM_ANALISE || status == StatusPedido.APROVADO;
    }

    public void cancelar() {
        if (!podeSerCancelado()) {
            throw new IllegalStateException("Este pedido não pode mais ser cancelado");
        }
        this.status = StatusPedido.CANCELADO;
    }

    public void aprovar(Agente agente, String parecer) {
        avaliar(agente, parecer, StatusPedido.APROVADO);
    }

    public void rejeitar(Agente agente, String parecer) {
        avaliar(agente, parecer, StatusPedido.REJEITADO);
    }

    private void avaliar(Agente agente, String parecer, StatusPedido novoStatus) {
        if (status != StatusPedido.EM_ANALISE) {
            throw new IllegalStateException("Apenas pedidos em análise podem ser avaliados");
        }
        this.agenteAvaliador = agente;
        this.parecer = parecer;
        this.dataAvaliacao = LocalDate.now();
        this.status = novoStatus;
    }

    
    public Long getId() {
        return id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public boolean isAssociarCredito() {
        return associarCredito;
    }

    public void setAssociarCredito(boolean associarCredito) {
        this.associarCredito = associarCredito;
    }

    public String getParecer() {
        return parecer;
    }

    public LocalDate getDataAvaliacao() {
        return dataAvaliacao;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Automovel getAutomovel() {
        return automovel;
    }

    public void setAutomovel(Automovel automovel) {
        this.automovel = automovel;
    }

    public Agente getAgenteAvaliador() {
        return agenteAvaliador;
    }

    public ContratoCredito getContratoCredito() {
        return contratoCredito;
    }

    public void setContratoCredito(ContratoCredito contratoCredito) {
        this.contratoCredito = contratoCredito;
        contratoCredito.setPedido(this);
    }
}