import estilos from "./Rodape.module.css";

export default function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <div className="conteiner">
        <p>EyeVision — projeto de TCC do curso técnico em Desenvolvimento de Sistemas, Etec Hortolândia.</p>
      </div>
    </footer>
  );
}
