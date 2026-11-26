# Estuda Edital — Plataforma Adaptativa Multi-Concurso

Plataforma estática (custo zero de servidor) para estudo adaptativo de qualquer concurso público:

**Edital Dinâmico (por `track_id`) → Banco Compartilhado + Upload de Provas/PDF → Prática & Registro de Erros → Aula Cirúrgica com IA (BYOK) → Revisão Espaçada.**

## Origem
Baseado na arquitetura e motor de `douglaspsadm/dpdf-ti-estudo` (reaproveitando `ai_tutor.js`, `cloud_sync.js`, `app.js`, `styles.css` e `build.mjs`), evoluído para suportar múltiplas trilhas de concurso.

## Próximos Passos
1. Wizard guiado de onboarding (1. Chave IA → 2. Subir/Colar Edital → 3. Base Comum / Provas → 4. Estudar).
2. Leitura de PDF no navegador via `pdf.js` com chunking inteligente para respeitar limites de tokens.
3. Isolamento de estado e sincronização Supabase por `(user_id, track_id)`.
4. Extração das disciplinas universais (`Língua Portuguesa`, `Informática`, `LAI`, `LGPD`, `Lei 14.133`, `Raciocínio Lógico`) para banco compartilhado opcional.
