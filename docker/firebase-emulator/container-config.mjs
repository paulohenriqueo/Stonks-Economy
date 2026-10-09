// Gera, a partir do firebase.json do repositório, a configuração usada dentro do container.
//
// O firebase.json do repositório deixa os emuladores em 127.0.0.1, o padrão seguro para quem
// roda o Firebase CLI direto na máquina. Dentro do container eles precisam escutar em
// 0.0.0.0, para as portas publicadas e a rede do compose funcionarem. O hub, que tem
// endpoints administrativos, continua restrito ao próprio container.
//
// Uso: node container-config.mjs <firebase.json do repositório> <arquivo gerado>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const [source, target] = process.argv.slice(2);
if (!source || !target) {
  console.error("Uso: node container-config.mjs <firebase.json> <saída>");
  process.exit(1);
}

const config = JSON.parse(readFileSync(source, "utf8"));
const projectDir = dirname(resolve(source));

// O arquivo gerado fica em outro diretório: caminhos relativos viram absolutos.
for (const key of ["rules", "indexes"]) {
  if (typeof config.firestore?.[key] === "string") {
    config.firestore[key] = resolve(projectDir, config.firestore[key]);
  }
}

for (const [name, emulator] of Object.entries(config.emulators ?? {})) {
  if (emulator && typeof emulator === "object" && "port" in emulator) {
    emulator.host = name === "hub" ? "127.0.0.1" : "0.0.0.0";
  }
}

writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
