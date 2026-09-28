import { BrowserRouter, Routes, Route } from "react-router-dom";
import Estrutura from "./componentes/Estrutura";
import PaginaInicial from "./paginas/PaginaInicial";
import Sobre from "./paginas/Sobre";

export default function Rotas() {
  return (
      <Routes>
        <Route element={<Estrutura />}>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/sobre" element={<Sobre />} />
        </Route>
      </Routes>
  );
}