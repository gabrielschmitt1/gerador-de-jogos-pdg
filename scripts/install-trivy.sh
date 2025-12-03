#!/bin/bash
#
# Script para instalar o Trivy (scanner de vulnerabilidades)
# https://github.com/aquasecurity/trivy
#

set -e

echo "🔍 Verificando se o Trivy já está instalado..."

if command -v trivy &> /dev/null; then
    echo "✅ Trivy já está instalado!"
    trivy --version
    exit 0
fi

echo "📦 Instalando Trivy..."

# Detectar sistema operacional
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$ARCH" in
    x86_64)
        ARCH="64bit"
        ;;
    aarch64|arm64)
        ARCH="ARM64"
        ;;
    *)
        echo "❌ Arquitetura não suportada: $ARCH"
        exit 1
        ;;
esac

case "$OS" in
    linux)
        echo "🐧 Detectado: Linux"
        
        # Tentar usar o gerenciador de pacotes
        if command -v apt-get &> /dev/null; then
            echo "📥 Instalando via apt (Debian/Ubuntu)..."
            sudo apt-get update
            sudo apt-get install -y wget apt-transport-https gnupg lsb-release
            wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo gpg --dearmor -o /usr/share/keyrings/trivy.gpg
            echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
            sudo apt-get update
            sudo apt-get install -y trivy
        elif command -v dnf &> /dev/null; then
            echo "📥 Instalando via dnf (Fedora/RHEL)..."
            sudo dnf install -y trivy
        elif command -v yum &> /dev/null; then
            echo "📥 Instalando via yum (CentOS/RHEL)..."
            sudo yum install -y trivy
        else
            echo "📥 Instalando via download direto..."
            VERSION=$(curl -s "https://api.github.com/repos/aquasecurity/trivy/releases/latest" | grep '"tag_name"' | sed -E 's/.*"v([^"]+)".*/\1/')
            wget -q "https://github.com/aquasecurity/trivy/releases/download/v${VERSION}/trivy_${VERSION}_Linux-${ARCH}.tar.gz" -O /tmp/trivy.tar.gz
            tar -xzf /tmp/trivy.tar.gz -C /tmp
            sudo mv /tmp/trivy /usr/local/bin/
            rm /tmp/trivy.tar.gz
        fi
        ;;
    darwin)
        echo "🍎 Detectado: macOS"
        
        if command -v brew &> /dev/null; then
            echo "📥 Instalando via Homebrew..."
            brew install trivy
        else
            echo "❌ Homebrew não encontrado. Por favor, instale o Homebrew primeiro:"
            echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
        ;;
    *)
        echo "❌ Sistema operacional não suportado: $OS"
        echo "   Por favor, instale manualmente: https://aquasecurity.github.io/trivy/latest/getting-started/installation/"
        exit 1
        ;;
esac

echo ""
echo "✅ Trivy instalado com sucesso!"
trivy --version
echo ""
echo "📋 Comandos úteis:"
echo "   trivy fs .                                    # Scan do projeto"
echo "   trivy fs --severity HIGH,CRITICAL .          # Apenas HIGH e CRITICAL"
echo "   trivy fs --format json -o report.json .      # Output em JSON"
echo "   pnpm run security:scan                       # Via npm script"

