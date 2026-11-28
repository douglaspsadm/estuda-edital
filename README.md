# Estuda Edital — Plataforma Adaptativa Multi-Concurso

Plataforma web estática (custo zero de servidor, pronta para **Vercel** e uso **100% offline**) para estudo adaptativo de **qualquer concurso público**:

**Escolher Concurso / Subir Edital → Questões Reais por Disciplina → Caderno de Erros Incremental → Aula Cirúrgica (IA ou Externa) & Flashcards Automáticos → Revisão Espaçada (1/7/21/45 dias) → Simulado & Concurso Completo.**

---

## Concursos Prontos & Bancos Reais
- **3.078 questões reais validadas** organizadas em **19 pacotes temáticos** reaproveitáveis ([`src/data/shared_bank.js`](src/data/shared_bank.js)).
- **43 temas discursivos reais** (Quadrix, CEBRASPE, IADES) com padrões de resposta oficiais ([`src/data/shared_discursive_bank.js`](src/data/shared_discursive_bank.js)).
- **Trilhas prontas incluídas:**
  - **SEEDF 2026/2027 (20 cargos — Pré-Edital Quadrix):** Professor (Atividades + licenciaturas), Pedagogo, Gestor PPGE e Analista PPGE / Técnico de Gestão Educacional — Apoio Administrativo. Atualizável em 1 clique quando sair o edital oficial sem perder progresso.
  - **COFEN 2026 (13 cargos — Quadrix):** Enfermeiro, Analista de Sistemas, Advogado, Contador, Analista Administrativo, Comunicação Social e demais cargos.
  - **DPDF 2026 — TI (Instituto ACCESS):** 17 disciplinas, 1.625 questões reais, aulas-base e discursivas.
  - **Base Nacional Comum (Pré-Edital):** 1.350 questões das matérias universais de concursos.
  - **Qualquer outro concurso:** suba o PDF ou cole o texto do edital para criar sua trilha personalizada.

---

## Funcionalidades Principais
- **Prática por Questões:** seletor de disciplina sempre visível no topo, modo Foco (1 por vez) ou Lista, ordem Aleatória/Original que **sempre prioriza questões não respondidas**, e lembrete de intercalação a cada 25 questões.
- **Caderno de Erros Incremental & Aulas Cirúrgicas:**
  - Separação limpa entre **Meus Erros** e **Aulas Geradas** (mostrando quais disciplinas e questões cada aula cobre).
  - Gera aulas apenas dos **erros novos** (sem repetir o que já teve aula).
  - **Funciona com ou sem chave de API:** use sua chave gratuita (BYOK — Google Gemini `gemini-4-hydrogen` / OpenAI salva só no seu navegador) **ou** clique em **Copiar Prompt**, gere no ChatGPT/Claude/Gemini e traga de volta em **+ Importar aula** (`.md`, `.txt` ou colar texto).
- **Flashcards Unificados + Auto-Geração por IA:** toda Aula IA, Aula Importada e Dica Cirúrgica gera flashcards automaticamente com revisão espaçada por ID estável, filtros (*Todos*, *Vencidos*, *Aulas & Dicas IA*, *Erros*, por disciplina) e criação manual.
- **Revisão Espaçada do Dia (1, 7, 21 e 45 dias):** painel integrado com Flashcards e Caderno de Erros, agenda das próximas revisões por disciplina e botão **Antecipar revisão rápida**.
- **Simulado Cronometrado & Concurso Completo:** prova objetiva proporcional ao edital + redação/estudo de caso com cronômetro.
- **Atualizar Edital Sem Perder Progresso:** na aba **Edital**, atualize qualquer trilha quando sair o edital oficial preservando respostas, erros, aulas e flashcards.
- **Uso Offline (`localStorage`) + Nuvem Gratuita (Supabase):** funciona sem login no navegador e sincroniza entre PC e celular quando logado.

---

## Desenvolvimento, Testes e Deploy

```bash
npm run check   # valida questões + roda testes unitários + gera public/ (Vercel) e dist/ (HTML offline)
```

* Edite sempre os arquivos em `src/` (nunca edite `public/` ou `dist/` manualmente).
* **Uso local / 100% offline:** após rodar `npm run check`, você pode abrir `dist/estuda_edital_offline.html` diretamente no navegador (sem servidor) ou servir `public/` localmente (`npx serve public` ou `python3 -m http.server -d public 8080`).

### Deploy Gratuito na Vercel (Passo a Passo)
O arquivo [`vercel.json`](vercel.json) já deixa tudo pré-configurado:
1. Acesse [vercel.com](https://vercel.com), clique em **Add New → Project** e importe este repositório (ou o seu fork).
2. Confira as configurações (a Vercel já detecta automaticamente pelo `vercel.json`):
   * **Framework Preset:** `Other`
   * **Root Directory:** `./`
   * **Build Command:** `npm run check`
   * **Output Directory:** `public`
   * **Install Command:** *(não precisa de dependências extras; pode deixar padrão ou vazio — o build usa apenas Node.js nativo)*
   * **Environment Variables:** nenhuma obrigatória (as chaves de IA são BYOK no navegador do usuário e a chave pública do Supabase fica em `src/js/supabase_env.js`).
3. Clique em **Deploy**. A cada `git push` na branch `main`, a Vercel roda `npm run check` (validando questões e testes antes de publicar) e atualiza o site automaticamente.
4. *(Opcional)* Se usar login/nuvem com Supabase, adicione o domínio gerado (`https://seu-projeto.vercel.app/**`) em **Authentication → URL Configuration → Redirect URLs** no painel do Supabase.

### Usando seu próprio Supabase (para quem fizer fork/clone)
1. Crie um projeto gratuito no [Supabase](https://supabase.com).
2. Execute [`supabase/schema.sql`](supabase/schema.sql) no **SQL Editor** do Supabase (ativa as tabelas e o **RLS** que isola os dados de cada usuário).
3. Substitua `url` e a chave pública (`sb_publishable_...` / `anon`) em [`src/js/supabase_env.js`](src/js/supabase_env.js) pelas do seu projeto (**nunca** coloque a chave `service_role` no frontend).
4. Em **Authentication → URL Configuration**, adicione apenas o domínio oficial do seu site nas *Redirect URLs*.

---

## Agentes de IA & Economia de Tokens (`.agents/`)
Este repositório já inclui **6 agentes e 6 skills** em `.agents/` (roteados em [`AGENTS.md`](AGENTS.md)):
- `exam-ingestor` (ingestão de provas + auditoria edital por edital + discursivas)
- `edital-curator` (criação/atualização de editais com handoff para herdar questões existentes)
- `study-content-factory` (Aulas Cirúrgicas, Dicas Cirúrgicas e Flashcards)
- `ui-ux-guardian` (memória de regras de UX e prevenção de regressões)
- `qa-verifier` (`npm run check` + auditoria por trilha + Playwright E2E)
- `token-optimizer` (`perf-stack` — instale ferramentas locais com `bash scripts/setup-perf-tools.sh`)

---

## Licença
Este projeto está licenciado sob **[CC BY-NC-SA 4.0](LICENSE)** (Creative Commons Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional):
* ✅ **Livre para usar, estudar, copiar e melhorar** gratuitamente.
* ✅ **Atribuição:** mantenha o crédito ao projeto original.
* ❌ **Uso comercial proibido:** não é permitido vender o sistema ou cobrar assinatura por ele.
* 🔁 **CompartilhaIgual:** versões modificadas devem permanecer abertas sob a mesma licença.

