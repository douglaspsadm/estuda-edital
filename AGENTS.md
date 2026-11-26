# AGENTS.md — Estuda Edital

Regras obrigatórias para agentes de IA neste repositório.

## 1. Fluxo Técnico
- Edite sempre os arquivos modulares em `src/` (nunca edite `public/` ou `dist/` manualmente).
- Antes de concluir alterações, execute sempre:
  ```bash
  npm run check
  ```
- Atualize `STATE.md` ao concluir blocos relevantes.
- Nunca commite chaves de API, senhas ou credenciais privadas (a IA é 100% BYOK no navegador do usuário).

## 2. Stack de Economia de Tokens (`perf-stack`)
- Leia `STATE.md` primeiro ao retomar o trabalho.
- Mantenha mudanças enxutas e reutilize os módulos existentes (`TracksManager`, `SHARED_BANK`, `PdfImporter`, `AI_TUTOR`, `CloudSync`).
