#!/bin/bash

echo "🔍 Buscando dispositivos Genymotion..."
echo ""

# Aguarda alguns segundos para garantir que as VMs iniciaram
sleep 3

# Procura por portas ADB do Genymotion
PORTS=$(ps aux | grep qemu-system-x86_64 | grep -v grep | grep -oP '127\.0\.0\.1:\K[0-9]+(?=-:5555)' | sort -u)

if [ -z "$PORTS" ]; then
    echo "❌ Nenhuma VM Genymotion rodando!"
    echo ""
    echo "Por favor:"
    echo "1. Abra o Genymotion: ~/Downloads/genymotion/genymotion"
    echo "2. Inicie uma máquina virtual"
    echo "3. Aguarde o boot completo (ver a tela inicial do Android)"
    echo "4. Execute este script novamente"
    exit 1
fi

echo "✅ VMs Genymotion encontradas!"
echo ""

# Desconecta todos os dispositivos ADB primeiro
adb disconnect > /dev/null 2>&1

# Conecta em cada porta encontrada
for PORT in $PORTS; do
    echo "📱 Tentando conectar na porta $PORT..."
    RESULT=$(adb connect 127.0.0.1:$PORT 2>&1)
    
    if echo "$RESULT" | grep -q "connected"; then
        echo "   ✅ Conectado com sucesso!"
    elif echo "$RESULT" | grep -q "already connected"; then
        echo "   ✅ Já estava conectado!"
    else
        echo "   ❌ Falha na conexão: $RESULT"
    fi
done

echo ""
echo "📋 Dispositivos conectados:"
adb devices -l

echo ""
echo "🚀 Para iniciar o app React Native:"
echo "   cd /home/gabriel.schimit/Personal/gerador-de-jogos-pdg"
echo "   npx expo run:android"

