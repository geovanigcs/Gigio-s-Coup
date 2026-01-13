#!/bin/bash

echo "🛑 Parando containers..."
docker-compose down

echo ""
echo "🗑️  Removendo volumes..."
docker-compose down -v

echo ""
echo "✅ Containers removidos!"
