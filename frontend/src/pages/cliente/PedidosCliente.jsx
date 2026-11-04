import CabecalhoPagina from "../../components/CabecalhoPagina";
import Card from "../../components/Card";
import LayoutLogado from "../../components/LayoutLogado";

export default function PedidosCliente() {
  return (
    <LayoutLogado titulo="Meus Pedidos">
      <CabecalhoPagina titulo="Meus Pedidos" descricao="Acompanhe e gerencie suas solicitações de aluguel."/>
      <Card>
        <p className="text-suave">A lista de pedidos será exibida aqui.</p>
      </Card>
    </LayoutLogado>
  );
}