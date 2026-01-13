# 🐳 Docker - Gigio's Coup

## Pré-requisitos

- Docker
- Docker Compose

## Como usar

### 1. Configurar variáveis de ambiente

Certifique-se de que o arquivo `.env` está configurado com:

```env
DATABASE_URL="postgresql://neondb_owner:npg_NgR7pBSA1dwY@ep-orange-meadow-ahl1h0mi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="gigio-coup-secret-key-change-in-production-2026"
PORT=3001
```

### 2. Iniciar aplicação

```bash
chmod +x docker-start.sh
./docker-start.sh
```

Ou manualmente:

```bash
docker-compose up -d --build
```

### 3. Acessar aplicação

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001/api

### 4. Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

### 5. Parar aplicação

```bash
chmod +x docker-stop.sh
./docker-stop.sh
```

Ou manualmente:

```bash
docker-compose down
```

## Comandos úteis

### Reconstruir containers

```bash
docker-compose up -d --build
```

### Executar migrations

```bash
docker-compose run --rm migrate
```

### Acessar shell do backend

```bash
docker-compose exec backend sh
```

### Ver status dos containers

```bash
docker-compose ps
```

### Limpar tudo (containers, volumes, imagens)

```bash
docker-compose down -v --rmi all
```

## Estrutura

- **backend**: NestJS com Bun (porta 3001)
- **frontend**: React + Vite com Nginx (porta 8080)
- **migrate**: Job único que roda migrations do Prisma

## Troubleshooting

### Porta já em uso

Se as portas 3001 ou 8080 estiverem em uso, edite o `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3002:3001"  # Mude 3002 para outra porta disponível
  
  frontend:
    ports:
      - "8081:80"    # Mude 8081 para outra porta disponível
```

### Erro de conexão com banco de dados

Verifique se a `DATABASE_URL` no `.env` está correta e se o NeonDB está acessível.

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend
docker-compose logs frontend

# Reconstruir do zero
docker-compose down -v
docker-compose up -d --build
```
