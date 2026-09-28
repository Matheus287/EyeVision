import { Link } from "react-router-dom";
import estilos from "./PaginaInicial.module.css";

export default function PaginaInicial() {
  return (
    <>
      <section className={estilos.destaque}>
        <div className={`conteiner ${estilos.destaqueConteudo}`}>
          <h1>EyeVision</h1>

          <p className={estilos.frase}>
            Tecnologia assistiva para tornar o mundo mais acessível.
          </p>

          <p className={estilos.explicacao}>
            Um dispositivo de baixo custo que utiliza câmera, áudio e
            inteligência artificial para auxiliar pessoas com deficiência
            visual na interpretação do ambiente.
          </p>

          <div className={estilos.acoes}>
            <a href="#como-funciona" className="botao">
              Conheça o EyeVision
            </a>
          </div>
        </div>
      </section>

      <section id="como-funciona" className={`conteiner ${estilos.secao}`}>
        <h2>Como funciona</h2>

        <p>Do botão físico à resposta por áudio, em cinco etapas.</p>

        <ol className={estilos.etapas}>
          <li>
            <span className={estilos.numero}>01</span>
            <h3>Captura</h3>
            <p>
              Ao pressionar o botão físico, a câmera captura uma imagem do
              ambiente e o microfone registra o áudio por alguns segundos.
            </p>
          </li>

          <li>
            <span className={estilos.numero}>02</span>
            <h3>Transmissão</h3>
            <p>
              O ESP32-S3 organiza os dados capturados e os envia ao aplicativo
              por Bluetooth Low Energy (BLE).
            </p>
          </li>

          <li>
            <span className={estilos.numero}>03</span>
            <h3>Processamento</h3>
            <p>
              O aplicativo recebe e reconstrói a imagem e o áudio, preparando
              os dados para análise.
            </p>
          </li>

          <li>
            <span className={estilos.numero}>04</span>
            <h3>Inteligência artificial</h3>
            <p>
              Os dados são enviados a um modelo de IA que interpreta as
              informações e produz uma resposta.
            </p>
          </li>

          <li>
            <span className={estilos.numero}>05</span>
            <h3>Resposta por áudio</h3>
            <p>
              O aplicativo converte a resposta em voz para que o usuário
              receba a informação de forma acessível.
            </p>
          </li>
        </ol>
      </section>

      <section id="tecnologia" className={estilos.faixa}>
        <div className={`conteiner ${estilos.secao}`}>
          <h2>Tecnologia</h2>

          <ul className={estilos.grade}>
            <li>
              <h3>XIAO ESP32-S3 Sense</h3>
              <p>
                Microcontrolador utilizado para realizar as capturas e a
                comunicação com o aplicativo.
              </p>
            </li>

            <li>
              <h3>Câmera OV2640</h3>
              <p>
                Responsável pela captura das imagens do ambiente.
              </p>
            </li>

            <li>
              <h3>Microfone PDM</h3>
              <p>
                Responsável pelo registro do áudio durante a captura.
              </p>
            </li>

            <li>
              <h3>Bluetooth Low Energy</h3>
              <p>
                Realiza a comunicação sem fio entre o dispositivo e o
                aplicativo.
              </p>
            </li>

            <li>
              <h3>Sensor VL53L0X</h3>
              <p>
                Sensor de distância utilizado como recurso complementar do
                projeto.
              </p>
            </li>

            <li>
              <h3>React Native e Expo</h3>
              <p>
                Tecnologias utilizadas no desenvolvimento do aplicativo
                mobile.
              </p>
            </li>

            <li>
              <h3>Inteligência artificial Gemini</h3>
              <p>
                Analisa as informações capturadas e gera uma resposta para o
                usuário.
              </p>
            </li>

            <li>
              <h3>Síntese de voz</h3>
              <p>
                Converte a resposta da inteligência artificial em áudio.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section id="acessibilidade" className={`conteiner ${estilos.secao}`}>
        <h2>Acessibilidade</h2>

        <p className={estilos.texto}>
          O EyeVision busca auxiliar pessoas com deficiência visual na obtenção
          de informações sobre o ambiente ao seu redor. A interação é simples:
          o usuário realiza uma captura pelo botão físico e recebe a resposta
          por voz.
        </p>

        <ul className={estilos.grade}>
          <li>
            <h3>Identificar objetos</h3>
            <p>Saber o que há diante do usuário.</p>
          </li>

          <li>
            <h3>Interpretar uma cena</h3>
            <p>Obter uma descrição geral do ambiente ao redor.</p>
          </li>

          <li>
            <h3>Compreender informações visuais</h3>
            <p>
              Receber em áudio informações que normalmente exigiriam a visão.
            </p>
          </li>

          <li>
            <h3>Perguntar por voz</h3>
            <p>
              Fazer perguntas relacionadas à captura e receber respostas em
              áudio.
            </p>
          </li>
        </ul>
      </section>

      <section id="aplicativo" className={estilos.faixa}>
        <div className={`conteiner ${estilos.secao}`}>
          <h2>O aplicativo</h2>

          <p className={estilos.texto}>
            O aplicativo é responsável pela comunicação com o dispositivo,
            recebimento das capturas e interação com o usuário.
          </p>

          <ul className={estilos.grade}>
            <li>
              <h3>Conexão Bluetooth</h3>
              <p>
                Gerencia a conexão entre o aplicativo e o dispositivo
                EyeVision.
              </p>
            </li>

            <li>
              <h3>Processamento de capturas</h3>
              <p>
                Recebe e reconstrói imagens e áudios enviados pelo dispositivo.
              </p>
            </li>

            <li>
              <h3>Inteligência artificial</h3>
              <p>
                Analisa as capturas e gera respostas contextualizadas.
              </p>
            </li>

            <li>
              <h3>Síntese de voz</h3>
              <p>Transforma as respostas em áudio.</p>
            </li>

            <li>
              <h3>Configurações</h3>
              <p>
                Permite personalizar opções do aplicativo, incluindo
                preferências de leitura por voz.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section id="sobre" className={`conteiner ${estilos.secao}`}>
        <h2>Sobre o projeto</h2>

        <p className={estilos.texto}>
          O EyeVision é um projeto de conclusão de curso que une hardware,
          desenvolvimento mobile, comunicação sem fio e inteligência
          artificial em uma solução assistiva.
        </p>

        <Link to="/sobre" className="botao botaoContorno">
          Conheça a equipe e os objetivos
        </Link>
      </section>
    </>
  );
}