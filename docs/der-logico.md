# DER lógico — Hexavante Desktop

Documento de referência do mapeamento **implementado**: estado local espelha tipos da API.

---

| Estado local | Origem (API) | Observações |
|--------------|--------------|-------------|
| Sessão | `POST /auth/login`, `GET /auth/session` | Token no secure store; expiração respeitada |
| Catálogo | `GET /courses`, `/exams`, `/tutorials` | Cache com revalidação; paginação igual |
| Progresso | `/courses/:id/*`, heartbeat de aula | Sincroniza quando há rede |
| Gamificação | `/rankings`, `/achievements`, `/shop` | Somente leitura + ações via API |
| Salas | `/live-rooms` | Entrada/saída e chat via API |

## Convenções

- Tipos TypeScript espelham os DTOs da API (não reinventar nomes).
- Nada é fonte da verdade local: conflito sempre resolve a favor do servidor.
