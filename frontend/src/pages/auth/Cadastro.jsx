import { Link } from "react-router";

export default function Cadastro() {
  return (
    <div className="flex flex-col items-start gap-3 p-10">
      <h1 className="text-2xl font-bold">Cadastro</h1>
      <p className="text-suave">Em construção.</p>
      <Link to="/login" className="font-semibold text-marca-600 hover:underline">
        Voltar para o login
      </Link>
    </div>
  );
}