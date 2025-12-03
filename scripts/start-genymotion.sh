#!/bin/bash

# Script para iniciar o Genymotion com correções para problemas de driver Intel/MESA

echo "🚀 Iniciando Genymotion com correções para driver Intel..."
echo ""

# Desabilitar DRI3 (usar DRI2) - corrige erro MESA: dri3_alloc_render_buffer
export LIBGL_DRI3_DISABLE=1

# Opcional: forçar software rendering se ainda tiver problemas
# export LIBGL_ALWAYS_SOFTWARE=1

# Opcional: desabilitar vsync para melhor performance
# export vblank_mode=0

cd ~/Downloads/genymotion

echo "✅ Variáveis de ambiente configuradas:"
echo "   LIBGL_DRI3_DISABLE=1 (DRI2 mode)"
echo ""
echo "📱 Abrindo Genymotion..."
echo "   Logs em: ~/.Genymobile/genymotion.log"
echo ""

./genymotion

echo ""
echo "✅ Genymotion fechado."

