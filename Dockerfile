# Dockerfile para produção
FROM oven/bun:1.1.38

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json bun.lockb ./
COPY prisma ./prisma/

# Instalar dependências
RUN bun install --frozen-lockfile

# Gerar Prisma Client
RUN bun run prisma:generate

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3001

# Comando de inicialização
CMD ["bun", "server/src/main.ts"]
