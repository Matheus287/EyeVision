import { Link, NavLink, useNavigate } from "react-router-dom";
import estilos from "./Cabecalho.module.css";

export default function Cabecalho() {
  const navigate = useNavigate();

  return (
    <header className={estilos.cabecalho}>
      <div className={`conteiner ${estilos.barra}`}>
        <Link to="/" className={estilos.logo}>EyeVision</Link>
        <nav aria-label="Principal" className={estilos.menu}>
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/sobre">Sobre</NavLink>
        </nav>
      </div>
    </header>
  );
}
