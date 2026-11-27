---
name: edital-curator
description: Cria novos concursos (pré-edital ou edital oficial) e atualiza editais existentes sem perder progresso do aluno.
---
# Skill: edital-curator

## Quando usar
Ao adicionar um novo concurso/cargo, montar um pré-edital (quando só há banca definida) ou atualizar um edital oficial publicado.

## Protocolo
1. **Pré-Edital (quando o edital ainda não saiu):**
   - Cruzar os 2 últimos editais do órgão + Termo de Referência / contrato da banca (pesquisa atualizada) + mudanças legislativas recentes (ex.: Lei 14.133/2021, Novo Ensino Médio, Lei 14.533/2023, etc.).
   - Deixar explícito no subtítulo que é **Pré-Edital** e orientar o uso do botão **`Atualizar Edital (PDF / Texto)`** (`#btn-update-edital`) quando sair o edital normativo.
   - Quando um cargo mudou de nome por reestruturação de carreira (ex.: Técnico de Gestão Educacional → Analista PPGE), manter **ambos os nomes** no rótulo para facilitar busca.
2. **Atualização de Edital Sem Perda de Progresso:**
   - No app: usar `TracksManager.updateTrackEdital(trackId, newEdital, opts)` (preserva `answers`, `errorHistory`, `aiLessons`, `customFlashcards`, `checkedTopics`, `fc` e evita duplicar trilhas builtin em `listTracks()`).
   - No repositório (atualização global para todos os usuários): atualizar o arquivo em `src/data/*_edital_data.js` mantendo os mesmos `trackId` e `subjectId` sempre que possível, rodar `npm run check` e publicar.
3. **Integração obrigatória:**
   - Registrar em `TracksManager.getBuiltinTracks()`, adicionar card agrupado em `src/js/onboarding_wizard.js`, e linkar em `src/index.html`, `scripts/build.mjs` e `tests/core.test.mjs`.
