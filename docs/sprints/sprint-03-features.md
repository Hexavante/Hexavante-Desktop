# Sprint 3 — Renderer e Features (Desktop)

## Telas (`src/app/`, `src/features/`)

Uma feature por domínio (cursos, simulados, perfil...): componentes em `components/`, estado em `hooks/`, tipos em `domain/`. Reaproveitar padrões visuais do web (cores, espaçamentos) mantendo independência de código.

## Camada de dados (`src/api/`, `src/http/`)

Todo dado vem da API (`https://api.hexavante.com.br`): cliente HTTP central com base URL configurável, tratamento de 401 (sessão expirada → tela de login) e paginação no padrão `{ data, pagination }`.

## Convenções

- pt-BR, TypeScript strict, componentes funcionais.
- Nada de credencial em código; tokens no armazenamento seguro do SO quando disponível.
- `npm run typecheck` (node + web) verde antes de commitar.
