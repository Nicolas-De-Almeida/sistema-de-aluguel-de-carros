import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "../contexts/useAuth";
import Cadastro from "../pages/auth/Cadastro";
import Login from "../pages/auth/Login";
import PedidosAgente from "../pages/agente/PedidosAgente";
import DadosCliente from "../pages/cliente/DadosCliente";
import PedidosCliente from "../pages/cliente/PedidosCliente";
import PrivateRoute from "./PrivateRoute";
import DetalhesPedido from "../pages/cliente/DetalhesPedido";
import FormularioPedido from "../pages/cliente/FormularioPedido";
import AvaliarPedido from "../pages/agente/AvaliarPedido";

export default function AppRoutes() {
  const { estaLogado, paginaInicial } = useAuth();

  // Quem já está logado não precisa ver login e cadastro
  const publica = (pagina) =>
    estaLogado ? <Navigate to={paginaInicial} replace /> : pagina;

  return (
    <Routes>
      <Route path="/login" element={publica(<Login />)} />
      <Route path="/cadastro" element={publica(<Cadastro />)} />

      <Route
        path="/cliente/pedidos"
        element={
          <PrivateRoute perfil="CLIENTE">
            <PedidosCliente />
          </PrivateRoute>
        }/>
      <Route
        path="/cliente/pedidos/novo"
        element={
          <PrivateRoute perfil="CLIENTE">
            <FormularioPedido />
          </PrivateRoute>
        }/>
      <Route
        path="/cliente/pedidos/:id"
        element={
          <PrivateRoute perfil="CLIENTE">
            <DetalhesPedido />
          </PrivateRoute>
        }/>
      <Route
        path="/cliente/pedidos/:id/editar"
        element={
          <PrivateRoute perfil="CLIENTE">
            <FormularioPedido />
          </PrivateRoute>
        }/>
      <Route
        path="/cliente/dados"
        element={
          <PrivateRoute perfil="CLIENTE">
            <DadosCliente />
          </PrivateRoute>
        }/>
      <Route
        path="/agente/pedidos"
        element={
          <PrivateRoute perfil="AGENTE">
            <PedidosAgente />
          </PrivateRoute>
        }/>
      <Route
        path="/agente/pedidos/:id"
        element={
          <PrivateRoute perfil="AGENTE">
            <AvaliarPedido />
          </PrivateRoute>
        }/>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}