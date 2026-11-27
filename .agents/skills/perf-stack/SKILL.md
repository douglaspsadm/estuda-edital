---
name: perf-stack
description: Stack de economia de tokens (Ponytail, RTK, Graphify, Context Mode e Headroom) para manter sessões rápidas, enxutas e econômicas para qualquer contribuidor ou agente.
---
# Skill: perf-stack

## Quando usar
Em **toda** tarefa de código, análise ou manutenção neste repositório.

## 5 Pilares de Economia de Tokens
1. **Retomada Rápida (`STATE.md`):**
   - Leia `STATE.md` primeiro ao iniciar uma sessão para recuperar contexto sem varrer o repositório inteiro.
2. **Ferramentas Locais (`scripts/setup-perf-tools.sh`):**
   - Garanta `rtk`, `graphify`, `context-mode` e `headroom` disponíveis em `$HOME/.local/bin`; se faltarem em um ambiente novo, execute `bash scripts/setup-perf-tools.sh`.
3. **Ponytail (Código Mínimo & Respostas Diretas):**
   - Faça a menor mudança completa que resolve o problema, reutilizando `TracksManager`, `SHARED_BANK`, `PdfImporter`, `AI_TUTOR` e `CloudSync`.
4. **RTK (Comandos Comprimidos):**
   - Prefixe comandos barulhentos (`git status`, `git diff`, `git log`, `ls`) com `rtk` quando disponível.
5. **Context Mode & Headroom:**
   - **Nunca** leia arquivos de dados gigantes (`seedf_questions.js`, `quadrix_questions.js`, `dpdf_questions_reais.js`, `dist/estuda_edital_offline.html`) inteiros no contexto; inspecione com scripts Node/Python curtos ou intervalos pequenos de linhas (`StartLine`/`EndLine`).
   - Mantenha `graphify-out/graph.json` atualizado (`graphify extract src`) antes de buscas amplas multi-arquivo.
