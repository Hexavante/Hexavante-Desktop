# Permissões — Hexavante Desktop

Documento de referência do controle de acesso **implementado**.

---

## Modelo

Sem papéis próprios: tudo deriva da sessão da plataforma.

| Estado | Acesso |
|--------|--------|
| Deslogado | Login, cadastro e catálogo público |
| Logado | Estudo, simulados, loja, perfil, salas |
| Instrutor/moderador | Mesmas telas e permissões do web (via API) |

## Regras

- Canais IPC expõem o mínimo necessário; nada de `nodeIntegration`.
- Arquivos e câmera (se usados) pedem permissão do SO na hora.
- Logout limpa token, cache de sessão e fila offline do usuário.
