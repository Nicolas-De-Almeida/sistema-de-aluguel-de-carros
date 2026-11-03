import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import Botao from "../../components/Botao";
import Campo from "../../components/Campo";
import LayoutAuth from "../../components/LayoutAuth";
import { useAuth } from "../../contexts/useAuth";

export default function Login() {
  const { entrar } = useAuth();
  const [form, setForm] = useState({ login: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function alterar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await entrar(form.login, form.senha);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <LayoutAuth
      selo="Gestão rápida e transparente"
      titulo="Seu próximo carro começa com um pedido."
      texto="Acompanhe cada etapa, organize seus dados e receba análises com total clareza.">
      <p className="text-[13px] font-bold tracking-[0.12em] text-marca-600 uppercase">
        Bem-vindo de volta
      </p>
      <h1 className="mt-2.5 text-[32px] font-bold tracking-tight">Acesse sua conta</h1>
      <p className="mt-2 leading-relaxed text-suave">
        Gerencie seus pedidos de aluguel de forma simples e segura.
      </p>

      <form onSubmit={enviar} className="mt-7 flex flex-col gap-5">
        <Campo
          id="login"
          rotulo="Usuário"
          placeholder="Digite seu usuário"
          value={form.login}
          onChange={alterar}
          autoComplete="username"
          required/>
        <Campo
          id="senha"
          rotulo="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={form.senha}
          onChange={alterar}
          autoComplete="current-password"
          required/>

        {erro && (
          <p role="alert" className="rounded-[10px] bg-perigo-fundo px-3.5 py-2.5 text-sm text-perigo">
            {erro}
          </p>
        )}

        <Botao disabled={carregando} className="w-full justify-between">
          {carregando ? "Entrando..." : "Entrar"}
          <ArrowRight size={18} />
        </Botao>

        <p className="text-center text-[15px] text-suave">
          Não tem conta?{" "}
          <Link to="/cadastro" className="font-semibold text-marca-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </LayoutAuth>
  );
}