# DER conceitual — Hexavante Desktop

Documento de referência das entidades **consumidas** (o desktop não tem banco próprio).

---

```
SESSÃO_LOCAL (token seguro, usuário, expiração)
CURSO_CACHE (id, slug, título, progresso local)
TENTATIVA_LOCAL (simulado, respostas, sincronizada?)
FILA_OFFLINE (ação, payload, tentativas)
```

Tudo espelha a API; o servidor continua fonte da verdade. Ver o lógico em [der-logico.md](der-logico.md).
