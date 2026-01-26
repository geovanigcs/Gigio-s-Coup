# 🚀 Guia de Deploy - Gigio's Coup

## 📋 Opções de Hospedagem

### Opção 1: Render.com (Recomendado - Gratuito)

#### Vantagens:
- ✅ **Gratuito** (com limitações de tempo ativo)
- ✅ **Suporta WebSockets** nativamente
- ✅ **Deploy automático** via Git
- ✅ **SSL gratuito**
- ✅ **Fácil configuração**

#### Passos:

1. **Criar conta no Render:**
   - Acesse: https://render.com
   - Cadastre-se com GitHub

2. **Conectar repositório:**
   - Dashboard → New → Web Service
   - Conecte seu repositório GitHub
   - Selecione o branch `main`

3. **Configurar o serviço:**
```
Name: gigio-coup-backend
Environment: Node
Build Command: bun install && bun run prisma:generate
Start Command: bun server/src/main.ts
```4. **Variáveis de ambiente:**
   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=sua_url_do_neondb
   JWT_SECRET=gigio-coup-secret-2026
   FRONTEND_URL=https://gigio-coup.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu_email@gmail.com
   SMTP_PASS=sua_senha_app
   ```

5. **Deploy:**
   - Clique em "Create Web Service"
   - Aguarde o build (5-10 minutos)
   - URL gerada: `https://gigio-coup-backend.onrender.com`

#### ⚠️ Limitações do Plano Gratuito:
- Serviço "hiberna" após 15 minutos de inatividade
- Primeira conexão pode demorar 30-60s (cold start)
- 750 horas/mês de serviço ativo

---

### Opção 2: Railway.app (Recomendado para produção)

#### Vantagens:
- ✅ **$5 grátis** por mês (sem cartão)
- ✅ **Sem hibernação**
- ✅ **WebSockets** suportado
- ✅ **Métricas** e logs avançados

#### Passos:

1. **Criar conta:** https://railway.app
2. **New Project → Deploy from GitHub**
3. **Configurar:**
   ```
   Start Command: bun server/src/main.ts
   ```
4. **Adicionar variáveis de ambiente** (mesmas do Render)
5. **Deploy automático**

---

### Opção 3: Fly.io

#### Vantagens:
- ✅ **Gratuito** até 3 máquinas
- ✅ **Global deployment**
- ✅ **Persistência garantida**

#### Passos:

1. **Instalar CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   flyctl auth login
   ```

3. **Criar app:**
   ```bash
   flyctl launch
   ```

4. **Configurar secrets:**
   ```bash
   flyctl secrets set DATABASE_URL="sua_url"
   flyctl secrets set JWT_SECRET="seu_segredo"
   flyctl secrets set FRONTEND_URL="https://gigio-coup.vercel.app"
   ```

5. **Deploy:**
   ```bash
   flyctl deploy
   ```

---

## 🔧 Configuração do Frontend (Vercel)

Depois de fazer o deploy do backend, atualize o frontend:

1. **Variáveis de ambiente na Vercel:**
   ```env
   VITE_API_URL=https://gigio-coup-backend.onrender.com
   VITE_WS_URL=wss://gigio-coup-backend.onrender.com
   ```

2. **Redeploy do frontend:**
   - Vercel Dashboard → Settings → Environment Variables
   - Adicione as variáveis
   - Redeploy

---

## 📊 Monitoramento

### Render.com:
- Dashboard → Logs
- Events → Ver cold starts

### Railway:
- Metrics → CPU, Memory, Network
- Logs em tempo real

### Fly.io:
- `flyctl logs`
- `flyctl status`

---

## 🐛 Troubleshooting

### WebSocket não conecta:
1. Verifique CORS no gateway
2. Confirme que usa `wss://` (não `ws://`)
3. Verifique SSL do backend

### Cold start muito lento (Render):
- Opção 1: Upgrade para plano pago ($7/mês)
- Opção 2: Usar Railway ou Fly.io
- Opção 3: Criar "keep-alive" script

### Erro de banco de dados:
1. Confirme `DATABASE_URL` correto
2. Execute migrations: `bun run prisma:migrate deploy`
3. Regenere Prisma Client: `bun run prisma:generate`

---

## 💰 Comparação de Custos

| Serviço | Plano Gratuito | Plano Pago | Cold Start |
|---------|---------------|------------|------------|
| **Render** | 750h/mês | $7/mês | Sim |
| **Railway** | $5 crédito | $5+ uso | Não |
| **Fly.io** | 3 máquinas | $1.94/mês+ | Não |
| **Heroku** | ❌ Descontinuado | $7/mês | Não |

---

## ✅ Checklist de Deploy

- [ ] Backend deployado
- [ ] Variáveis de ambiente configuradas
- [ ] Database conectado (NeonDB)
- [ ] CORS configurado com URL do frontend
- [ ] Frontend atualizado com URL do backend
- [ ] WebSocket testado
- [ ] Autenticação funcionando
- [ ] Jogo multiplayer testado

---

## 🎯 Recomendação Final

**Para desenvolvimento/teste:** Use **Render.com** (gratuito)

**Para produção:** Use **Railway.app** ($5/mês) ou **Fly.io** (gratuito com limites)

**Cold start é crítico?** Evite Render gratuito, use Railway/Fly.io
