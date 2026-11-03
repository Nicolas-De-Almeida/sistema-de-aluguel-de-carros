import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Car, Check } from "lucide-react";
import Botao from "../../components/Botao";
import Campo from "../../components/Campo";
import Card from "../../components/Card";
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
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
      <section className="flex flex-col bg-[#fbfcfe] px-6 py-8 lg:px-14">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-marca-600 text-white">
            <Car size={22} />
          </span>
          <span className="flex flex-col leading-tight font-semibold">
            Aluguel
            <small className="text-[13px] font-medium tracking-[0.18em] text-suave">
              DE CARROS
            </small>
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <Card className="w-full max-w-[540px] p-6 sm:p-11">
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
          </Card>
        </div>

        <p className="text-[13px] text-suave">
          © 2026 Aluguel de Carros. Todos os direitos reservados.
        </p>
      </section>

      <section className="hidden items-center bg-linear-to-br from-marca-600 to-marca-800 p-16 text-white lg:flex">
        <div className="flex max-w-[540px] flex-col items-start gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-2 text-sm font-medium">
            <Check size={16} /> Gestão rápida e transparente
          </span>
          <h2 className="text-[44px] leading-[1.1] font-bold tracking-tight">
            Seu próximo carro começa com um pedido.
          </h2>
          <p className="text-[17px] leading-relaxed text-white/80">
            Acompanhe cada etapa, organize seus dados e receba análises com total clareza.
          </p>
        </div>
      </section>
    </div>
  );
}