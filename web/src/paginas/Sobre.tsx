import estilos from "./Sobre.module.css";

export default function Sobre() {
  return (
    <div className={`conteiner ${estilos.sobre}`}>
      <h1>Sobre o EyeVision</h1>

      <section>
        <h2>Descrição</h2>
        <p>
          O EyeVision é um projeto de conclusão de curso desenvolvido por estudantes do curso técnico em
          Desenvolvimento de Sistemas. É uma tecnologia assistiva de baixo custo, com um dispositivo
          acoplado aos óculos que utiliza câmera, microfone, Bluetooth e inteligência artificial para
          transformar informações visuais e sonoras em respostas por áudio.
        </p>
      </section>

      <section>
        <h2>Objetivo</h2>
        <p>
          Desenvolver uma solução tecnológica assistiva capaz de auxiliar pessoas com deficiência visual
          na obtenção de informações sobre o ambiente ao seu redor, auxiliando o usuário a obter informações sobre o ambiente por meio de respostas em áudio.
        </p>
      </section>

      <section>
        <h2>Partes da solução</h2>
        <ul className={estilos.lista}>
          <li><h3>Dispositivo físico</h3><p>Captura imagem e áudio e transmite os dados.</p></li>
          <li><h3>Aplicativo mobile</h3><p>Comunica-se com o dispositivo, processa os dados e interage com o usuário.</p></li>
          <li><h3>Inteligência artificial</h3><p>Interpreta as informações capturadas e gera as respostas.</p></li>
        </ul>
      </section>

      <section>
        <h2>Funcionalidades do aplicativo</h2>
        <ul className={estilos.lista}>
          <li><h3>Conexão Bluetooth</h3><p>Gerencia a conexão entre o aplicativo e o dispositivo EyeVision.</p></li>
          <li><h3>Processamento de capturas</h3><p>Recebe e reconstrói imagens e áudios enviados pelo dispositivo.</p></li>
          <li><h3>Inteligência artificial</h3><p>Analisa as capturas e gera respostas contextualizadas.</p></li>
          <li><h3>Síntese de voz</h3><p>Transforma as respostas em áudio.</p></li>
          <li><h3>Configurações</h3><p>Personaliza o aplicativo, incluindo preferências de leitura por voz.</p></li>
        </ul>
      </section>

      <section>
        <h2>Integrantes</h2>
        <ul className={estilos.integrantes}>
          <li>Matheus de Sousa Oliveira</li>
          <li>Nicoli Barboza da Silva</li>
          <li>Pietro Davi de Almeida Merique</li>
          <li>Samara Pereira da Silva</li>
        </ul>
      </section>
    </div>
  );
}
