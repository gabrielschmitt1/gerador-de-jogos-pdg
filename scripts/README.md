# 🔧 Scripts Utilitários

Scripts shell para facilitar o desenvolvimento e teste do Gerador de Jogos PDG.

---

## 📜 Scripts Disponíveis

### 🔌 `genymotion-connect.sh`

**Descrição:** Conecta automaticamente o ADB aos emuladores Genymotion rodando.

**Como usar:**

```bash
./scripts/genymotion-connect.sh
```

**O que faz:**

1. Procura processos QEMU do Genymotion
2. Extrai as portas ADB (ex: 6562, 6569)
3. Conecta o ADB a cada porta
4. Lista os dispositivos conectados

**Quando usar:**

- Após iniciar uma VM no Genymotion
- Antes de executar `npx expo run:android`
- Sempre que o ADB perder a conexão

---

### 📱 `instalar-apk-genymotion.sh`

**Descrição:** Instala o APK do Gerador de Jogos PDG no emulador Genymotion automaticamente.

**Como usar:**

```bash
./scripts/instalar-apk-genymotion.sh
```

**O que faz:**

1. Verifica se o APK existe
2. Conecta o ADB ao Genymotion
3. Instala o APK no emulador
4. Mostra instruções de uso

**Quando usar:**

- Após compilar um novo APK
- Para testar no emulador rapidamente
- Alternativa ao "arrastar e soltar"

---

### 🚀 `start-genymotion.sh`

**Descrição:** Inicia o Genymotion com correção para erro MESA DRI3.

**Como usar:**

```bash
./scripts/start-genymotion.sh
```

**O que faz:**

1. Desabilita DRI3 (usa DRI2)
2. Inicia o Genymotion sem erros gráficos
3. Previne crashes de inicialização

**Quando usar:**

- Se o Genymotion não abre normalmente
- Erro: "MESA: error: dri3_alloc_render_buffer"
- Crash ao clicar em "Start" na VM

**Alternativa:**

```bash
# Se ainda crashar, tente com software rendering
cd ~/Downloads/genymotion
LIBGL_DRI3_DISABLE=1 LIBGL_ALWAYS_SOFTWARE=1 ./genymotion
```

---

### ☕ `install-android-dev.sh`

**Descrição:** Instala e configura Java JDK e Android SDK no Linux.

**Como usar:**

```bash
./scripts/install-android-dev.sh
```

**O que faz:**

1. Instala OpenJDK 17
2. Baixa e instala Android SDK Command Line Tools
3. Instala componentes necessários (platform-tools, build-tools)
4. Configura variáveis de ambiente (Fish shell)
5. Adiciona ao PATH

**Quando usar:**

- Primeira instalação do ambiente
- Erro: "JAVA_HOME is not set"
- Erro: "ANDROID_HOME is not set"

**Pós-instalação:**

```bash
# Recarregar configuração do Fish shell
source ~/.config/fish/config.fish

# Verificar instalação
java -version
echo $ANDROID_HOME
adb --version
```

---

## 🎯 Ordem Típica de Uso

### Primeira Vez (Setup Completo)

```bash
# 1. Instalar ambiente (Java + Android SDK)
./scripts/install-android-dev.sh

# 2. Recarregar shell
source ~/.config/fish/config.fish

# 3. Instalar dependências do projeto
npm install

# 4. Compilar APK
npx expo run:android
```

---

### Desenvolvimento Diário

```bash
# 1. Iniciar Genymotion
./scripts/start-genymotion.sh

# 2. Aguardar VM iniciar (60s)

# 3. Conectar ADB
./scripts/genymotion-connect.sh

# 4. Instalar/testar
./scripts/instalar-apk-genymotion.sh
# OU
npx expo run:android
```

---

## 🆘 Troubleshooting

### "Permission denied"

```bash
chmod +x scripts/*.sh
```

### "ADB not found"

```bash
# Verificar se está no PATH
which adb

# Se não estiver, recarregar config
source ~/.config/fish/config.fish
```

### "VM não inicia no Genymotion"

```bash
# Use o script com correção DRI3
./scripts/start-genymotion.sh
```

### "APK not found"

```bash
# Compilar APK primeiro
cd android
./gradlew assembleDebug
cd ..
cp android/app/build/outputs/apk/debug/app-debug.apk geradordejogospdg-debug.apk
```

## 💡 Dicas

- **Mantenha os scripts executáveis:** `chmod +x scripts/*.sh`
- **Use tab completion:** `./scripts/<TAB>` para ver opções
- **Logs úteis:** Adicione `2>&1 | tee log.txt` para salvar saída
- **Background:** Adicione `&` ao final para executar em background

---

**🔧 Scripts mantidos e atualizados para Fish shell no Linux**
