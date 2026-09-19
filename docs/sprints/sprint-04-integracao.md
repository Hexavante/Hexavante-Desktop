# Sprint 4 — Integração com a Plataforma (Desktop)

## Sessão

Mesma conta do web: login e-mail/senha e OAuth abrem o navegador do sistema e retornam via deep-link/callback para o app. Sessão persistida entre reinícios; logout limpa tudo.

## Paridade com o web

Mesmos endpoints e regras: catálogo publicado, matrícula, progresso, simulados, ranking, certificados e loja — sempre via API pública, nunca lógica duplicada no cliente além de cache/UX.

## Offline e erros

Estados de loading/erro/vazio em todas as telas; fila ou aviso quando sem rede; nunca travar a UI em falha de rede (timeout + retry com backoff).
