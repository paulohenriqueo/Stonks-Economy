# Firebase Emulator Suite (Auth + Firestore + UI) para desenvolvimento local.
# Usado pelo docker-compose.yml. Não vai para produção.

# O emulador do Firestore roda em Java: o JRE vem da imagem oficial do Temurin.
FROM eclipse-temurin:21-jre AS jre

FROM node:22-bookworm-slim

ARG FIREBASE_TOOLS_VERSION=15.33.0

ENV JAVA_HOME=/opt/java/openjdk \
    PATH=/opt/java/openjdk/bin:$PATH

COPY --from=jre /opt/java/openjdk /opt/java/openjdk

RUN npm install -g firebase-tools@${FIREBASE_TOOLS_VERSION} \
 && npm cache clean --force \
 && mkdir -p /data /workspace \
 && chown node:node /data /workspace

COPY --chmod=755 start.sh /usr/local/bin/start-emulators
COPY container-config.mjs /usr/local/lib/stonks/container-config.mjs

USER node
WORKDIR /workspace

# Baixa os emuladores já na imagem: o container sobe rápido e sem depender de rede.
RUN firebase setup:emulators:firestore \
 && firebase setup:emulators:ui \
 && rm -f firebase-debug.log

EXPOSE 4000 4400 4500 8080 9099 9150
CMD ["start-emulators"]
