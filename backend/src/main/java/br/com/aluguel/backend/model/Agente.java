package br.com.aluguel.backend.model;
import jakarta.persistence.*;

@Entity
@Table(name = "agente")
public abstract class Agente extends Usuario {

    private String nomeInstituicao;

    public String getNomeInstituicao() {
        return nomeInstituicao;
    }

    public void setNomeInstituicao(String nomeInstituicao) {
        this.nomeInstituicao = nomeInstituicao;
    }
}