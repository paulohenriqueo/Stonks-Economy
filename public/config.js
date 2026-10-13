// Configuração de runtime do Stonks Economy.
// Em produção, o container sobrescreve este arquivo ao iniciar, com os valores das
// variáveis de ambiente (ConfigMap no Kubernetes). Assim a mesma imagem serve para
// qualquer ambiente, sem rebuild. Em desenvolvimento ele fica vazio e o app usa as
// variáveis NEXT_PUBLIC_* do .env.local.
window.__STONKS_CONFIG__ = window.__STONKS_CONFIG__ || {};
