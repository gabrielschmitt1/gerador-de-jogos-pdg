#!/bin/bash

echo "🚀 Instalando ambiente de desenvolvimento Android"
echo "=================================================="
echo ""

# 1. Instalar Java JDK 17
echo "📦 Passo 1: Instalando OpenJDK 17..."
sudo apt update
sudo apt install -y openjdk-17-jdk

# 2. Verificar instalação do Java
echo ""
echo "✅ Java instalado:"
java -version

# 3. Criar diretórios para Android SDK
echo ""
echo "📂 Passo 2: Criando diretórios para Android SDK..."
mkdir -p ~/Android/Sdk

# 4. Baixar Android Command Line Tools
echo ""
echo "📥 Passo 3: Baixando Android Command Line Tools..."
cd ~/Android/Sdk
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip

# 5. Extrair Command Line Tools
echo ""
echo "📦 Passo 4: Extraindo ferramentas..."
unzip -q cmdline-tools.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true
rm cmdline-tools.zip

# 6. Configurar variáveis de ambiente
echo ""
echo "⚙️ Passo 5: Configurando variáveis de ambiente..."

# Adicionar ao Fish shell config (~/.config/fish/config.fish)
mkdir -p ~/.config/fish
if ! grep -q "JAVA_HOME" ~/.config/fish/config.fish 2>/dev/null; then
    echo "" >> ~/.config/fish/config.fish
    echo "# Android Development" >> ~/.config/fish/config.fish
    echo "set -gx JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64" >> ~/.config/fish/config.fish
    echo "set -gx ANDROID_HOME \$HOME/Android/Sdk" >> ~/.config/fish/config.fish
    echo "set -gx PATH \$PATH \$ANDROID_HOME/emulator" >> ~/.config/fish/config.fish
    echo "set -gx PATH \$PATH \$ANDROID_HOME/platform-tools" >> ~/.config/fish/config.fish
    echo "set -gx PATH \$PATH \$ANDROID_HOME/cmdline-tools/latest/bin" >> ~/.config/fish/config.fish
    echo "✅ Configurações adicionadas ao Fish shell"
fi

# Adicionar ao ~/.bashrc (para compatibilidade)
if ! grep -q "JAVA_HOME" ~/.bashrc 2>/dev/null; then
    echo "" >> ~/.bashrc
    echo "# Android Development" >> ~/.bashrc
    echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> ~/.bashrc
    echo "export ANDROID_HOME=\$HOME/Android/Sdk" >> ~/.bashrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/emulator" >> ~/.bashrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools" >> ~/.bashrc
    echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin" >> ~/.bashrc
fi

# Exportar para sessão atual (bash)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# 7. Instalar componentes necessários do Android SDK
echo ""
echo "📱 Passo 6: Instalando componentes do Android SDK..."
echo "   Isso pode levar alguns minutos..."

yes | sdkmanager --licenses

sdkmanager --install "platform-tools"
sdkmanager --install "platforms;android-34"
sdkmanager --install "build-tools;34.0.0"
sdkmanager --install "emulator"

# 8. Verificar instalação
echo ""
echo "✅ Verificando instalação..."
echo ""
echo "Java:"
java -version
echo ""
echo "JAVA_HOME: $JAVA_HOME"
echo "ANDROID_HOME: $ANDROID_HOME"
echo ""
echo "Android SDK components:"
sdkmanager --list_installed

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "⚠️ IMPORTANTE: Feche e reabra o terminal (Fish shell) para que as variáveis de ambiente funcionem!"
echo ""
echo "Ou carregue manualmente com:"
echo "  source ~/.config/fish/config.fish"
echo ""
echo "Depois, teste com:"
echo "  cd /home/gabriel.schimit/Personal/gerador-de-jogos-pdg"
echo "  npx expo run:android"

