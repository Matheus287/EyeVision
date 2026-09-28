# EyeVision Web

Aplicação web do projeto de TCC **EyeVision**, tecnologia assistiva de baixo custo que usa câmera, áudio e inteligência artificial para auxiliar pessoas com deficiência visual na interpretação do ambiente.

## Tecnologias
React, Vite, TypeScript, react-router-dom, react-hook-form, zod e Firebase Authentication.

## Funcionalidades
- Landing page pública (como funciona, tecnologia, acessibilidade, aplicativo e sobre)
- Página Sobre com objetivos, funcionalidades e integrantes
- Cadastro, login (e-mail/senha) e recuperação de senha
- Rota protegida `/painel` com perfil do usuário e logout

## Rotas
| Rota | Acesso |
|---|---|
| `/` | Pública |
| `/sobre` | Pública |
| `/login`, `/cadastro`, `/recuperar-senha` | Pública |
| `/painel` | Protegida |

## Estrutura
```
src/
  componentes/   Cabecalho, Rodape, Estrutura, CampoFormulario, RotaProtegida
  configuracao/  inicialização do Firebase
  contextos/     ContextoAutenticacao
  dados/         conteúdo textual das páginas
  paginas/       PaginaInicial, Login, Cadastro, RecuperarSenha, Painel, Sobre
  esquemas/      validações zod
  estilos/       global.css (variáveis) e módulos compartilhados
  tipos/         interfaces e tipos
  utilitarios/   tradução de erros do Firebase
```

## Back-end (Firebase)
Projeto único compartilhado com o aplicativo mobile. Serviço utilizado: Authentication com o método E-mail/senha.

## Dispositivo
Baseado no XIAO ESP32-S3 Sense (câmera OV2640, microfone PDM, BLE, botão físico e sensor VL53L0X). Captura imagem e áudio e envia ao aplicativo mobile, que consulta a IA e responde por voz.

## Como executar
```
npm install
cp .env.example .env   # preencha com as credenciais do Firebase
npm run dev
```

## Integrantes
Preencher em `src/dados/conteudo.ts` e aqui.
