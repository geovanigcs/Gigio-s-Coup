#!/bin/bash

echo "🐳 Construindo containers Docker..."
docker-compose build

echo ""
echo "🚀 Iniciando aplicação..."
docker-compose up -d

echo ""
echo "✅ Aplicação iniciada!"
echo ""
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:3001/api"
echo ""
echo "📊 Para ver os logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose down"
