---
name: qa-verifier
description: Verificação obrigatória antes de concluir qualquer tarefa: npm run check, auditoria de cobertura por trilha e E2E real com Playwright.
---
# Skill: qa-verifier

## Quando usar
Antes de declarar qualquer tarefa pronta, fazer commit ou push. Evidência real sempre antes de afirmar sucesso.

## Checklist de Verificação
1. **Validação + Testes + Build:**
   ```bash
   npm run check
   ```
   - Deve concluir com `0 erros críticos`, todos os testes de `tests/core.test.mjs` passando, e `public/` + `dist/estuda_edital_offline.html` gerados.
2. **Auditoria de Cobertura por Trilha (quando houver mudança em dados/questões):**
   - Confirmar via Node/sandbox a contagem real de `TracksManager.getQuestionsForTrack(id)` e `getRealDiscursivesForTrack` para SEEDF, COFEN, DPDF e Base Comum.
3. **E2E Real no Navegador (Playwright):**
   - Servir `public/` usando `ThreadingHTTPServer` (evita crash em requisições concorrentes de arquivos JS grandes).
   - Aguardar `#estuda-wizard-overlay` no primeiro carregamento antes de interagir com a página.
   - Verificar **0 `pageerror`s** e **0 erros de console** no fluxo alterado.
4. **Git & Estado:**
   - Atualizar `STATE.md`, commitar e dar `git push origin main` — nunca deixar trabalho sem commit/push.
