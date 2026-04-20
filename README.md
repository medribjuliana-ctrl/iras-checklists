# IRAS Checklists

Sistema de checklists para prevenção de infecções relacionadas à assistência à saúde (IRAS) em hospitais.

## ✅ Problemas Resolvidos

- **NOT_FOUND (404)**: Corrigido configuração do `vercel.json`
- **Avisos de depreciação**: Dependências atualizadas para versões compatíveis
- **Output Directory**: Removido `outputDirectory` problemático do Vercel
- **Dependências desatualizadas**: ESLint, Prisma e outras libs atualizadas

## 📦 Dependências Atualizadas

As dependências foram atualizadas para resolver avisos de depreciação:

- ✅ ESLint atualizado para versão compatível
- ✅ Prisma mantido em v5 (v7 tem breaking changes)
- ✅ Outras dependências críticas atualizadas
- ✅ Build e lint funcionando corretamente

## 🚨 Problema NOT_FOUND Resolvido

Se você está enfrentando erro **NOT_FOUND** (404), isso geralmente acontece por:

### ✅ Causas Comuns e Soluções

1. **Variáveis de ambiente não configuradas no Vercel**
   - Vá para Vercel Dashboard → Settings → Environment Variables
   - Adicione as 5 variáveis obrigatórias (veja DEPLOYMENT.md)

2. **Banco de dados não inicializado**
   - Execute: `npm run db:push:prod` (para PostgreSQL)
   - Execute: `npm run db:seed` (para popular dados)

3. **Diretório public ausente** ❌➡️✅ **RESOLVIDO**
   - Criado diretório `public/` com `manifest.json`
   - Arquivos estáticos necessários para PWA

4. **Build falhando no Vercel**
   - Verifique os logs de build no Vercel
   - Certifique-se que `DATABASE_URL` está correta

### 🔧 Configuração Rápida

Para desenvolvimento local:
```bash
npm install
npm run db:push  # SQLite local
npm run db:seed
npm run dev
```

Para produção (Vercel):
```bash
# Configure variáveis no Vercel Dashboard
npm run db:push:prod  # PostgreSQL
npm run db:seed
```

## 📋 Funcionalidades

- ✅ Checklists de inserção e manutenção de CVC
- ✅ Sistema de autenticação com NextAuth.js
- ✅ Interface responsiva com Tailwind CSS
- ✅ Banco de dados Prisma (SQLite dev / PostgreSQL prod)
- ✅ Deploy automatizado no Vercel

## 🏥 Checklists Disponíveis

- **CVC Inserção**: 9 seções para inserção de cateter venoso central
- **CVC Manutenção**: 10 medidas diárias para manutenção
- **PAV Fisioterapia**: Medidas por turno
- **PAV Enfermagem**: Medidas por turno

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (SQLite/PostgreSQL)
- **Auth**: NextAuth.js
- **Deploy**: Vercel

## 📖 Documentação

- [DEPLOYMENT.md](DEPLOYMENT.md) - Guia completo de deploy no Vercel
- [SETUP.md](SETUP.md) - Configuração inicial do projeto

## 🚀 Deploy

O projeto está configurado para deploy automático no Vercel via GitHub.

**Status**: ✅ Produção (https://iras-checklists.vercel.app)