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
  - `src/data/quadrix_questions.js`: **1.919 questões reais únicas** da banca Instituto Quadrix (40 provas + gabaritos de COREN-AC, COREN-PR, CRF-DF, CRF-PR, CRF-AC, CRF-MS, CRM-ES, CRM-MS, CORE-BA, CRP-13, Fundação ABC).
  - `src/data/shared_bank.js`: **16 pacotes temáticos** unificando **2.724 questões reais** (805 originais + 1.919 Quadrix) reaproveitadas na Base Nacional Comum (`1.204q`), COFEN 2026 (`1.156q`–`1.523q` por cargo) e DPDF 2026 — TI (`1.431q`).

## Validação
- `npm run check` (`validate_questions.mjs` + `tests/core.test.mjs` + `build.mjs`): passando (**2.724 questões válidas**, 0 erros, 5/5 testes unitários, `public/` e `dist/estuda_edital_offline.html` gerados).
- E2E Playwright contra `public/`: validado COFEN Enfermeiro (`0/1284`), COFEN Analista de Sistemas (`0/1523`) e DPDF TI (`0/1431`) com 0 `pageerror`s.
