---
name: ui-ux-guardian
description: Memória viva de todas as decisões e correções de UX, design anti-AI-slop, modelos de IA e fluxo de questões do Estuda Edital.
---
# Skill: ui-ux-guardian

## Quando usar
Antes de qualquer mudança de interface, onboarding, telas de IA, filtros de questões ou layout responsivo.

## Lições Aprendidas & Regras Invioláveis (Não Regredir!)
1. **Onboarding (Primeiro Acesso):**
   - Mostrar os **concursos disponíveis para seleção primeiro** (SEEDF, COFEN, DPDF, Base Comum); a explicação de chave de IA (BYOK) vem **depois**, nunca bloqueando o primeiro uso.
2. **Modelos de IA (Google Gemini):**
   - Modelo padrão: **`gemini-4-hydrogen`**.
   - **Nunca** usar aliases `-latest` (ficam sobrecarregados com frequência).
   - Sempre oferecer **seletor rápido de modelo** dentro das telas de gerar Aula e Dica Cirúrgica para troca imediata em caso de sobrecarga/erro 429/503.
3. **Feedback Visual em Chamadas de IA:**
   - Toda chamada de IA (Aula, Dica Cirúrgica, Correção Discursiva) deve exibir spinner + nome do modelo + contador de segundos (`ai-loading-banner`) enquanto gera, e toast claro ao concluir ou falhar.
4. **Fluxo de Questões & Reordenação:**
   - Ao alternar **Ordem: Aleatória / Original** ou **Embaralhar novamente**, questões **não respondidas devem vir sempre primeiro** — nunca jogar o aluno de volta em questões já respondidas.
   - Manter `diagJustAnsweredId` visível logo após responder para que o aluno leia o gabarito e peça Dica Cirúrgica sem a tela pular; mover para o fim só ao clicar em **Próxima** ou reordenar.
5. **Estética Anti-AI-Slop:**
   - Interface limpa, sem poluição visual, sem cards redundantes ou textos excessivos; mobile-first legível em telas de 360px+.
   - Editar sempre `src/` (nunca editar `public/` ou `dist/` diretamente).
