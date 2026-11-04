import CabecalhoPagina from "../../components/CabecalhoPagina";
import Card from "../../components/Card";
import LayoutLogado from "../../components/LayoutLogado";

export default function PedidosAgente() {
  return (
    <LayoutLogado titulo="Pedidos para Análise">
      <CabecalhoPagina titulo="Pedidos para Análise" descricao="Avalie solicitações de aluguel e emita seu parecer financeiro."/>
      <Card>
        <p className="text-suave">A lista de pedidos para análise será exibida aqui.</p>
      </Card>
    </LayoutLogado>
  );
}