import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { Check, ChevronRight, Clock, FileText } from "lucide-react";
import Avatar from "../../components/Avatar";
import BadgeStatus from "../../components/BadgeStatus";
import CabecalhoPagina from "../../components/CabecalhoPagina";
import CartaoResumo from "../../components/CartaoResumo";
import Card from "../../components/Card";
import LayoutLogado from "../../components/LayoutLogado";
import { analiseService } from "../../services/analiseService";
import { formatarData } from "../../utils/formatadores";

const FILTROS = [
  { valor: "TODOS", rotulo: "Todos" },
  { valor: "EM_ANALISE", rotulo: "Em análise" },
  { valor: "APROVADO", rotulo: "Aprovado" },
  { valor: "REJEITADO", rotulo: "Rejeitado" },
  { valor: "CANCELADO", rotulo: "Cancelado" },
];

const ACOES = {
  EM_ANALISE: "Avaliar",
  APROVADO: "Ver parecer",
  REJEITADO: "Ver parecer",
  CANCELADO: "Ver detalhes",
};

function mesAtual() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
}

export default function PedidosAgente() {
  const { state } = useLocation();
  const [analises, setAnalises] = useState([]);
  const [filtro, setFiltro] = useState("TODOS");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    analiseService
      .listar()
      .then(setAnalises)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  const filtradas = useMemo(
    () => (filtro === "TODOS" ? analises : analises.filter((a) => a.pedido.status === filtro)),
    [analises, filtro]
  );

  const aguardando = analises.filter((a) => a.pedido.status === "EM_ANALISE").length;
  const aprovadosNoMes = analises.filter(
    (a) => a.pedido.status === "APROVADO" && a.pedido.dataAvaliacao?.startsWith(mesAtual())
  ).length;
  const totalAnalisado = analises.filter((a) =>
    ["APROVADO", "REJEITADO"].includes(a.pedido.status)
  ).length;

  return (
    <LayoutLogado titulo="Pedidos para Análise">
      <CabecalhoPagina titulo="Pedidos para Análise" descricao="Avalie solicitações de aluguel e emita seu parecer financeiro."/>

      {state?.aviso && (
        <p role="status" className="mb-4 flex items-center gap-2 rounded-[10px] bg-sucesso-fundo px-4 py-3 text-sm font-medium text-sucesso">
          <Check size={16} /> {state.aviso}
        </p>
      )}
      {erro && (
        <p role="alert" className="mb-4 rounded-[10px] bg-perigo-fundo px-4 py-3 text-sm text-perigo">
          {erro}
        </p>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <CartaoResumo icone={Clock} cor="amarelo" rotulo="Aguardando análise" valor={aguardando} />
        <CartaoResumo icone={Check} cor="verde" rotulo="Aprovados este mês" valor={aprovadosNoMes} />
        <CartaoResumo icone={FileText} rotulo="Total analisado" valor={totalAnalisado} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-borda px-6 py-5">
          <div>
            <h2 className="font-bold">Solicitações recentes</h2>
            <p className="text-sm text-suave">Pedidos enviados pelos clientes.</p>
          </div>
          <label className="flex items-center gap-3 text-sm text-suave">
            Status
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="h-10 rounded-lg border border-borda bg-white px-3 text-sm text-texto focus:border-marca-600 focus:ring-2 focus:ring-marca-600/30 focus:outline-none">
              {FILTROS.map((f) => (
                <option key={f.valor} value={f.valor}>
                  {f.rotulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        {carregando ? (
          <p className="p-6 text-suave">Carregando pedidos...</p>
        ) : analises.length === 0 ? (
          <p className="p-6 text-suave">Nenhum pedido foi enviado ainda.</p>
        ) : filtradas.length === 0 ? (
          <p className="p-6 text-suave">Nenhum pedido com esse status.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-fundo text-[13px] tracking-wide text-suave uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nº do pedido</th>
                  <th className="px-6 py-3 font-semibold">Cliente</th>
                  <th className="px-6 py-3 font-semibold">Automóvel</th>
                  <th className="px-6 py-3 font-semibold">Data</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map(({ pedido, cliente }) => (
                  <tr key={pedido.id} className="border-t border-borda">
                    <td className="px-6 py-4">
                      <Link to={`/agente/pedidos/${pedido.id}`} className="font-semibold text-marca-600 hover:underline">
                        #{pedido.numero}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar nome={cliente.nome} />
                        <div className="leading-tight">
                          <p className="font-semibold">{cliente.nome}</p>
                          <p className="text-[13px] text-suave">{cliente.cpf}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {pedido.automovel.marca} {pedido.automovel.modelo}
                    </td>
                    <td className="px-6 py-4 text-suave">{formatarData(pedido.dataCriacao)}</td>
                    <td className="px-6 py-4">
                      <BadgeStatus status={pedido.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/agente/pedidos/${pedido.id}`} className="inline-flex items-center gap-1 rounded-lg border border-marca-600 px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-marca-600 hover:bg-marca-50">
                        {ACOES[pedido.status]} <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!carregando && analises.length > 0 && (
          <p className="border-t border-borda px-6 py-3 text-[13px] text-suave">
            Mostrando {filtradas.length} de {analises.length} pedidos
          </p>
        )}
      </Card>
    </LayoutLogado>
  );
}