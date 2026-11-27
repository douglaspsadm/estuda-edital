---
name: exam-ingestor
description: Pipeline obrigatório para ingestão de provas novas (PDF/Drive/texto): extração com gabarito definitivo, auditoria edital-por-edital de aderência, alimentação de Simulado/Concurso Completo e extração de Discursivas + padrões de resposta.
---
# Skill: exam-ingestor

## Quando usar
1. **Fluxo Direto (Prova Nova → Editais Existentes):** **SEMPRE** que o usuário enviar uma prova nova ou pasta de provas (PDF, Google Drive ou texto).
2. **Fluxo Reverso (Edital Novo/Atualizado → Banco Existente):** acionado em encadeamento pelo `edital-curator` sempre que um concurso/cargo for criado ou atualizado, para herdar imediatamente todas as questões e discursivas já existentes no banco que cabem nas disciplinas do novo edital.

## Pipeline Obrigatório (5 Etapas)
1. **Extração com Gabarito Oficial Definitivo:**
   - Use `pdftotext` (`poppler-utils`) para converter PDFs rapidamente em `/tmp/`.
   - Extraia enunciados completos, alternativas ou itens Certo/Errado, cruze com o **gabarito oficial definitivo** e **descarte questões anuladas** (`X`, `#`, `Anulada`).
   - Deduplique por enunciado normalizado; nunca invente questões ou gabaritos.
2. **Auditoria de Aderência Edital por Edital (CRÍTICO):**
   - **Nunca jogue tudo em todos os concursos.** Avalie cada bloco de questões contra cada edital existente (`DPDF TI`, `COFEN 2026`, `SEEDF 2026/2027`, `Base Comum` e futuras trilhas):
     - Inclua apenas o que **realmente cabe** nas disciplinas daquele edital (ex.: TI, Português, Informática e LODF/DF cabem na DPDF TI; Artes/Biologia/Pedagogia ficam apenas na SEEDF).
     - Registre em `src/data/shared_bank.js` (`getAllRealQuestions()` + `PACK_DEFINITIONS`) e verifique também trilhas com lógica dedicada (como `useFullDpdfBank` em `src/js/tracks_manager.js`).
     - Inclua os novos arquivos de dados em `src/index.html`, `scripts/build.mjs` e `tests/core.test.mjs`.
3. **Simulado Cronometrado & Concurso Completo:**
   - Confirme que `TracksManager.getQuestionsForTrack(trackId)` entrega as novas questões sem duplicatas para o Simulado Cronometrado e para o Concurso Completo (`src/js/app.js`).
4. **Discursivas & Padrões de Resposta Oficiais:**
   - Varra **todos** os PDFs (inclusive arquivos de gabaritos definitivos!) em busca de `PROVA DISCURSIVA`, `REDAÇÃO`, `ESTUDO DE CASO` e `PADRÃO DE RESPOSTA DEFINITIVO`.
   - Limpe marcas d'água (`pcimarkpci...`), deduplicando propostas repetidas entre cargos.
   - Salve em `src/data/shared_discursive_bank.js` com `area` compatível com `TracksManager.getRealDiscursivesForTrack()`.
5. **Relatório de Impacto & Validação:**
   - Execute `npm run check` e imprima o relatório de quantas questões novas entraram em **cada** concurso/trilha.
   - Atualize `STATE.md`, commite e faça `git push origin main`.

## Modo Sem IA vs. Com IA
- **Sem IA (local/repositório):** parsing determinístico em Python/Node + validação em `scripts/validate_questions.mjs`.
- **Com IA (no navegador via `PdfImporter`):** chunking seguro de páginas + extração JSON BYOK com fallback heurístico local.
