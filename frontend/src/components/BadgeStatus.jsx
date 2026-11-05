const ESTILOS = {
    EM_ANALISE: { rotulo: "Em análise", classes: "bg-aviso-fundo text-aviso" },
    APROVADO: { rotulo: "Aprovado", classes: "bg-sucesso-fundo text-sucesso" },
    REJEITADO: { rotulo: "Rejeitado", classes: "bg-perigo-fundo text-perigo" },
    CANCELADO: { rotulo: "Cancelado", classes: "bg-gray-100 text-gray-600" },
};

export default function BadgeStatus({ status }) {
    const { rotulo, classes } = ESTILOS[status];

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${classes}`}>
        <span className="size-1.5 rounded-full bg-current" />
            {rotulo}
        </span>
    );
}