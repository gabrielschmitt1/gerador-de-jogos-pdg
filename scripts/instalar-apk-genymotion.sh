#!/bin/bash

echo "📱 Instalador Rápido do Gerador de Jogos PDG no Genymotion"
echo "==========================================================="
echo ""

# Diretório do projeto
PROJECT_DIR="/home/gabriel.schimit/Personal/gerador-de-jogos-pdg"

# Caminho do APK
APK_PATH="$PROJECT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"

# Verificar se APK existe
if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK não encontrado: $APK_PATH"
    echo ""
    echo "💡 Compile o APK primeiro:"
    echo "   npx expo run:android"
    echo ""
    echo "   OU"
    echo ""
    echo "   cd android && ./gradlew assembleDebug"
    exit 1
fi

echo "✅ APK encontrado: $APK_PATH"
echo "   Tamanho: $(du -h "$APK_PATH" | cut -f1)"
echo ""

# Conectar ao Genymotion
echo "🔌 Conectando ADB ao Genymotion..."
cd "$PROJECT_DIR"
./scripts/genymotion-connect.sh

echo ""
echo "📋 Dispositivos conectados:"
adb devices

echo ""
echo "📦 Instalando APK..."
adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ======================================"
    echo "   APK INSTALADO COM SUCESSO!"
    echo "   ======================================"
    echo ""
    echo "📱 Abra o app 'geradordejogospdg' no emulador"
    echo ""
else
    echo ""
    echo "❌ Erro na instalação"
    echo ""
    echo "💡 Tente:"
    echo "   1. Desinstalar versão antiga: adb uninstall com.geradordejogospdg.app"
    echo "   2. Reinstalar: adb install $APK_PATH"
    echo "   3. Ou arraste o APK para a janela do Genymotion"
    echo ""
fi

