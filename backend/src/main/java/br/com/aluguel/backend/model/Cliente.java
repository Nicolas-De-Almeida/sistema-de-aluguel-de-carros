package br.com.aluguel.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cliente")
public class Cliente extends Usuario {

    private String rg;

    @Column(unique = true)
    private String cpf;

    private String endereco;

    private String profissao;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rendimento> rendimentos = new ArrayList<>();

    // Regra do sistema, no máximo 3 rendimentos por cliente
    public void adicionarRendimento(Rendimento rendimento) {
        if (rendimentos.size() >= 3) {
            throw new IllegalStateException("O cliente pode ter no máximo 3 rendimentos");
        }
        rendimento.setCliente(this);
        rendimentos.add(rendimento);
    }

    public BigDecimal calcularRendaTotal() {
        return rendimentos.stream()
                .map(Rendimento::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    
    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public List<Rendimento> getRendimentos() {
        return rendimentos;
    }
}