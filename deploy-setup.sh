#!/bin/bash

echo "🚀 Gigio's Coup - Deploy Setup"
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto"
    exit 1
fi

echo "📦 Instalando dependências..."
bun install

echo ""
echo "🗄️ Gerando Prisma Client..."
bun run prisma:generate

echo ""
echo "✅ Projeto pronto para deploy!"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1️⃣  Deploy no Render.com:"
echo "   - Acesse: https://render.com"
echo "   - New → Web Service"
echo "   - Conecte o repositório"
echo "   - Build: bun install && bun run prisma:generate"
echo "   - Start: bun server/src/main.ts"
echo ""
echo "2️⃣  Configurar variáveis de ambiente:"
echo "   DATABASE_URL=sua_url_neondb"
echo "   JWT_SECRET=seu_segredo_aleatorio"
echo "   FRONTEND_URL=https://gigio-coup.vercel.app"
echo "   SMTP_HOST=smtp.gmail.com"
echo "   SMTP_PORT=587"
echo "   SMTP_USER=seu_email@gmail.com"
echo "   SMTP_PASS=sua_senha_app"
echo ""
echo "3️⃣  Atualizar frontend na Vercel:"
echo "   VITE_API_URL=https://gigio-coup-backend.onrender.com"
echo "   VITE_WS_URL=wss://gigio-coup-backend.onrender.com"
echo ""
echo "📚 Mais detalhes: veja DEPLOY.md"
