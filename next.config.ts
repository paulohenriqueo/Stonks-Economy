import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build estático (pasta out/) servido pelo nginx: não há servidor Node em produção.
  // Toda a lógica roda no navegador e a segurança dos dados fica nas regras do Firestore.
  output: "export",
  // O otimizador de imagens do Next precisa de servidor; no build estático as imagens vão como estão.
  images: { unoptimized: true },
};

export default nextConfig;
