import { Outlet } from "react-router-dom";
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";
import estilos from "./Estrutura.module.css";

export default function Estrutura() {
  return (
    <div className={estilos.pagina}>
      <Cabecalho />
      <main className={estilos.conteudo}>
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}
