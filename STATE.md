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
  - `src/data/seedf_edital_data.js` + `src/data/seedf_questions.js`: **Pré-Edital SEEDF 2026/2027 (20 cargos, banca Quadrix, TR nº 3/2026)** + **1.467 questões reais únicas** (SEEDF 2023) integradas ao `SHARED_BANK` (`pack_seedf_df`, `pack_seedf_educacao`, `pack_seedf_esp_*`).
  - `src/data/shared_bank.js`: **19 pacotes temáticos** unificando **3.078 questões reais** reaproveitadas entre SEEDF, COFEN, DPDF e Base Comum.
  - `src/data/shared_discursive_bank.js`: **43 temas discursivos reais** (Quadrix, CEBRASPE, IADES), incluindo os 5 temas únicos da SEEDF com padrões de resposta definitivos oficiais.
  - Atualização de Edital (`TracksManager.updateTrackEdital` + `#btn-update-edital`): permite atualizar o edital de qualquer trilha futura sem perder progresso.
  - Flashcards Unificados + Auto-Geração por IA (`src/js/app.js` + `src/js/ai_tutor.js`): Aulas por IA (3 cartões) e Dicas Cirúrgicas por IA (1 cartão) criam flashcards automaticamente com IDs estáveis (`state.fc[card.id]`), filtros (`Todos`, `Vencidos`, `Aulas & Dicas IA`, `Erros`, por disciplina), soma com preset da trilha e criação manual.

## Agentes & Skills (`.agents/`)
- **6 Agentes** (`.agents/agents/`): `exam-ingestor`, `edital-curator`, `study-content-factory`, `ui-ux-guardian`, `qa-verifier`, `token-optimizer`.
- **6 Skills** (`.agents/skills/`): `exam-ingestor`, `edital-curator`, `study-content-factory`, `ui-ux-guardian`, `qa-verifier`, `perf-stack`.
- **Setup de economia de tokens**: `scripts/setup-perf-tools.sh` + tabela de roteamento em `AGENTS.md`.

## Validação
- `npm run check` (`validate_questions.mjs` + `tests/core.test.mjs` + `build.mjs`): passando (**3.078 questões reais**, 0 erros, 6/6 testes unitários, `public/` e `dist/estuda_edital_offline.html` gerados).
- Cobertura validada por concurso: `DPDF TI` (**1.625q**, +80 SEEDF), `COFEN 404` (**1.757q**, +84 SEEDF), `COFEN 411` (**1.470q**, +45 SEEDF), `SEEDF Atividades` (**972q**), `Base Comum` (**1.350q**).
- E2E Playwright contra `public/`: validados SEEDF 20 cargos, atualização de edital sem perda de progresso, auto-geração de flashcards de Aulas IA, criação manual, revisão espaçada por ID estável, soma ao preset no DPDF e reordenação sem repetir respondidas — 0 erros de console/página.


