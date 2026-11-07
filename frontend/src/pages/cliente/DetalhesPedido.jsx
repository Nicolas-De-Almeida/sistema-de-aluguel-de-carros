import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Car, Check, FileText, Pencil, X } from "lucide-react";
import BadgeStatus from "../../components/BadgeStatus";
import Botao from "../../components/Botao";
import BotaoLink from "../../components/BotaoLink";
import Card from "../../components/Card";
import LayoutLogado from "../../components/LayoutLogado";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import Secao from "../../components/SecaoFormulario";
import { pedidoService } from "../../services/pedidoService";
import { formatarData, numeroBR } from "../../utils/formatadores";
import { rotuloProprietario } from "../../utils/rotulos";
import Dado from "../../components/Dado";

function Etapa({ titulo, descricao, estado, ultima }) {
    const cores = {
        feito: "bg-sucesso text-white",
        atual: "bg-marca-600 text-white",
        pendente: "bg-gray-200 text-gray-400",
        erro: "bg-perigo text-white",
    };

    return (
        <li className="flex gap-3">
            <div className="flex flex-col items-center">
                <span className={`grid size-7 place-items-center rounded-full ${cores[estado]}`}>
                {estado === "feito" ? (
                    <Check size={14} />
                ) : estado === "erro" ? (
                    <X size={14} />
                ) : (
                    <span className="size-2 rounded-full bg-current" />
                )}
                </span>
                {!ultima && <span className="my-1 w-px flex-1 bg-borda" />}
            </div>
            <div className="pb-6">
                <p className="text-sm font-semibold">{titulo}</p>
                <p className="text-[13px] text-suave">{descricao}</p>
            </div>
        </li>
    );
    }

    function montarEtapas(pedido) {
    const etapas = [
        { titulo: "Pedido enviado", descricao: formatarData(pedido.dataCriacao), estado: "feito" },
    ];

    if (pedido.status === "CANCELADO") {
        etapas.push({
        titulo: "Pedido cancelado",
        descricao: "Você cancelou este pedido",
        estado: "erro",
        });
        return etapas;
    }

    const decidido = pedido.status === "APROVADO" || pedido.status === "REJEITADO";
    const aprovado = pedido.status === "APROVADO";

    etapas.push({
        titulo: "Análise financeira",
        descricao: decidido ? "Concluída" : "Aguardando um agente",
        estado: decidido ? "feito" : "atual",
    });
    etapas.push({
        titulo: decidido ? (aprovado ? "Pedido aprovado" : "Pedido rejeitado") : "Resultado",
        descricao: decidido ? formatarData(pedido.dataAvaliacao) : "Aguardando decisão",
        estado: !decidido ? "pendente" : aprovado ? "feito" : "erro",
    });
    return etapas;
    }

    export default function DetalhesPedido() {
    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [confirmando, setConfirmando] = useState(false);
    const [cancelando, setCancelando] = useState(false);

    useEffect(() => {
        pedidoService
        .buscar(id)
        .then(setPedido)
        .catch((e) => setErro(e.message))
        .finally(() => setCarregando(false));
    }, [id]);

    async function cancelar() {
        setCancelando(true);
        try {
        setPedido(await pedidoService.cancelar(id));
        setConfirmando(false);
        } catch (e) {
        setConfirmando(false);
        setErro(e.message);
        } finally {
        setCancelando(false);
        }
    }

    return (
        <LayoutLogado titulo="Detalhes do Pedido">
            <Link to="/cliente/pedidos" className="mb-4 inline-flex items-center gap-2 text-sm text-suave hover:text-texto">
                <ArrowLeft size={16} /> Voltar para pedidos
            </Link>

            {erro && (
                <p role="alert" className="mb-4 rounded-[10px] bg-perigo-fundo px-4 py-3 text-sm text-perigo">
                {erro}
                </p>
            )}

            {carregando && (
                <Card>
                <p className="text-suave">Carregando o pedido...</p>
                </Card>
            )}

            {pedido && (
                <>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-[13px] font-bold tracking-[0.12em] text-marca-600 uppercase">
                            Pedido #{pedido.numero}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                            <h1 className="text-[28px] font-bold tracking-tight">Detalhes do Pedido</h1>
                            <BadgeStatus status={pedido.status} />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {pedido.podeSerEditado && (
                            <BotaoLink to={`/cliente/pedidos/${pedido.id}/editar`} variante="secundario">
                            <Pencil size={16} /> Editar pedido
                            </BotaoLink>
                        )}
                        {pedido.podeSerCancelado && (
                            <Botao variante="perigo" onClick={() => setConfirmando(true)}>
                            <X size={16} /> Cancelar pedido
                            </Botao>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                    <div className="flex flex-col gap-6">
                        <Card className="overflow-hidden p-0">
                            <Secao icone={Car} titulo="Automóvel" descricao="Veículo vinculado ao pedido.">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <Dado
                                    rotulo="Veículo"
                                    valor={`${pedido.automovel.marca} ${pedido.automovel.modelo}`}
                                    />
                                    <Dado rotulo="Ano" valor={pedido.automovel.ano} />
                                    <Dado rotulo="Placa" valor={pedido.automovel.placa} />
                                    <Dado rotulo="Matrícula" valor={pedido.automovel.matricula} />
                                    <Dado
                                    rotulo="Proprietário"
                                    valor={rotuloProprietario(pedido.automovel.proprietario)}
                                    />
                                </div>
                            </Secao>
                        </Card>

                        <Card className="overflow-hidden p-0">
                            <Secao
                            icone={FileText}
                            titulo="Contrato de crédito"
                            descricao="Financiamento vinculado a este pedido."
                            >
                            {!pedido.associarCredito ? (
                                <p className="text-suave">Este pedido não está associado a um contrato de crédito.</p>
                            ) : pedido.contratoCredito ? (
                                <div className="grid gap-6 sm:grid-cols-3">
                                <Dado rotulo="Valor financiado" valor={`R$ ${numeroBR(pedido.contratoCredito.valorFinanciado)}`}/>
                                <Dado rotulo="Parcelas" valor={`${pedido.contratoCredito.numeroParcelas}x`}/>
                                <Dado rotulo="Banco" valor={pedido.contratoCredito.banco} />
                                </div>
                            ) : (
                                <p className="text-suave">
                                    Aguardando o banco definir as condições do financiamento.
                                </p>
                            )}
                            </Secao>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <h2 className="mb-5 font-bold">Acompanhamento</h2>
                            <ol>
                                {montarEtapas(pedido).map((etapa, i, lista) => (
                                    <Etapa key={etapa.titulo} {...etapa} ultima={i === lista.length - 1} />
                                ))}
                            </ol>
                        </Card>

                        <Card>
                            <h2 className="mb-3 font-bold">Parecer do agente</h2>
                            {pedido.parecer ? (
                            <>
                                <p className="leading-relaxed whitespace-pre-line">{pedido.parecer}</p>
                                <p className="mt-3 text-[13px] text-suave">
                                {pedido.avaliadoPor} · {formatarData(pedido.dataAvaliacao)}
                                </p>
                            </>
                            ) : (
                            <p className="text-suave">Ainda não há parecer para este pedido.</p>
                            )}
                        </Card>
                    </div>
                </div>
                </>
            )}

            <ModalConfirmacao
                aberto={confirmando}
                titulo="Cancelar pedido?"
                texto="O pedido será cancelado e não poderá ser reativado. Ele continuará no seu histórico."
                rotuloConfirmar="Cancelar pedido"
                rotuloCancelar="Voltar"
                onConfirmar={cancelar}
                onCancelar={() => setConfirmando(false)}
                carregando={cancelando}/>
        </LayoutLogado>
    );
}