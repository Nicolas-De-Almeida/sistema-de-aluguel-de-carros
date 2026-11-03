import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import Botao from "../../components/Botao";
import Campo from "../../components/Campo";
import LayoutAuth from "../../components/LayoutAuth";
import Segmentado from "../../components/Segmentado";
import { useAuth } from "../../contexts/useAuth";

const TIPOS = [
  { valor: "CLIENTE", rotulo: "Cliente" },
  { valor: "EMPRESA", rotulo: "Empresa" },
  { valor: "BANCO", rotulo: "Banco" },
];

const FORM_INICIAL = {
  nome: "",
  nomeInstituicao: "",
  login: "",
  senha: "",
  confirmarSenha: "",
};

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const [tipo, setTipo] = useState("CLIENTE");
  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState("");
  const [carregando, setCarregando] = useState(false);

  const ehAgente = tipo !== "CLIENTE";

  function alterar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErros({});
    setErroGeral("");

    if (form.senha !== form.confirmarSenha) {
      setErros({ confirmarSenha: "As senhas não conferem" });
      return;
    }

    setCarregando(true);
    try {
      await cadastrar({
        nome: form.nome,
        login: form.login,
        senha: form.senha,
        tipo,
        nomeInstituicao: ehAgente ? form.nomeInstituicao : null,
      });
    } catch (e) {
      if (e.status === 409) {
        setErros({ login: e.message });
      } else if (e.campos && Object.keys(e.campos).length > 0) {
        setErros(e.campos);
      } else {
        setErroGeral(e.message);
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <LayoutAuth
      selo="Cadastro rápido"
      titulo="Comece a gerenciar seus pedidos de aluguel."
      texto="Cadastre-se como cliente para solicitar aluguéis, ou como agente (empresa ou banco) para analisar pedidos.">
      <p className="text-[13px] font-bold tracking-[0.12em] text-marca-600 uppercase">
        Novo por aqui?
      </p>
      <h1 className="mt-2.5 text-[32px] font-bold tracking-tight">Crie sua conta</h1>
      <p className="mt-2 leading-relaxed text-suave">
        Escolha o tipo de conta e preencha seus dados.
      </p>

      <form onSubmit={enviar} className="mt-7 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Tipo de conta</span>
          <Segmentado opcoes={TIPOS} valor={tipo} onChange={setTipo} />
        </div>

        <Campo
          id="nome"
          rotulo="Nome completo"
          placeholder="Digite seu nome"
          value={form.nome}
          onChange={alterar}
          erro={erros.nome}
          required/>

        {ehAgente && (
          <Campo
            id="nomeInstituicao"
            rotulo={tipo === "BANCO" ? "Nome do banco" : "Nome da empresa"}
            placeholder={tipo === "BANCO" ? "Ex.: Banco Horizonte" : "Ex.: Locadora Exemplo"}
            value={form.nomeInstituicao}
            onChange={alterar}
            erro={erros.nomeInstituicao}
            required/>
        )}

        <Campo
          id="login"
          rotulo="Usuário"
          placeholder="Escolha um usuário"
          value={form.login}
          onChange={alterar}
          erro={erros.login}
          autoComplete="username"
          required/>
        <Campo
          id="senha"
          rotulo="Senha"
          type="password"
          placeholder="Mínimo de 6 caracteres"
          value={form.senha}
          onChange={alterar}
          erro={erros.senha}
          autoComplete="new-password"
          required/>
        <Campo
          id="confirmarSenha"
          rotulo="Confirmar senha"
          type="password"
          placeholder="Digite a senha novamente"
          value={form.confirmarSenha}
          onChange={alterar}
          erro={erros.confirmarSenha}
          autoComplete="new-password"
          required/>

        {erroGeral && (
          <p role="alert" className="rounded-[10px] bg-perigo-fundo px-3.5 py-2.5 text-sm text-perigo">
            {erroGeral}
          </p>
        )}

        <Botao disabled={carregando} className="w-full justify-between">
          {carregando ? "Criando conta..." : "Criar conta"}
          <ArrowRight size={18} />
        </Botao>

        <p className="text-center text-[15px] text-suave">
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold text-marca-600 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </LayoutAuth>
  );
}