# AGENTS.md — Estuda Edital

Regras obrigatórias e roteamento de agentes/skills para qualquer IA ou contribuidor que trabalhe neste repositório.

## 1. Fluxo Técnico Obrigatório
- Edite sempre os arquivos modulares em `src/` (nunca edite `public/` ou `dist/` manualmente).
- Leia `STATE.md` primeiro ao iniciar qualquer sessão para retomar o contexto sem varrer o repositório.
- Antes de concluir alterações, execute sempre:
  ```bash
  npm run check
  ```
- Atualize `STATE.md`, commite e faça `git push origin main` ao concluir blocos relevantes.
- Nunca commite chaves de API, senhas ou credenciais privadas (a IA é 100% BYOK no navegador do usuário).

## 2. Tabela de Roteamento de Agentes e Skills (`.agents/`)

| Tipo de Pedido / Tarefa | Agente (`.agents/agents/`) | Skills Vinculadas (`.agents/skills/`) |
|---|---|---|
| Subir prova nova, pasta do Drive, gabarito ou discursivas | `exam-ingestor` | `exam-ingestor`, `qa-verifier`, `perf-stack` |
| Criar novo concurso, pré-edital ou atualizar edital oficial | `edital-curator` | `edital-curator`, `qa-verifier`, `perf-stack` |
| Aulas por IA, Dicas Cirúrgicas, Flashcards ou revisão espaçada | `study-content-factory` | `study-content-factory`, `qa-verifier`, `perf-stack` |
| UI/UX, onboarding, modelos Gemini, filtros/ordem de questões | `ui-ux-guardian` | `ui-ux-guardian`, `qa-verifier`, `perf-stack` |
| Testes, auditoria de cobertura por concurso, Playwright E2E | `qa-verifier` | `qa-verifier`, `perf-stack` |
| Economia de tokens, setup de ferramentas (`rtk`, `graphify`) | `token-optimizer` | `perf-stack` |

## 3. Regra Obrigatória: Ingestão de Provas Novas (Pipeline Completo)
**SEMPRE** que uma nova prova ou pasta de provas for enviada (PDF, Drive ou texto), execute o protocolo de `.agents/skills/exam-ingestor/SKILL.md`:
1. **Tratar todas as questões objetivas:** extrair enunciados completos, alternativas/itens (C/E ou múltipla escolha), cruzar com o **gabarito oficial definitivo** (descartando anuladas) e deduplicar.
2. **Auditar aderência edital por edital:** avaliar quais blocos **realmente cabem** em cada concurso (`DPDF TI`, `COFEN`, `SEEDF`, `Base Comum` e futuras trilhas) — sem misturar matérias incompatíveis — e registrar em `src/data/shared_bank.js`, `src/js/tracks_manager.js`, `src/index.html` e `scripts/build.mjs`.
3. **Organizar para Simulado e Concurso Completo:** confirmar que `TracksManager.getQuestionsForTrack(trackId)` entrega as novas questões para a trilha alvo e para os filtros de **Simulado Cronometrado** e **Concurso Completo**.
4. **Aproveitar todas as Discursivas / Redações:** varrer todos os PDFs (inclusive gabaritos definitivos) por propostas discursivas e padrões de resposta oficiais, registrando em `src/data/shared_discursive_bank.js`.
5. **Validar e reportar:** rodar `npm run check`, reportar quantas questões novas entraram em **cada** concurso, atualizar `STATE.md`, commitar e dar `push`.

## 4. Stack de Economia de Tokens (`perf-stack`)
- Em ambiente novo, execute `bash scripts/setup-perf-tools.sh` para instalar `rtk`, `graphify`, `context-mode` e `headroom`.
- **Nunca** leia arquivos de bancos gigantes (`src/data/*_questions*.js`, `dist/*.html`) inteiros no contexto; use scripts Node/Python curtos ou intervalos de linhas direcionados.
- Prefixe comandos barulhentos (`git status`, `git diff`, `git log`, `ls`) com `rtk` quando disponível.
