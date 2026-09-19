# Regras de negócio — Hexavante Desktop

Documento de referência das regras **implementadas** no código.

---

| ID | Regra |
|----|-------|
| RN-01 | Renderer nunca acessa Node/Electron direto — tudo via adapters/IPC |
| RN-02 | Mesmos contratos da API (`/api/v1/*`, `{ data, pagination }`) |
| RN-03 | 401 em qualquer chamada → desloga para o login |
| RN-04 | Tokens só no armazenamento seguro do SO, nunca em `localStorage` claro |
| RN-05 | Falha de rede nunca trava a UI (timeout + retry com backoff) |
| RN-06 | Nenhum segredo embutido no pacote distribuído |
