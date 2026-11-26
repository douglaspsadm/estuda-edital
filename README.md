# Estuda Edital — Plataforma Adaptativa Multi-Concurso

Plataforma web estática (custo zero de servidor, pronta para **Vercel**) para estudo adaptativo de **qualquer concurso público** em qualquer área:

**Wizard Guiado (Edital Dinâmico por `track_id`) → Base Compartilhada de Questões Reais + Upload de Provas PDF/JSON → Prática & Caderno de Erros → Aula Cirúrgica com IA (BYOK) → Revisão Espaçada (2/7/21/45 dias).**

## Funcionalidades Principais
- **Multi-Concurso (`track_id`)**: alterne entre trilhas prontas (**Base Nacional Comum — Pré-Edital** e **DPDF 2026 — TI com 805 questões reais**) ou crie quantas trilhas próprias quiser subindo o PDF ou colando o conteúdo programático do seu edital.
- **Wizard Guiado em 4 Passos (para leigos)**:
  1. Conectar chave gratuita de IA (Google Gemini via AI Studio ou OpenAI — BYOK, salva só no navegador) ou pular.
  2. Subir PDF / colar Edital (com prévia editável) ou escolher uma trilha pronta.
  3. Ligar pacotes compatíveis da **Base Compartilhada** (auto-detectados pelo edital) e/ou subir provas.
  4. Começar a estudar imediatamente.
- **Leitura de PDF 100% no Navegador (`pdf.js`)**: carrega sob demanda, filtra automaticamente páginas de conteúdo programático/cronograma, divide editais em chunks seguros (~12k chars) e extrai provas em lotes pequenos (5–6 questões por chamada) casando com o gabarito oficial.
- **Banco Compartilhado Reaproveitável (`src/data/shared_bank.js`)**: 805 questões reais validadas organizadas em 8 pacotes temáticos (`Língua Portuguesa`, `Noções de Informática`, `LAI/LGPD & Governança`, `Licitações — Lei 14.133`, `Lei Maria da Penha`, `Primeiros Socorros`, `Legislação DF` e `TI & Dev`) com remapeamento automático para as disciplinas do edital do aluno.
- **Uso Sem Login (`localStorage`) + Nuvem Gratuita (Supabase)**: funciona imediatamente offline no navegador e sincroniza entre PC e celular quando logado, com isolamento por `(user_id, track_id)` (ver `supabase/schema.sql`).
- **Compartilhamento de Trilhas**: exporte e importe qualquer trilha completa (`.json`, formato `estuda_edital_track_v1`).

## Desenvolvimento e Deploy
```bash
npm run check   # valida banco + roda testes unitários + gera public/ (Vercel) e dist/ (offline)
```

Deploy estático gratuito na **Vercel**: conecte este repositório — o `vercel.json` já aponta `buildCommand: "npm run check"` e `outputDirectory: "public"`.
