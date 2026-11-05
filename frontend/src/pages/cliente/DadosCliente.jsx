import { useEffect, useState } from "react";
import { Building2, Check, Plus, Trash2, User } from "lucide-react";
import Botao from "../../components/Botao";
import CabecalhoPagina from "../../components/CabecalhoPagina";
import Campo from "../../components/Campo";
import CampoMoeda from "../../components/CampoMoeda";
import Card from "../../components/Card";
import LayoutLogado from "../../components/LayoutLogado";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import { useAuth } from "../../contexts/useAuth";
import { clienteService } from "../../services/clienteService";
import { lerMoeda, mascararCpf, numeroBR } from "../../utils/formatadores";
import Secao from "../../components/SecaoFormulario";

const MAX_RENDIMENTOS = 3;
const FORM_VAZIO = { nome: "", rg: "", cpf: "", endereco: "", profissao: "" };

function novoRendimento(dados = {}) {
    return {
        chave: crypto.randomUUID(),
        empregador: dados.entidadeEmpregadora ?? "",
        valor: dados.valor != null ? numeroBR(dados.valor) : "",
    };
}

export default function DadosCliente() {
    const { atualizarUsuario, sair } = useAuth();
    const [form, setForm] = useState(FORM_VAZIO);
    const [rendimentos, setRendimentos] = useState([]);
    const [erros, setErros] = useState({});
    const [erroGeral, setErroGeral] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        clienteService
        .buscar()
        .then((dados) => {
            setForm({
            nome: dados.nome ?? "",
            rg: dados.rg ?? "",
            cpf: dados.cpf ?? "",
            endereco: dados.endereco ?? "",
            profissao: dados.profissao ?? "",
            });
            setRendimentos(dados.rendimentos.map((r) => novoRendimento(r)));
        })
        .catch((e) => setErroGeral(e.message))
        .finally(() => setCarregando(false));
    }, []);

    function alterar(evento) {
        const { name, value } = evento.target;
        setForm({ ...form, [name]: name === "cpf" ? mascararCpf(value) : value });
        setSucesso(false);
    }

    function alterarRendimento(chave, campo, valor) {
        setRendimentos(rendimentos.map((r) => (r.chave === chave ? { ...r, [campo]: valor } : r)));
        setSucesso(false);
    }

    function adicionarRendimento() {
        setRendimentos([...rendimentos, novoRendimento()]);
        setSucesso(false);
    }

    function removerRendimento(chave) {
        setRendimentos(rendimentos.filter((r) => r.chave !== chave));
        setSucesso(false);
    }

    async function salvar(evento) {
        evento.preventDefault();
        setErros({});
        setErroGeral("");
        setSucesso(false);

        const errosLocais = {};
        const lista = rendimentos.map((r, i) => {
        const valor = lerMoeda(r.valor);
        if (r.valor.trim() !== "" && valor === null) {
            errosLocais[`rendimentos[${i}].valor`] = "Informe um valor válido";
        }
        return { entidadeEmpregadora: r.empregador, valor };
        });

        if (Object.keys(errosLocais).length > 0) {
        setErros(errosLocais);
        return;
        }

        setSalvando(true);
        try {
        const dados = await clienteService.atualizar({ ...form, rendimentos: lista });
        atualizarUsuario({ nome: dados.nome });
        setSucesso(true);
        } catch (e) {
        if (e.status === 409) {
            setErros({ cpf: e.message });
        } else if (Object.keys(e.campos ?? {}).length > 0) {
            setErros(e.campos);
        } else {
            setErroGeral(e.message);
        }
        } finally {
        setSalvando(false);
        }
    }

    async function excluirConta() {
        setExcluindo(true);
        try {
        await clienteService.excluir();
        sair();
        } catch (e) {
        setConfirmandoExclusao(false);
        setErroGeral(e.message);
        setExcluindo(false);
        }
    }

    return (
        <LayoutLogado titulo="Meus Dados">
            <CabecalhoPagina
                titulo="Meus Dados"
                descricao="Mantenha suas informações pessoais e financeiras atualizadas."/>

            {sucesso && (
                <p
                role="status"
                className="mb-4 flex items-center gap-2 rounded-[10px] bg-sucesso-fundo px-4 py-3 text-sm font-medium text-sucesso">
                <Check size={16} /> Alterações salvas com sucesso.
                </p>
            )}
            {erroGeral && (
                <p
                role="alert"
                className="mb-4 rounded-[10px] bg-perigo-fundo px-4 py-3 text-sm text-perigo">
                {erroGeral}
                </p>
            )}

            {carregando ? (
                <Card>
                    <p className="text-suave">Carregando seus dados...</p>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <form onSubmit={salvar}>
                        <Secao
                        icone={User}
                        titulo="Dados pessoais"
                        descricao="Informações utilizadas na análise dos seus pedidos.">
                            <div className="grid gap-5 md:grid-cols-2">
                                <Campo
                                id="nome"
                                rotulo="Nome completo"
                                value={form.nome}
                                onChange={alterar}
                                erro={erros.nome}/>
                                <Campo
                                id="rg"
                                rotulo="RG"
                                placeholder="Digite seu RG"
                                value={form.rg}
                                onChange={alterar}
                                erro={erros.rg}/>
                                <Campo
                                id="cpf"
                                rotulo="CPF"
                                placeholder="000.000.000-00"
                                inputMode="numeric"
                                value={form.cpf}
                                onChange={alterar}
                                erro={erros.cpf}/>
                                <Campo
                                id="profissao"
                                rotulo="Profissão"
                                placeholder="Digite sua profissão"
                                value={form.profissao}
                                onChange={alterar}
                                erro={erros.profissao}/>
                                <div className="md:col-span-2">
                                    <Campo
                                        id="endereco"
                                        rotulo="Endereço"
                                        placeholder="Rua, número, cidade e estado"
                                        value={form.endereco}
                                        onChange={alterar}
                                        erro={erros.endereco}/>
                                </div>
                            </div>
                        </Secao>

                        <Secao
                        icone={Building2}
                        titulo="Entidades empregadoras"
                        descricao="Adicione até 3 fontes de renda."
                        acao={
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-suave">
                            {rendimentos.length} de {MAX_RENDIMENTOS}
                            </span>
                        }>
                            {rendimentos.length === 0 && (
                            <p className="mb-3 text-sm text-suave">Nenhum empregador cadastrado ainda.</p>
                            )}

                            <div className="flex flex-col gap-3">
                                {rendimentos.map((r, i) => (
                                <div
                                    key={r.chave}
                                    className="flex items-start gap-3 rounded-xl border border-borda bg-fundo p-4">
                                    <span className="mt-9 grid size-7 shrink-0 place-items-center rounded-full bg-marca-50 text-xs font-bold text-marca-600">
                                    {i + 1}
                                    </span>
                                    <div className="grid flex-1 gap-4 md:grid-cols-[2fr_1fr]">
                                        <Campo
                                            id={`empregador-${i}`}
                                            rotulo="Empregador"
                                            placeholder="Nome da empresa"
                                            value={r.empregador}
                                            onChange={(e) => alterarRendimento(r.chave, "empregador", e.target.value)}
                                            erro={erros[`rendimentos[${i}].entidadeEmpregadora`]}/>
                                        <CampoMoeda
                                            id={`valor-${i}`}
                                            rotulo="Rendimento mensal (R$)"
                                            placeholder="0,00"
                                            value={r.valor}
                                            onChange={(e) => alterarRendimento(r.chave, "valor", e.target.value)}
                                            erro={erros[`rendimentos[${i}].valor`]}/>
                                    </div>
                                    <button
                                    type="button"
                                    onClick={() => removerRendimento(r.chave)}
                                    aria-label={`Remover empregador ${i + 1}`}
                                    className="mt-8 grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-red-200 text-perigo hover:bg-perigo-fundo">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={adicionarRendimento}
                                disabled={rendimentos.length >= MAX_RENDIMENTOS}
                                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-marca-600 px-4 py-2 text-sm font-semibold text-marca-600 hover:bg-marca-50 disabled:cursor-not-allowed disabled:opacity-50">
                                <Plus size={16} /> Adicionar empregador
                            </button>
                            {erros.rendimentos && (
                                <p className="mt-2 text-[13px] text-perigo">{erros.rendimentos}</p>
                            )}
                        </Secao>

                        <div className="flex flex-wrap items-center justify-between gap-4 p-6 lg:px-8">
                            <button
                                type="button"
                                onClick={() => setConfirmandoExclusao(true)}
                                className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-perigo hover:underline">
                                <Trash2 size={16} /> Excluir minha conta
                            </button>
                            <Botao disabled={salvando}>
                                <Check size={18} /> {salvando ? "Salvando..." : "Salvar alterações"}
                            </Botao>
                        </div>
                    </form>
                </Card>
            )}

            <ModalConfirmacao
                aberto={confirmandoExclusao}
                titulo="Excluir minha conta?"
                texto="Seus dados pessoais e empregadores serão apagados e você será desconectado. Essa ação não pode ser desfeita."
                rotuloConfirmar="Excluir conta"
                onConfirmar={excluirConta}
                onCancelar={() => setConfirmandoExclusao(false)}
                carregando={excluindo}/>
        </LayoutLogado>
    );
}