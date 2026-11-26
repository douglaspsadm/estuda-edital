# STATE.md — Estuda Edital

## Resumo & Stack
- **Objetivo**: Plataforma adaptativa multi-concurso (qualquer área), estática (Vercel), com Edital dinâmico por `track_id`, leitura de PDF no navegador (`pdf.js`), IA BYOK (Gemini/OpenAI), Base Compartilhada de 805 questões reais e sync híbrido (`localStorage` + Supabase `(user_id, track_id)`).
- **Arquivos Principais**:
  - `src/data/shared_bank.js`: 8 pacotes temáticos sobre as 805 questões reais + matching automático com qualquer edital.
  - `src/js/tracks_manager.js`: gerenciamento multi-trilha (`track_id`), templates prontos (`base_comum_concursos`, `dpdf_ti_2026`), isolamento de progresso e export/import de trilhas.
  - `src/js/pdf_importer.js`: lazy-load de `pdf.js`, filtro de páginas, chunking seguro para IA e parser heurístico local.
  - `src/js/onboarding_wizard.js`: Wizard guiado em 4 passos + view dedicada `Importar Provas & Base`.
  - `src/js/ai_tutor.js`: motor BYOK (Gemini/OpenAI) com `askRaw`, `askJson` e `discoverModelsDirect`.
  - `src/js/cloud_sync.js` + `supabase/schema.sql`: sincronização Supabase por `(user_id, track_id)` com fallback gracioso para `user_progress`.
  - `src/data/cofen_edital_data.js`: Edital Nº 1/2026 do COFEN (Instituto Quadrix — 13 cargos de nível superior, 400–412) extraído do PDF oficial, com seletor de cargo na sidebar e no Wizard.
  - `src/js/app.js`: motor adaptativo completo + seletor agrupado Concurso → Cargo.

## Validação
- `npm run check` (`validate_questions.mjs` + `tests/core.test.mjs` + `build.mjs`): passando (805 questões válidas, 5/5 testes unitários, `public/` e `dist/estuda_edital_offline.html` gerados).
- E2E Playwright contra `public/`: validado COFEN Enfermeiro (411, 332q reais) → troca de cargo para Analista de Sistemas (404, 602q reais + Língua Inglesa) com 0 `pageerror`s.
