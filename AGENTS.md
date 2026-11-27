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

## 3. Regra Obrigatória: Ingestão de Provas Novas (Pipeline Completo)
**SEMPRE** que o usuário enviar uma prova nova ou pasta de provas (PDF, Drive ou texto), execute obrigatoriamente todas as etapas abaixo sem pular nenhuma:
1. **Tratar todas as questões objetivas:** extrair enunciados completos, alternativas/itens (C/E ou múltipla escolha), cruzar com o **gabarito oficial definitivo** (descartando questões anuladas) e classificar `subjectId` e `sharedPackId`.
2. **Reaproveitar em todos os concursos:** registrar o novo banco em `src/data/shared_bank.js` (`getAllRealQuestions()` e `PACK_DEFINITIONS`) e vincular em `src/index.html` + `scripts/build.mjs`, garantindo que matérias comuns (Português, Informática, Direito, Administração, LODF/DF, etc.) alimentem automaticamente **todos** os concursos e trilhas compatíveis.
3. **Organizar para Simulado e Concurso Completo:** confirmar que `TracksManager.getQuestionsForTrack(trackId)` entrega as novas questões para a trilha alvo e para os filtros de **Simulado Cronometrado** e **Concurso Completo** (`src/js/app.js`).
4. **Aproveitar todas as questões Discursivas / Redações:** varrer todos os PDFs (inclusive gabaritos definitivos e padrões de resposta oficiais) em busca de propostas discursivas, estudos de caso e espelhos de correção, deduplicar e registrar em `src/data/shared_discursive_bank.js` com `area` compatível com `TracksManager.getRealDiscursivesForTrack()`.
5. **Validar e publicar:** rodar `npm run check` (validação + testes + build `public/` e `dist/`), atualizar `STATE.md`, commitar e dar `push` em `origin/main`.

