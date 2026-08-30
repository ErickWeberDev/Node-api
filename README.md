# Projeto Backend + Frontend de Teste

Este e meu primeiro projeto em backend

Aplicação local para testar uma API REST de usuários e produtos por meio de um painel web.

O backend utiliza Express, Prisma e PostgreSQL. O frontend fica separado dentro da pasta `public/` e utiliza HTML, CSS, TypeScript e `fetch`, sem React ou outro framework.

## Requisitos

- Node.js instalado
- npm instalado
- PostgreSQL disponível
- Uma variável `DATABASE_URL` configurada

## Instalação

Na raiz do projeto, execute:

```bash
npm install
```

Depois, gere ou atualize o cliente Prisma:

```bash
npx prisma generate
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/BANCO?schema=public"
```

Substitua `USUARIO`, `SENHA`, `HOST`, `PORTA` e `BANCO` pelos dados do seu banco.


Um `.gitignore` mínimo pode conter:

```gitignore
node_modules/
.env
dist/
```

## Banco de dados

Depois de configurar o `.env`, aplique as migrações:

```bash
npx prisma migrate deploy
```

Durante o desenvolvimento, novas alterações no schema podem ser aplicadas com:

```bash
npx prisma migrate dev
```

## Executar o projeto

Inicie o servidor com:

```bash
npm run dev
```

O servidor ficará disponível em:

```text
http://localhost:3000
```

Abra esse endereço no navegador. O backend serve o frontend a partir da pasta `public/`.

## Frontend

O frontend está organizado assim:

```text
public/
├── index.html
├── css/
│   └── style.css
└── src/
    ├── api.ts
    ├── main.ts
    ├── produtos.ts
    └── users.ts
```

Os arquivos `.js` dentro de `public/src/` são gerados a partir dos arquivos TypeScript e são os arquivos carregados pelo navegador.

