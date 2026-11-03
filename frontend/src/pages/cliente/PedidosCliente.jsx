import Botao from "../../components/Botao";
import { useAuth } from "../../contexts/useAuth";

export default function PedidosCliente() {
  const { usuario, sair } = useAuth();

  return (
    <div className="flex flex-col items-start gap-3 p-10">
      <h1 className="text-2xl font-bold">Pedidos do cliente</h1>
      <p className="text-suave">Olá, {usuario.nome}!</p>
      <Botao variante="secundario" onClick={sair}>
        Sair
      </Botao>
    </div>
  );
}