# STATE.md — Estuda Edital

## Resumo & Stack
- **Objetivo**: Plataforma multi-concurso adaptativa (qualquer área), estática (Vercel), com IA BYOK (Gemini/OpenAI), leitura de PDF no navegador e sync híbrido (`localStorage` + Supabase por `user_id` e `track_id`).
- **Base inicial**: Copiada de `douglaspsadm/dpdf-ti-estudo` (`src/css/styles.css`, `src/js/ai_tutor.js`, `src/js/cloud_sync.js`, `src/js/app.js`, `src/index.html`, `scripts/build.mjs`).

## Estado Atual
- Repositório criado e base inicial importada.
- Próxima etapa: implementar wizard de onboarding, `pdf.js` client-side, schema dinâmico de `track_id` e banco compartilhado de disciplinas universais.
