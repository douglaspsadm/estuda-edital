---
name: study-content-factory
description: Padroniza geração, curadoria e evolução de Aulas Cirúrgicas, Dicas Cirúrgicas e Flashcards Unificados com revisão espaçada.
---
# Skill: study-content-factory

## Quando usar
Ao ajustar prompts de IA, geração de aulas personalizadas, dicas cirúrgicas de questões, cache comunitário ou motor de flashcards.

## Regras de Produto e Qualidade Pedagógica
1. **Aulas Cirúrgicas (Erro → Aula):**
   - Focar 100% nas lacunas registradas pelo aluno (especialmente erros marcados com confiança `certeza`).
   - Sempre incluir no prompt a seção final `## Flashcards de Revisão` com 3 cartões no formato `- **Frente:** ... | **Verso:** ...`.
   - `saveGeneratedAiLesson` extrai automaticamente os cartões para `state.customFlashcards` (com fallback por headings caso o modelo fuja do formato) — **zero chamada extra de API**.
2. **Dicas Cirúrgicas de Questões:**
   - Linguagem direta, curta, sem repetir enunciado (`title`, `explanation`, `coreConcept`, `accessTrap`, `mnemonic`).
   - Ao gerar com IA, **sempre** criar automaticamente 1 flashcard (`createFlashcardFromTip`) e publicar no cache comunitário (`CloudSync.publishSharedExplanation`) quando for questão oficial.
3. **Flashcards Unificados:**
   - **Nunca** travar o baralho apenas no `preset` da trilha. Somar: `Aulas IA / Dicas IA / Manuais` → `Erros do aluno` → `Preset` → `Micro-aulas da trilha`, sem duplicatas.
   - Revisão espaçada **sempre** por **ID estável (`state.fc[card.id]`)**, nunca por índice numérico.
4. **Modo 100% Sem IA:**
   - O aluno pode criar/apagar flashcards manuais, revisar erros e usar aulas/micro-aulas embutidas sem configurar nenhuma chave de API.
