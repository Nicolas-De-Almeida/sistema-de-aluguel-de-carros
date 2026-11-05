import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Car, Check, Clock, Eye, FileText, Pencil, Plus, Search, X } from "lucide-react";
import BadgeStatus from "../../components/BadgeStatus";
import BotaoLink from "../../components/BotaoLink";
import CabecalhoPagina from "../../components/CabecalhoPagina";
import CartaoResumo from "../../components/CartaoResumo";
import Card from "../../components/Card";
import LayoutLogado from "../../components/LayoutLogado";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import { pedidoService } from "../../services/pedidoService";
import { formatarData } from "../../utils/formatadores";

const TONS = {
  neutro: "border-borda text-suave hover:bg-fundo",
  azul: "border-marca-50 bg-marca-50 text-marca-600 hover:bg-blue-100",
  perigo: "border-red-200 text-perigo hover:bg-perigo-fundo",
};

function AcaoIcone({ icone: Icone, rotulo, tom = "neutro", to, onClick, desabilitado }) {
  const base = "grid size-8 place-items-center rounded-md border transition-colors";

  if (desabilitado) {
    return (
      <span aria-disabled="true" title={`${rotulo} indisponível`} className={`${base} cursor-not-allowed border-borda text-gray-300`}>
        <Icone size={15} />
      </span>
    );
  }

  const classes = `${base} ${TONS[tom]}`;

  return to ? (
    <Link to={to} aria-label={rotulo} title={rotulo} className={classes}>
      <Icone size={15} />
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`${classes} cursor-pointer`}>
      <Icone size={15} />
    </button>
  );
}

export default function PedidosCliente() {
  const [pedidos, setPedidos] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [paraCancelar, setParaCancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  useEffect(() => {
    pedidoService
      .listar()
      .then(setPedidos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      return pedidos;
    }
    return pedidos.filter((p) =>
      [p.numero, p.automovel.marca, p.automovel.modelo, p.automovel.placa]
        .join(" ")
        .toLowerCase()
        .includes(termo)
    );
  }, [pedidos, busca]);

  async function confirmarCancelamento() {
    setCancelando(true);
    try {
      const atualizado = await pedidoService.cancelar(paraCancelar.id);
      setPedidos(pedidos.map((p) => (p.id === atualizado.id ? atualizado : p)));
      setParaCancelar(null);
    } catch (e) {
      setParaCancelar(null);
      setErro(e.message);
    } finally {
      setCancelando(false);
    }
  }

  const emAnalise = pedidos.filter((p) => p.status === "EM_ANALISE").length;
  const aprovados = pedidos.filter((p) => p.status === "APROVADO").length;

  return (
    <LayoutLogado titulo="Meus Pedidos">
      <CabecalhoPagina titulo="Meus Pedidos" descricao="Acompanhe e gerencie suas solicitações de aluguel.">
        <BotaoLink to="/cliente/pedidos/novo">
          <Plus size={18}/> Novo Pedido
        </BotaoLink>
      </CabecalhoPagina>

      {erro && (
        <p role="alert" className="mb-4 rounded-[10px] bg-perigo-fundo px-4 py-3 text-sm text-perigo">
          {erro}
        </p>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <CartaoResumo icone={FileText} rotulo="Total de pedidos" valor={pedidos.length} />
        <CartaoResumo icone={Clock} cor="amarelo" rotulo="Em análise" valor={emAnalise} />
        <CartaoResumo icone={Check} cor="verde" rotulo="Aprovados" valor={aprovados} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-borda px-6 py-5">
          <div>
            <h2 className="font-bold">Histórico de pedidos</h2>
            <p className="text-sm text-suave">Todos os pedidos enviados por você.</p>
          </div>
          <div className="relative">
            <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-suave" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar pedido..."
              aria-label="Buscar pedido"
              className="h-10 w-64 rounded-lg border border-borda pr-3 pl-9 text-sm focus:border-marca-600 focus:ring-2 focus:ring-marca-600/30 focus:outline-none"/>
          </div>
        </div>

        {carregando ? (
          <p className="p-6 text-suave">Carregando seus pedidos...</p>
        ) : pedidos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-marca-50 text-marca-600">
              <Car size={26} />
            </span>
            <p className="font-semibold">Você ainda não tem pedidos</p>
            <p className="text-sm text-suave">Crie o primeiro para acompanhar o status por aqui.</p>
            <BotaoLink to="/cliente/pedidos/novo" className="mt-2">
              <Plus size={18} /> Novo Pedido
            </BotaoLink>
          </div>
        ) : filtrados.length === 0 ? (
          <p className="p-6 text-suave">Nenhum pedido encontrado para essa busca.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-fundo text-[13px] tracking-wide text-suave uppercase">
                <tr>
                  <th className="px-6 py-3 font-semibold">Nº do pedido</th>
                  <th className="px-6 py-3 font-semibold">Automóvel</th>
                  <th className="px-6 py-3 font-semibold">Data</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p.id} className="border-t border-borda">
                    <td className="px-6 py-4">
                      <Link
                        to={`/cliente/pedidos/${p.id}`}
                        className="font-semibold text-marca-600 hover:underline">
                        #{p.numero}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-lg bg-marca-50 text-marca-600">
                          <Car size={16} />
                        </span>
                        <div className="leading-tight">
                          <p className="font-semibold">
                            {p.automovel.marca} {p.automovel.modelo}
                          </p>
                          <p className="text-[13px] text-suave">{p.automovel.placa}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-suave">{formatarData(p.dataCriacao)}</td>
                    <td className="px-6 py-4">
                      <BadgeStatus status={p.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <AcaoIcone
                          icone={Eye}
                          tom="azul"
                          rotulo="Ver detalhes"
                          to={`/cliente/pedidos/${p.id}`}/>
                        <AcaoIcone
                          icone={Pencil}
                          rotulo="Editar"
                          to={`/cliente/pedidos/${p.id}/editar`}
                          desabilitado={!p.podeSerEditado}/>
                        <AcaoIcone
                          icone={X}
                          tom="perigo"
                          rotulo="Cancelar"
                          onClick={() => setParaCancelar(p)}
                          desabilitado={!p.podeSerCancelado}/>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!carregando && pedidos.length > 0 && (
          <p className="border-t border-borda px-6 py-3 text-[13px] text-suave">
            Mostrando {filtrados.length} de {pedidos.length} pedidos
          </p>
        )}
      </Card>

      <ModalConfirmacao
        aberto={Boolean(paraCancelar)}
        titulo="Cancelar pedido?"
        texto={`O pedido #${paraCancelar?.numero} será cancelado e não poderá ser reativado. Ele continuará no seu histórico.`}
        rotuloConfirmar="Cancelar pedido"
        rotuloCancelar="Voltar"
        onConfirmar={confirmarCancelamento}
        onCancelar={() => setParaCancelar(null)}
        carregando={cancelando}/>
    </LayoutLogado>
  );
}