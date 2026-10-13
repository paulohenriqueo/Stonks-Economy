#!/bin/sh
# Sobe os emuladores. Importa os dados salvos, se existirem, e exporta tudo ao parar
# (docker compose stop/down), para os dados sobreviverem entre execuções.
set -e

PROJECT="${FIREBASE_PROJECT:-demo-stonks-economy}"
EXPORT_DIR=/data/export
CONFIG=/tmp/firebase.docker.json

# Roda a partir do volume: os logs e a pasta temporária da exportação ficam fora do
# repositório (montado só para leitura em /workspace).
cd /data

node /usr/local/lib/stonks/container-config.mjs /workspace/firebase.json "$CONFIG"

set -- firebase emulators:start --config "$CONFIG" --project "$PROJECT" --export-on-exit "$EXPORT_DIR"
if [ -f "$EXPORT_DIR/firebase-export-metadata.json" ]; then
  set -- "$@" --import "$EXPORT_DIR"
fi

exec "$@"
