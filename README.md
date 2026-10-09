# Stonks Economy

App pessoal de organização financeira: você informa o salário do mês e o app divide
entre **contas (50%)**, **lazer (30%)** e **investimentos (20%)**, acompanhando contas
fixas, parcelas e o que sobra em cada categoria.

> Status: **fase 1 concluída**: base do projeto, Firebase e autenticação.
> As telas de salário, contas, parcelas, visão do mês, dashboard e projeção chegam nas próximas fases.

## Stack

- **Next.js 16** (App Router) com **React 19** e **TypeScript**, gerado como **site estático** (`out/`)
- **Tailwind CSS 4**, com a identidade visual definida em [`app/globals.css`](app/globals.css)
- **Firebase Auth + Firestore**, com dados isolados por usuário em `users/{uid}` e protegidos por [`firestore.rules`](firestore.rules)
- **Vitest** para testes unitários e testes das regras do Firestore
- **Docker Compose** + **Firebase Emulator Suite** para desenvolvimento

## Rodando com Docker (recomendado)

Precisa só do Docker. Sobe o app e os emuladores do Firebase (Auth + Firestore), sem
tocar no projeto real:

```bash
docker compose up --build
```

| Serviço | Endereço |
| --- | --- |
| App (hot reload) | http://localhost:3000 |
| Emulator UI (usuários, dados, logs) | http://localhost:4000 |

- Crie uma conta pelo botão **Cadastrar**: ela existe só no emulador. Use uma senha de teste,
  porque o emulador guarda as senhas em texto puro.
- E-mails de redefinição de senha não são enviados. O link aparece no log do container `firebase` e na Emulator UI.
- Os dados do emulador são salvos no volume `emulator-data` quando os containers param
  (`docker compose stop` ou `down`) e voltam na próxima subida. Para zerar: `docker compose down -v`.
- As portas ficam presas a `127.0.0.1`: o emulador não tem autenticação, então nada fica exposto na rede.
  Ainda assim, qualquer site aberto no seu navegador consegue chamar o emulador em `localhost`
  (ele aceita requisições de qualquer origem). Por isso, use só senhas descartáveis e pare o ambiente
  (`docker compose stop`) quando não estiver usando.
- Mudou dependências (`package.json`)? Rode `docker compose up --build --renew-anon-volumes`.

> **Docker Desktop e editores:** o app dentro do container só enxerga as mudanças de
> editores que salvam o arquivo "no lugar", como o VS Code (padrão). Editores que salvam
> trocando o arquivo (rename), como JetBrains com *safe write* ou Vim com a configuração
> padrão, não disparam o hot reload. Desative essa opção do editor ou rode o app sem
> Docker (abaixo). Se uma mudança não aparecer na tela, salve o arquivo de novo.

## Rodando sem Docker

Requer **Node 22** (o Next 16 exige Node ≥ 20.9). Com [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install        # usa a versão do .nvmrc
npm ci
cp .env.example .env.local   # preencha com a configuração do seu projeto Firebase
npm run dev
```

Para usar o projeto **real** do Firebase, o projeto precisa ter:

1. **Authentication → Método de login → E-mail/senha** habilitado;
2. **Firestore** criado;
3. as regras deste repositório publicadas (veja [Regras do Firestore](#regras-do-firestore)).

Para usar o **emulador** sem Docker, instale o [Firebase CLI](https://firebase.google.com/docs/cli)
(precisa de Java 21), rode `firebase emulators:start --project demo-stonks-economy` e
descomente as variáveis `NEXT_PUBLIC_FIREBASE_EMULATOR_*` no `.env.local`, usando
`NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-stonks-economy`. O `firebase.json` deixa os emuladores
só em `127.0.0.1`.

## Configuração

A configuração do Firebase nunca fica no código. Ela vem de duas fontes, nesta ordem:

1. **Runtime:** `public/config.js` define `window.__STONKS_CONFIG__`. Em produção, o
   container vai gerar esse arquivo ao iniciar, a partir de variáveis de ambiente como
   `FIREBASE_API_KEY` (ConfigMap no Kubernetes). Assim a mesma imagem serve qualquer ambiente.
2. **Build:** variáveis `NEXT_PUBLIC_*` (em desenvolvimento, via `.env.local`).

| Runtime (container) | Build (`.env.local`) | Obrigatória |
| --- | --- | --- |
| `FIREBASE_API_KEY` | `NEXT_PUBLIC_FIREBASE_API_KEY` | sim |
| `FIREBASE_AUTH_DOMAIN` | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | sim |
| `FIREBASE_PROJECT_ID` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | sim |
| `FIREBASE_APP_ID` | `NEXT_PUBLIC_FIREBASE_APP_ID` | sim |
| `FIREBASE_STORAGE_BUCKET` | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | não |
| `FIREBASE_MESSAGING_SENDER_ID` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | não |
| `FIREBASE_EMULATOR_HOST` | `NEXT_PUBLIC_FIREBASE_EMULATOR_HOST` | não (liga o emulador) |
| `FIREBASE_AUTH_EMULATOR_PORT` | `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT` | não (padrão 9099) |
| `FIRESTORE_EMULATOR_PORT` | `NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT` | não (padrão 8080) |

Se faltar alguma obrigatória, o app mostra uma tela dizendo exatamente o que falta.

Os valores da configuração web do Firebase identificam o projeto e não são secretos.
Quem protege os dados são as regras do Firestore. Mesmo assim, o `.env.local` não vai
para o git. Como reforço, restrinja a API key aos domínios do app no Google Cloud Console.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o site estático em `out/` |
| `npm run preview` | Serve o `out/` localmente |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos |
| `npm test` | Testes unitários |
| `npm run test:rules` | Testes das regras do Firestore (precisa do emulador) |

Com o Docker Compose rodando, os testes das regras rodam assim:

```bash
docker compose exec web npm run test:rules
```

Sem Docker, com o emulador local rodando:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run test:rules
```

## Regras do Firestore

Os dados de cada usuário ficam em `users/{uid}`, e só o próprio usuário lê e escreve.
O resto é negado por padrão. As subcoleções (contas fixas, parcelamentos e meses)
entram na fase 2, com validação de cada campo.

Para publicar as regras no projeto real (requer login no Firebase CLI):

```bash
npx firebase-tools@15 login
npx firebase-tools@15 deploy --only firestore:rules --project stonks-economy
```

## Estrutura

```
app/
  (app)/            área logada (layout com proteção de rota + cabeçalho)
    dashboard/
  login/            login, cadastro e recuperação de senha
  components/       componentes de tela
    ui/             componentes base da identidade visual (Button, TextField, Modal, Alert)
  hooks/            hooks (useAuth)
  globals.css       tema: cores, sombras e fontes
lib/                lógica sem React: configuração, Firebase, validações
  firebase/         inicialização, autenticação e perfil
tests/rules/        testes das regras do Firestore
docker/             imagem do Firebase Emulator
firestore.rules     regras de segurança
```

## Fluxo de trabalho

As features nascem em branches `feat/*` a partir da `Dev` e entram por pull request.
