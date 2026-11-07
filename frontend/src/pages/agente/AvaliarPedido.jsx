import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Building2, Car, Check, FileText, Info, User, X } from "lucide-react";
import Avatar from "../../components/Avatar";
import AreaTexto from "../../components/AreaTexto";
import BadgeStatus from "../../components/BadgeStatus";
import Botao from "../../components/Botao";
import CampoMoeda from "../../components/CampoMoeda";
import Card from "../../components/Card";
import Dado from "../../components/Dado";
import LayoutLogado from "../../components/LayoutLogado";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import Secao from "../../components/SecaoFormulario";
import Selecao from "../../components/Selecao";
import { analiseService } from "../../services/analiseService";
import { formatarData, lerMoeda, numeroBR } from "../../utils/formatadores";
import { rotuloProprietario } from "../../utils/rotulos";

const PARCELAS = [12, 24, 36, 48, 60].map((n) => ({
    valor: String(n),
    rotulo: `${n} parcelas`,
}));

const TEXTOS_DECISAO = {
    APROVAR: {
        titulo: "Aprovar pedido?",
        rotulo: "Aprovar pedido",
        variante: "sucesso",
        verbo: "aprovado",
    },
    REJEITAR: {
        titulo: "Rejeitar pedido?",
        rotulo: "Rejeitar pedido",
        variante: "perigo",
        verbo: "rejeitado",
    },
};

function mesAno(iso) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });
}

export default function AvaliarPedido() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [analise, setAnalise] = useState(null);
    const [parecer, setParecer] = useState("");
    const [valor, setValor] = useState("");
    const [parcelas, setParcelas] = useState("36");
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [decisao, setDecisao] = useState(null);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        analiseService
        .buscar(id)
        .then(setAnalise)
        .catch((e) => setErroGeral(e.message))
        .finally(() => setCarregando(false));
    }, [id]);

    function pedirConfirmacao(escolha) {
        const novos = {};
        if (!parecer.trim()) {
        novos.parecer = "Registre o parecer antes de decidir";
        }
        if (escolha === "APROVAR" && analise.precisaCredito) {
        const numero = lerMoeda(valor);
        if (numero === null || numero <= 0) {
            novos.valor = "Informe o valor financiado";
        }
        }
        setErros(novos);
        setErroGeral("");
        if (Object.keys(novos).length === 0) {
        setDecisao(escolha);
        }
    }

    async function confirmar() {
        setEnviando(true);
        const comCredito = decisao === "APROVAR" && analise.precisaCredito;

        try {
        await analiseService.avaliar(id, {
            decisao,
            parecer,
            valorFinanciado: comCredito ? lerMoeda(valor) : null,
            numeroParcelas: comCredito ? Number(parcelas) : null,
        });
        navigate("/agente/pedidos", {
            state: {
            aviso: `Pedido #${analise.pedido.numero} ${TEXTOS_DECISAO[decisao].verbo} com sucesso.`,
            },
        });
        } catch (e) {
        setDecisao(null);
        const campos = e.campos ?? {};
        if (Object.keys(campos).length > 0) {
            setErros({ parecer: campos.parecer, valor: campos.valorFinanciado });
        } else {
            setErroGeral(e.message);
        }
        } finally {
        setEnviando(false);
        }
    }

    const pedido = analise?.pedido;
    const cliente = analise?.cliente;
    const titulo = analise?.podeAvaliar ? "Avaliar Pedido" : "Detalhes do Pedido";

    return (
        <LayoutLogado titulo={titulo}>
            <Link to="/agente/pedidos" className="mb-4 inline-flex items-center gap-2 text-sm text-suave hover:text-texto">
                <ArrowLeft size={16} /> Voltar para solicitações
            </Link>

            {erroGeral && (
                <p role="alert" className="mb-4 rounded-[10px] bg-perigo-fundo px-4 py-3 text-sm text-perigo">
                {erroGeral}
                </p>
            )}

            {carregando && (
                <Card>
                <p className="text-suave">Carregando o pedido...</p>
                </Card>
            )}

            {analise && (
                <>
                <div className="mb-6">
                    <p className="text-[13px] font-bold tracking-[0.12em] text-marca-600 uppercase">
                        Pedido #{pedido.numero}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                        <h1 className="text-[28px] font-bold tracking-tight">{titulo}</h1>
                        <BadgeStatus status={pedido.status} />
                    </div>
                    {analise.podeAvaliar && (
                    <p className="mt-1 text-suave">Analise as informações e registre seu parecer.</p>
                    )}
                </div>

                <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                    <div className="flex flex-col gap-6">
                        <Card className="overflow-hidden p-0">
                            <Secao icone={User} titulo="Dados do cliente" descricao="Informações pessoais e profissionais.">
                                <div className="mb-6 flex items-center gap-3 rounded-xl border border-borda bg-fundo p-4">
                                    <Avatar nome={cliente.nome} />
                                    <div className="leading-tight">
                                        <p className="font-semibold">{cliente.nome}</p>
                                        <p className="text-sm text-suave">
                                            Cliente desde {mesAno(cliente.clienteDesde)}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-3">
                                    <Dado rotulo="CPF" valor={cliente.cpf} />
                                    <Dado rotulo="RG" valor={cliente.rg} />
                                    <Dado rotulo="Profissão" valor={cliente.profissao} />
                                </div>
                                <div className="mt-6">
                                    <Dado rotulo="Endereço" valor={cliente.endereco} />
                                </div>
                            </Secao>
                        </Card>

                        <Card className="overflow-hidden p-0">
                            <Secao icone={Building2} titulo="Renda e empregadores" descricao="Fontes de renda declaradas pelo cliente.">
                                {cliente.rendimentos.length === 0 ? (
                                    <p className="text-suave">O cliente não informou empregadores.</p>
                                ) : (
                                    <ul className="flex flex-col gap-2">
                                        {cliente.rendimentos.map((r, i) => (
                                            <li key={i} className="flex items-center justify-between gap-4 rounded-lg border border-borda bg-fundo px-4 py-3" >
                                                <span className="flex items-center gap-3 font-semibold">
                                                    <span className="grid size-6 place-items-center rounded-full bg-marca-50 text-xs font-bold text-marca-600">
                                                    {i + 1}
                                                    </span>
                                                    {r.entidadeEmpregadora}
                                                </span>
                                                <span className="font-semibold">R$ {numeroBR(r.valor)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="mt-3 flex items-center justify-between rounded-lg bg-sucesso-fundo px-4 py-3 font-semibold text-sucesso">
                                    <span>Renda mensal total</span>
                                    <span>R$ {numeroBR(cliente.rendaTotal)}</span>
                                </div>
                            </Secao>
                        </Card>

                        <Card className="overflow-hidden p-0">
                            <Secao icone={Car} titulo="Automóvel" descricao="Veículo vinculado ao pedido.">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <Dado rotulo="Veículo" valor={`${pedido.automovel.marca} ${pedido.automovel.modelo}`}/>
                                    <Dado rotulo="Ano" valor={pedido.automovel.ano} />
                                    <Dado rotulo="Placa" valor={pedido.automovel.placa} />
                                    <Dado rotulo="Matrícula" valor={pedido.automovel.matricula} />
                                    <Dado rotulo="Proprietário"valor={rotuloProprietario(pedido.automovel.proprietario)}/>
                                </div>
                            </Secao>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                    {analise.podeAvaliar ? (
                        <Card className="overflow-hidden p-0">
                            <Secao icone={FileText} titulo="Parecer financeiro" descricao="Registre a decisão desta análise.">
                                <div className="flex flex-col gap-5">
                                    <AreaTexto
                                        id="parecer"
                                        rotulo="Observações da análise"
                                        placeholder="Descreva os critérios considerados, restrições ou condições para a decisão."
                                        maxLength={1000}
                                        value={parecer}
                                        onChange={(e) => setParecer(e.target.value)}
                                        erro={erros.parecer}/>

                                    {analise.precisaCredito && (
                                        <div className="flex flex-col gap-4 border-t border-borda pt-5">
                                        <div>
                                            <p className="font-semibold">Contrato de crédito</p>
                                            <p className="text-sm text-suave">Condições propostas pelo banco.</p>
                                        </div>
                                        <CampoMoeda
                                            id="valorFinanciado"
                                            rotulo="Valor financiado"
                                            placeholder="0,00"
                                            value={valor}
                                            onChange={(e) => setValor(e.target.value)}
                                            erro={erros.valor}/>
                                        <Selecao
                                            id="parcelas"
                                            rotulo="Número de parcelas"
                                            opcoes={PARCELAS}
                                            value={parcelas}
                                            onChange={(e) => setParcelas(e.target.value)}/>
                                        </div>
                                    )}

                                    {pedido.associarCredito && !analise.podeAprovar && (
                                        <p className="flex gap-2 rounded-[10px] bg-marca-50 px-4 py-3 text-sm text-marca-700">
                                            <Info size={16} className="mt-0.5 shrink-0" />
                                            Este pedido tem contrato de crédito. Somente um banco pode aprová-lo, mas
                                            você pode rejeitá-lo.
                                        </p>
                                    )}

                                    <p className="flex gap-2 rounded-[10px] bg-aviso-fundo px-4 py-3 text-sm text-aviso">
                                        <Info size={16} className="mt-0.5 shrink-0" />
                                        Após confirmar, a decisão será enviada ao cliente e não poderá ser alterada.
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Botao variante="perigoSuave" onClick={() => pedirConfirmacao("REJEITAR")}>
                                        <X size={16} /> Rejeitar
                                        </Botao>
                                        <Botao variante="sucesso" disabled={!analise.podeAprovar} onClick={() => pedirConfirmacao("APROVAR")}>
                                            <Check size={16} /> Aprovar
                                        </Botao>
                                    </div>
                                </div>
                            </Secao>
                        </Card>
                    ) : (
                        <>
                        <Card>
                            <h2 className="mb-3 font-bold">Parecer financeiro</h2>
                            {pedido.parecer ? (
                            <>
                                <p className="leading-relaxed whitespace-pre-line">{pedido.parecer}</p>
                                <p className="mt-3 text-[13px] text-suave">
                                {pedido.avaliadoPor} · {formatarData(pedido.dataAvaliacao)}
                                </p>
                            </>
                            ) : (
                            <p className="text-suave">
                                Este pedido foi cancelado pelo cliente antes de ser analisado.
                            </p>
                            )}
                        </Card>

                        {pedido.contratoCredito && (
                            <Card>
                                <h2 className="mb-4 font-bold">Contrato de crédito</h2>
                                <div className="flex flex-col gap-4">
                                    <Dado rotulo="Valor financiado" valor={`R$ ${numeroBR(pedido.contratoCredito.valorFinanciado)}`}/>
                                    <Dado rotulo="Parcelas" valor={`${pedido.contratoCredito.numeroParcelas}x`} />
                                    <Dado rotulo="Banco" valor={pedido.contratoCredito.banco} />
                                </div>
                            </Card>
                        )}
                        </>
                    )}
                    </div>
                </div>
                </>
            )}

            <ModalConfirmacao
                aberto={Boolean(decisao)}
                titulo={decisao ? TEXTOS_DECISAO[decisao].titulo : ""}
                texto={`O pedido #${pedido?.numero} será ${
                decisao ? TEXTOS_DECISAO[decisao].verbo : ""
                } e o cliente receberá o parecer. A decisão não poderá ser alterada.`}
                rotuloConfirmar={decisao ? TEXTOS_DECISAO[decisao].rotulo : ""}
                rotuloCancelar="Voltar"
                varianteConfirmar={decisao ? TEXTOS_DECISAO[decisao].variante : "perigo"}
                onConfirmar={confirmar}
                onCancelar={() => setDecisao(null)}
                carregando={enviando}/>
        </LayoutLogado>
    );
}