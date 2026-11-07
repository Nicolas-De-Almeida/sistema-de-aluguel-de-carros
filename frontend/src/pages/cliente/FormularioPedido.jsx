import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Car, Check, FileText, Info } from "lucide-react";
import Botao from "../../components/Botao";
import BotaoLink from "../../components/BotaoLink";
import CabecalhoPagina from "../../components/CabecalhoPagina";
import Campo from "../../components/Campo";
import CampoMoeda from "../../components/CampoMoeda";
import Card from "../../components/Card";
import LayoutLogado from "../../components/LayoutLogado";
import Secao from "../../components/SecaoFormulario";
import Selecao from "../../components/Selecao";
import { clienteService } from "../../services/clienteService";
import { pedidoService } from "../../services/pedidoService";
import { lerMoeda, mascararPlaca, numeroBR } from "../../utils/formatadores";
import { PROPRIETARIOS } from "../../utils/rotulos";

const FORM_VAZIO = {
    matricula: "",
    placa: "",
    ano: "",
    marca: "",
    modelo: "",
    valor: "",
    proprietario: "CLIENTE",
    associarCredito: false,
};

export default function FormularioPedido() {
    const { id } = useParams();
    const editando = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState(FORM_VAZIO);
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState("");
    const [bloqueio, setBloqueio] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        async function carregar() {
        try {
            if (editando) {
            const pedido = await pedidoService.buscar(id);
            if (!pedido.podeSerEditado) {
                setBloqueio("Apenas pedidos em análise podem ser editados.");
                return;
            }
            const a = pedido.automovel;
            setForm({
                matricula: a.matricula,
                placa: a.placa,
                ano: String(a.ano),
                marca: a.marca,
                modelo: a.modelo,
                valor: a.valor != null ? numeroBR(a.valor) : "",
                proprietario: a.proprietario,
                associarCredito: pedido.associarCredito,
            });
            } else {
            const cliente = await clienteService.buscar();
            const completo =
                cliente.rg &&
                cliente.cpf &&
                cliente.endereco &&
                cliente.profissao &&
                cliente.scoreCredito != null &&
                cliente.rendimentos.length > 0;
            if (!completo) {
                setBloqueio(
                "Antes de criar um pedido, complete seus dados pessoais, informe seu score de crédito e ao menos um empregador."
                );
            }
            }
        } catch (e) {
            setErroGeral(e.message);
        } finally {
            setCarregando(false);
        }
        }
        carregar();
    }, [id, editando]);

    function alterar(evento) {
        const { name, value, type, checked } = evento.target;
        let novo = type === "checkbox" ? checked : value;
        if (name === "placa") {
        novo = mascararPlaca(value);
        }
        if (name === "ano") {
        novo = value.replace(/\D/g, "").slice(0, 4);
        }
        setForm({ ...form, [name]: novo });
    }

    async function salvar(evento) {
        evento.preventDefault();
        setErros({});
        setErroGeral("");
        setSalvando(true);

        const corpo = {
        automovel: {
            matricula: form.matricula,
            placa: form.placa,
            ano: form.ano === "" ? null : Number(form.ano),
            marca: form.marca,
            modelo: form.modelo,
            valor: lerMoeda(form.valor),
            proprietario: form.proprietario,
        },
        associarCredito: form.associarCredito,
        };

        try {
        const salvo = editando
            ? await pedidoService.atualizar(id, corpo)
            : await pedidoService.criar(corpo);
        navigate(`/cliente/pedidos/${salvo.id}`);
        } catch (e) {
        // O back-end devolve "automovel.placa"; a tela usa só "placa"
        const campos = {};
        Object.entries(e.campos ?? {}).forEach(([campo, mensagem]) => {
            campos[campo.replace("automovel.", "")] = mensagem;
        });
        if (Object.keys(campos).length > 0) {
            setErros(campos);
        } else {
            setErroGeral(e.message);
        }
        } finally {
        setSalvando(false);
        }
    }

    const titulo = editando ? "Editar Pedido" : "Novo Pedido";
    const voltarPara = editando ? `/cliente/pedidos/${id}` : "/cliente/pedidos";

    return (
        <LayoutLogado titulo={titulo}>
            <CabecalhoPagina titulo={titulo} descricao="Preencha os dados do automóvel e do contrato."/>

            {erroGeral && (
                <p role="alert" className="mb-4 rounded-[10px] bg-perigo-fundo px-4 py-3 text-sm text-perigo">
                {erroGeral}
                </p>
            )}

            {carregando ? (
                <Card>
                <p className="text-suave">Carregando...</p>
                </Card>
            ) : bloqueio ? (
                <Card className="flex flex-col items-start gap-4 p-7">
                <p className="flex items-center gap-2 font-semibold">
                    <Info size={18} className="text-aviso" /> {bloqueio}
                </p>
                <BotaoLink to={editando ? voltarPara : "/cliente/dados"}>
                    {editando ? "Voltar ao pedido" : "Completar meus dados"}
                </BotaoLink>
                </Card>
            ) : (
                <Card className="overflow-hidden p-0">
                    <form onSubmit={salvar}>
                        <Secao icone={Car} titulo="Automóvel" descricao="Informe os dados de identificação do veículo.">
                            <div className="grid gap-5 md:grid-cols-3">
                                <Campo
                                id="matricula"
                                rotulo="Matrícula"
                                placeholder="Ex.: 202501234"
                                value={form.matricula}
                                onChange={alterar}
                                erro={erros.matricula}/>

                                <Campo
                                id="placa"
                                rotulo="Placa"
                                placeholder="ABC-1D23"
                                value={form.placa}
                                onChange={alterar}
                                erro={erros.placa}/>

                                <Campo
                                id="ano"
                                rotulo="Ano"
                                placeholder="2024"
                                inputMode="numeric"
                                value={form.ano}
                                onChange={alterar}
                                erro={erros.ano}/>

                                <Campo
                                id="marca"
                                rotulo="Marca"
                                placeholder="Ex.: Toyota"
                                value={form.marca}
                                onChange={alterar}
                                erro={erros.marca}/>

                                <Campo
                                id="modelo"
                                rotulo="Modelo"
                                placeholder="Ex.: Corolla XEi 2.0"
                                value={form.modelo}
                                onChange={alterar}
                                erro={erros.modelo}/>

                                <CampoMoeda
                                id="valor"
                                rotulo="Valor do veículo"
                                placeholder="0,00"
                                value={form.valor}
                                onChange={alterar}
                                erro={erros.valor}/>

                            </div>
                        </Secao>

                        <Secao icone={FileText} titulo="Contrato" descricao="Defina o proprietário e o vínculo financeiro.">
                            <div className="grid items-end gap-5 md:grid-cols-2">
                                <Selecao
                                id="proprietario"
                                rotulo="Proprietário do automóvel"
                                opcoes={PROPRIETARIOS}
                                value={form.proprietario}
                                onChange={alterar}
                                erro={erros.proprietario}/>
                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-borda bg-fundo p-4">
                                <input
                                    type="checkbox"
                                    name="associarCredito"
                                    checked={form.associarCredito}
                                    onChange={alterar}
                                    className="mt-1 size-4 accent-marca-600"/>
                                <span>
                                    <span className="block text-sm font-semibold">
                                    Associar a contrato de crédito
                                    </span>
                                    <span className="block text-sm text-suave">
                                    O pedido será enviado para análise bancária.
                                    </span>
                                </span>
                                </label>
                            </div>

                            {form.associarCredito && (
                                <p className="mt-4 flex items-center gap-2 rounded-[10px] bg-marca-50 px-4 py-3 text-sm text-marca-700">
                                <Info size={16} className="shrink-0" />
                                    Os dados de financiamento serão definidos pelo banco após a análise do pedido.
                                </p>
                            )}
                        </Secao>

                        <div className="flex justify-end gap-3 bg-fundo px-6 py-5 lg:px-8">
                            <BotaoLink to={voltarPara} variante="secundario">
                                Cancelar
                            </BotaoLink>
                            <Botao disabled={salvando}>
                                <Check size={18} /> {salvando ? "Salvando..." : "Salvar pedido"}
                            </Botao>
                        </div>
                    </form>
                </Card>
            )}
        </LayoutLogado>
    );
}