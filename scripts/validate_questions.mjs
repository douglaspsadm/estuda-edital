#!/usr/bin/env node
/**
 * Valida o banco de questões reais e os pacotes da Base Compartilhada do Estuda Edital.
 * Uso: node scripts/validate_questions.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");

const sandbox = { window: {} };
vm.createContext(sandbox);

const dataFiles = [
  "dpdf_edital_data.js",
  "dpdf_questions_reais.js",
  "quadrix_questions.js",
  "shared_bank.js"
];

for (const file of dataFiles) {
  const fullPath = path.join(DATA_DIR, file);
  const code = fs.readFileSync(fullPath, "utf8");
  vm.runInContext(code, sandbox, { filename: file });
}

const edital = sandbox.window.EDITAL_DATA;
const validSubjects = new Set(edital.disciplinas.map(d => d.id));
const validTopics = new Set(edital.disciplinas.flatMap(d => d.topicos.map(t => t.id)));
const dpdfQuestions = sandbox.window.QUESTIONS_REAIS || [];
const quadrixQuestions = sandbox.window.QUESTIONS_QUADRIX || [];
const allQuestions = [...dpdfQuestions, ...quadrixQuestions];

const seenIds = new Set();
const errors = [];
const warnings = [];

for (const q of dpdfQuestions) {
  if (!validSubjects.has(q.subjectId)) {
    errors.push(`[${q.id}] subjectId inválido no DPDF: '${q.subjectId}'`);
  }
  if (q.topicId && !validTopics.has(q.topicId)) {
    warnings.push(`[${q.id}] topicId '${q.topicId}' não consta literalmente no EDITAL_DATA.`);
  }
}

for (const q of allQuestions) {
  if (!q.id) {
    errors.push("Questão sem campo 'id'.");
    continue;
  }
  if (seenIds.has(q.id)) {
    errors.push(`ID duplicado: ${q.id}`);
  }
  seenIds.add(q.id);

  if (!q.subjectId) {
    errors.push(`[${q.id}] subjectId ausente.`);
  }
  if (!q.statement || typeof q.statement !== "string") {
    errors.push(`[${q.id}] Enunciado ('statement') ausente.`);
  }
  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push(`[${q.id}] Alternativas ('options') inválidas.`);
  } else if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
    errors.push(`[${q.id}] correctIndex fora do intervalo: ${q.correctIndex}`);
  }
  if (!q.explanation) {
    warnings.push(`[${q.id}] Sem campo 'explanation'.`);
  }
  if (!q.remediationLesson || !q.remediationLesson.coreConcept) {
    warnings.push(`[${q.id}] Sem 'remediationLesson' completa.`);
  }
}

const packs = sandbox.window.SHARED_BANK ? sandbox.window.SHARED_BANK.listPacks() : [];
const totalPacked = packs.reduce((acc, p) => acc + p.questionCount, 0);

console.log("=== RELATÓRIO DE VALIDAÇÃO — ESTUDA EDITAL ===");
console.log(`Total de questões reais : ${allQuestions.length}`);
console.log(`Pacotes Base Comum      : ${packs.length} (${totalPacked} questões mapeadas)`);
console.log(`Avisos                  : ${warnings.length}`);
console.log(`Erros críticos          : ${errors.length}`);

if (errors.length) {
  console.error("\nErros críticos:");
  errors.forEach(e => console.error("  -", e));
  process.exit(1);
}

console.log("\n✅ Validação concluída sem erros críticos!");
