# Configuração de Email com Resend

Este projeto usa **Resend** para envio de emails de recuperação de senha.

## Por que Resend?

- ✅ **Compatível com Bun** (ao contrário do nodemailer)
- ✅ **API moderna e simples**
- ✅ **Tier gratuito generoso**: 3.000 emails/mês
- ✅ **Sem necessidade de SMTP**
- ✅ **Entrega confiável**

## Passo 1: Criar conta no Resend

1. Acesse: https://resend.com/signup
2. Crie uma conta gratuita
3. Confirme seu email

## Passo 2: Obter API Key

1. Faça login em: https://resend.com/login
2. Vá para: https://resend.com/api-keys
3. Clique em **"Create API Key"**
4. Dê um nome (ex: "Gigio's Coup Production")
5. Copie a chave gerada (começa com `re_...`)

## Passo 3: Configurar domínio (opcional mas recomendado)

### Para usar seu próprio domínio:

1. Acesse: https://resend.com/domains
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `seusite.com`)
4. Siga as instruções para adicionar os registros DNS:
   - SPF (TXT)
   - DKIM (TXT)
   - DMARC (TXT)

### Para desenvolvimento (usar domínio de teste):

- Use o domínio padrão: `onboarding@resend.dev`
- Você só poderá enviar para emails verificados
- Limite: 100 emails/dia

## Passo 4: Configurar no projeto

Edite o arquivo `.env`:

```env
# Email Configuration (Resend)
RESEND_API_KEY="re_sua_api_key_aqui"
EMAIL_FROM="Gigio's Coup <noreply@seudominio.com>"
APP_URL="https://seudominio.com"  # URL do frontend em produção
```

### Configuração para desenvolvimento:

```env
RESEND_API_KEY="re_sua_api_key_aqui"
EMAIL_FROM="Gigio's Coup <onboarding@resend.dev>"
APP_URL="http://localhost:8080"
```

## Passo 5: Testar envio de email

### Via Docker:

```bash
docker-compose restart backend
```

### Localmente:

```bash
bun run server
```

### Testar a recuperação de senha:

1. Acesse: http://localhost:8080/forgot-password
2. Digite um email cadastrado
3. Clique em "Enviar"
4. Verifique a caixa de entrada do email

## Verificar emails enviados

- Dashboard do Resend: https://resend.com/emails
- Veja todos os emails enviados, status, opens, etc.

## Limitações do tier gratuito

- ✅ 3.000 emails/mês
- ✅ 100 emails/dia
- ✅ 1 domínio customizado
- ❌ Sem SLA de uptime
- ❌ Suporte apenas por comunidade

## Troubleshooting

### "API Key inválida"

- Verifique se copiou a chave completa
- A chave deve começar com `re_`
- Não adicione espaços ou aspas extras

### "Email não chegou"

1. Verifique o dashboard do Resend para ver o status
2. Confira a pasta de SPAM
3. Se usando domínio customizado, verifique os registros DNS
4. Para desenvolvimento, use `onboarding@resend.dev`

### "Failed to send email"

- Verifique os logs do backend: `docker logs gigio-coup-backend --tail 50`
- Confirme que a RESEND_API_KEY está configurada
- Teste a API key diretamente no dashboard do Resend

## Alternativas ao Resend

Se preferir usar outro serviço:

### SendGrid
- https://sendgrid.com
- 100 emails/dia grátis
- Requer mais configuração

### Mailgun
- https://mailgun.com
- 5.000 emails/mês grátis (primeiros 3 meses)
- API similar ao Resend

### Amazon SES
- https://aws.amazon.com/ses
- 62.000 emails/mês grátis (via EC2)
- Mais complexo de configurar

## Segurança

⚠️ **NUNCA** commite a API key no git!

- A API key está no `.env` (já no `.gitignore`)
- Em produção, use variáveis de ambiente
- Rotacione a key periodicamente

## Suporte

- Documentação: https://resend.com/docs
- Discord: https://resend.com/discord
- Status: https://status.resend.com
