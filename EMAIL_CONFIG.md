# 📧 Configuração de Email SMTP

## Gmail

Para usar o Gmail para enviar emails, você precisa gerar uma **Senha de App**:

### Passo a passo:

1. Acesse sua conta Google: https://myaccount.google.com/
2. Vá em **Segurança** → **Verificação em duas etapas** (ative se ainda não estiver)
3. Volte em **Segurança** → **Senhas de app**
4. Selecione **Email** e **Outro (nome personalizado)**
5. Digite "Gigio's Coup" e clique em **Gerar**
6. Copie a senha gerada (16 caracteres)

### Configure no .env:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"  # Senha de app gerada
```

## Outlook/Hotmail

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="seu-email@outlook.com"
SMTP_PASS="sua-senha"
```

## SendGrid (Recomendado para produção)

1. Crie uma conta em https://sendgrid.com/
2. Vá em **Settings** → **API Keys**
3. Crie uma nova API Key
4. Configure:

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"  # Literalmente a palavra "apikey"
SMTP_PASS="SG.sua-api-key-aqui"
```

## Mailgun

1. Crie uma conta em https://mailgun.com/
2. Vá em **Sending** → **Domain settings** → **SMTP credentials**
3. Configure:

```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="postmaster@seu-dominio.mailgun.org"
SMTP_PASS="sua-senha-smtp"
```

## Mailtrap (Para testes)

Mailtrap é perfeito para testar emails sem enviá-los de verdade:

1. Crie uma conta em https://mailtrap.io/
2. Acesse sua **Inbox** de teste
3. Copie as credenciais SMTP
4. Configure:

```env
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="seu-username"
SMTP_PASS="sua-senha"
```

## Testando a configuração

Depois de configurar, reinicie o backend:

```bash
docker-compose restart backend
```

Teste a recuperação de senha:
1. Acesse http://localhost:8080/forgot-password
2. Digite um email cadastrado
3. Verifique a caixa de entrada (ou Mailtrap se estiver testando)

## Troubleshooting

### Erro: "Invalid login"
- Verifique se as credenciais estão corretas
- Para Gmail, certifique-se de usar uma Senha de App
- Verifique se a verificação em duas etapas está ativa (Gmail)

### Erro: "Connection timeout"
- Verifique se a porta está correta (geralmente 587)
- Tente alterar SMTP_SECURE para "true" e porta para "465"
- Verifique firewall/antivírus

### Email não chega
- Verifique a pasta de Spam/Lixo eletrônico
- Confirme que o email está cadastrado no sistema
- Veja os logs do backend: `docker-compose logs backend`

### Modo desenvolvimento
Se o email falhar em desenvolvimento, o sistema retornará o token na resposta para você testar manualmente.
