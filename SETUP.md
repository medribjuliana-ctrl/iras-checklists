# IRAS Checklists — Guia de Setup e Deploy

## Pré-requisitos

- Node.js 18+ ([download](https://nodejs.org))
- Conta no [Supabase](https://supabase.com) (gratuito)
- Conta no [Vercel](https://vercel.com) (gratuito)
- Git instalado

---

## 1. Configurar o Supabase (Banco de Dados)

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote as credenciais:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **Database password** (a que você definiu)
   - **Connection string**: vá em Settings → Database → Connection string (URI)
3. A connection string terá este formato:
   ```
   postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres
   ```

## 2. Configurar o Projeto Local

```bash
# Clonar ou copiar o projeto
cd iras-checklists

# Instalar dependências
npm install

# Criar arquivo .env com suas credenciais
cp .env.example .env
# Edite o .env com os dados do Supabase

# Gerar o NEXTAUTH_SECRET
openssl rand -base64 32
# Cole o resultado no .env

# Criar as tabelas no banco
npx prisma db push

# Popular com dados iniciais
npm run db:seed

# Iniciar o servidor de desenvolvimento
npm run dev
```

O app estará rodando em `http://localhost:3000`.

### Credenciais de teste:
- **Enfermeiro**: enfermeiro@hospital.local / nurse123
- **Admin**: admin@hospital.local / admin123

## 3. Deploy na Vercel

```bash
# Instalar a CLI da Vercel (se não tiver)
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Configurar variáveis de ambiente na Vercel:
# DATABASE_URL → connection string do Supabase
# NEXTAUTH_URL → URL do seu deploy (ex: https://iras.vercel.app)
# NEXTAUTH_SECRET → o secret gerado acima
```

Ou pelo dashboard da Vercel:
1. Importe o repositório Git
2. Configure as variáveis de ambiente em Settings → Environment Variables
3. Deploy automático a cada push

## 4. Estrutura do Projeto

```
iras-checklists/
├── prisma/
│   ├── schema.prisma       # Modelo de dados (7 tabelas)
│   └── seed.ts             # Dados iniciais
├── src/
│   ├── app/
│   │   ├── api/            # API Routes (NextAuth, checklists, pacientes)
│   │   ├── login/          # Tela de login
│   │   ├── dashboard/      # Tela principal
│   │   └── checklists/     # Formulários
│   │       └── cvc-insercao/
│   ├── components/         # Componentes compartilhados
│   │   ├── FormWizard.tsx  # Wizard multi-etapas
│   │   └── ui/             # RadioPills, CheckPills, etc.
│   ├── lib/
│   │   ├── prisma.ts       # Singleton do Prisma
│   │   ├── auth.ts         # Config NextAuth
│   │   └── adherence.ts    # Cálculo de adesão ao bundle
│   └── types/
│       └── index.ts        # TypeScript types
├── package.json
├── .env.example
└── SETUP.md               # Este arquivo
```

## 5. Próximos Passos

### Formulários restantes
Os 5 formulários pendentes seguem o mesmo padrão do CVC Inserção:
- CVC Manutenção → `/checklists/cvc-manutencao`
- SVD Inserção → `/checklists/svd-insercao`
- SVD Manutenção → `/checklists/svd-manutencao`
- PAV Fisioterapia → `/checklists/pav-fisio`
- PAV Enfermagem → `/checklists/pav-enf`

### Funcionalidades futuras
- **Offline/PWA**: Service Worker + IndexedDB (Dexie.js)
- **Dashboard analítico**: Gráficos de adesão por unidade/período
- **Notificações**: Alertas de justificativa pendente
- **Export**: Relatórios em PDF/Excel

## 6. Comandos Úteis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run db:studio    # Prisma Studio (visualizar banco)
npm run db:migrate   # Criar migration
npm run db:seed      # Popular dados iniciais
```
