# 📘 Guia de Deployment no Vercel

## Pré-requisitos
- ✅ Projeto no GitHub (https://github.com/medribjuliana-ctrl/iras-checklists)
- ✅ Conta no Vercel (https://vercel.com)
- ✅ Supabase PostgreSQL configurado

## Arquivos Estáticos

### Diretório Public ✅
O projeto tem um diretório `public/` na raiz com arquivos estáticos necessários:

- `manifest.json` - Configuração PWA
- `icon-192.svg` e `icon-512.svg` - Ícones do aplicativo

**Resolvido**: Erro "No Output Directory named 'public' found" foi corrigido removendo `outputDirectory` do `vercel.json`. O Vercel detecta automaticamente Next.js e não precisa dessa configuração manual.

## Configuração do Banco de Dados

### Para Produção (PostgreSQL)
O projeto usa dois schemas Prisma:
- `prisma/schema.dev.prisma` - Para desenvolvimento local (SQLite)
- `prisma/schema.prod.prisma` - Para produção (PostgreSQL com enums)

### Configurar Banco de Produção
1. Execute o comando de deploy do banco:
   ```bash
   npm run db:push:prod
   ```
   Este comando:
   - Substitui temporariamente o schema por `schema.prod.prisma`
   - Faz push para PostgreSQL
   - Restaura o schema de desenvolvimento

2. Execute o seed para popular dados iniciais:
   ```bash
   npm run db:seed
   ```

## Variáveis de Ambiente Necessárias

| Variável | Valor | Exemplo |
|----------|-------|---------|
| `DATABASE_URL` | URL PostgreSQL Supabase | `postgresql://postgres:senha@db.projeto.supabase.co:5432/postgres?sslmode=require` |
| `NEXTAUTH_URL` | URL da aplicação no Vercel | `https://seu-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret gerado | `rupRC/HM3PiJfzuYUx798zQi7mzCKxcgqNSCUxCIhyQ=` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase | `https://seu-projeto.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon Key Supabase | Obtém em Supabase > Settings > API Keys |

## Passo a Passo para Adicionar Variáveis no Vercel

### 1. Acessar o Dashboard do Vercel
- Vá para https://vercel.com/dashboard
- Selecione o projeto `iras-checklists`

### 2. Ir para Settings
- Clique em **Settings** (engrenagem)
- Selecione **Environment Variables**

### 3. Adicionar Cada Variável
Para cada variável acima:
1. Clique em **Add New**
2. Cole o **Name** (ex: `DATABASE_URL`)
3. Cole o **Value** (ex: seu URL PostgreSQL)
4. Selecione os ambientes: ✅ Production, ✅ Preview, ✅ Development
5. Clique **Add**

### 4. Redeploy
- Vá para **Deployments**
- Clique em **Redeploy** no último deployment
- Selecione **Use existing Environment Variables**
- Confirme

## Valores a Obter

### Database URL (Supabase)
1. Vá para https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings > Database**
4. Copie a connection string PostgreSQL

### NEXTAUTH_SECRET
Execute no terminal:
```bash
openssl rand -base64 32
```
Resultado exemplo: `rupRC/HM3PiJfzuYUx798zQi7mzCKxcgqNSCUxCIhyQ=`

### NEXTAUTH_URL
Após fazer o primeiro deploy, o Vercel fornecerá uma URL tipo:
`https://iras-checklists.vercel.app`

### Supabase URL e Anon Key
1. Em Supabase Dashboard
2. **Settings > API**
3. Copie **Project URL** e **anon public** key

## Checklist Final

- [ ] DATABASE_URL adicionada
- [ ] NEXTAUTH_URL adicionada
- [ ] NEXTAUTH_SECRET adicionada
- [ ] NEXT_PUBLIC_SUPABASE_URL adicionada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY adicionada
- [ ] Projeto feito redeploy
- [ ] Acessar https://seu-app.vercel.app
- [ ] Login com admin@hospital.local / admin123

## Troubleshooting

### Erro: "Nenhum diretório public"
✅ Já corrigido com `vercel.json`

### Erro: Database connection
- Verifique DATABASE_URL
- Certifique-se que Supabase está ativo
- Teste a conexão localmente: `npx prisma db push`

### Erro: NextAuth não funciona
- Verifique NEXTAUTH_URL (deve ser https, sem /api/auth)
- Regenere NEXTAUTH_SECRET

## Contato & Suporte
GitHub: https://github.com/medribjuliana-ctrl/iras-checklists
