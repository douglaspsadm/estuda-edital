import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..");

function createBrowserSandbox() {
  const store = new Map();
  const localStorage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
    clear: () => store.clear()
  };
  const sandbox = {
    window: {},
    localStorage,
    console,
    Date,
    Math,
    JSON,
    Set,
    Map,
    Array,
    Object,
    String,
    Number,
    RegExp,
    Error
  };
  sandbox.window.localStorage = localStorage;
  vm.createContext(sandbox);

  const files = [
    "src/data/dpdf_edital_data.js",
    "src/data/dpdf_questions_reais.js",
    "src/data/dpdf_lessons_data.js",
    "src/data/dpdf_discursive_data.js",
    "src/data/cofen_edital_data.js",
    "src/data/shared_bank.js",
    "src/js/tracks_manager.js",
    "src/js/ai_tutor.js",
    "src/js/pdf_importer.js"
  ];
  for (const rel of files) {
    const code = fs.readFileSync(path.join(ROOT, rel), "utf8");
    vm.runInContext(code, sandbox, { filename: rel });
  }
  return sandbox;
}

test("SHARED_BANK lista pacotes reais e faz matching automático com edital de outra área", () => {
  const { window } = createBrowserSandbox();
  const packs = window.SHARED_BANK.listPacks();
  assert.ok(packs.length >= 6);
  const totalMapped = packs.reduce((s, p) => s + p.questionCount, 0);
  assert.equal(totalMapped, 805);

  const tribunalEdital = {
    disciplinas: [
      { id: "d_port", nome: "Língua Portuguesa", topicos: [{ titulo: "Interpretação de texto e crase" }] },
      { id: "d_adm", nome: "Direito Administrativo", topicos: [{ titulo: "Licitações e Contratos — Lei 14.133/2021" }] },
      { id: "d_const", nome: "Direito Constitucional", topicos: [{ titulo: "Direitos e Garantias Fundamentais" }] }
    ]
  };

  const matches = window.SHARED_BANK.matchPacksToEdital(tribunalEdital);
  const matchedPackIds = matches.map(m => m.packId);
  assert.ok(matchedPackIds.includes("pack_portugues"));
  assert.ok(matchedPackIds.includes("pack_lei_14133"));

  const mappedQs = window.SHARED_BANK.buildMappedQuestionsForTrack(
    ["pack_portugues"],
    { pack_portugues: "d_port" }
  );
  assert.equal(mappedQs.length, 176);
  assert.ok(mappedQs.every(q => q.subjectId === "d_port"));
});

test("TracksManager isola progresso por track_id e suporta criar, exportar e importar trilhas", () => {
  const { window } = createBrowserSandbox();
  const tm = window.TracksManager;

  const builtins = tm.listTracks();
  assert.ok(builtins.some(t => t.id === "base_comum_concursos"));
  assert.ok(builtins.some(t => t.id === "dpdf_ti_2026"));

  // Cria trilha customizada
  const custom = tm.saveCustomTrack({
    edital: {
      metadata: { concurso: "TJ-SP 2026", cargo: "Escrevente", banca: "VUNESP" },
      disciplinas: [
        { id: "tjsp_port", nome: "Língua Portuguesa", categoria: "basicos", questoesProva: 24, peso: 1 }
      ]
    },
    enabledSharedPacks: ["pack_portugues"],
    packMapping: { pack_portugues: "tjsp_port" }
  });

  // Salva resposta na trilha customizada e verifica isolamento contra DPDF
  const stCustom = tm.getTrackState(custom.id);
  stCustom.answers["Q_TEST_1"] = { ok: true, timestamp: new Date().toISOString() };
  tm.saveTrackState(custom.id, stCustom);

  const stDpdf = tm.getTrackState("dpdf_ti_2026");
  assert.equal(stDpdf.answers["Q_TEST_1"], undefined);
  assert.equal(tm.getQuestionsForTrack(custom.id).length, 176);

  // Exporta e reimporta bundle
  const bundle = tm.exportTrackBundle(custom.id);
  assert.equal(bundle.format, "estuda_edital_track_v1");
  const reimported = tm.importTrackBundle(bundle);
  assert.equal(reimported.shortName, "TJ-SP 2026");
});

test("PdfImporter faz parse heurístico de edital, filtro de páginas e split de prova em lotes", () => {
  const { window } = createBrowserSandbox();
  const pi = window.PdfImporter;

  const range = pi.parsePageRange("1, 18-20", 30);
  assert.deepEqual(Array.from(range).sort((a, b) => a - b), [1, 18, 19, 20]);

  const sampleEdital = `
    CONHECIMENTOS BÁSICOS
    LÍNGUA PORTUGUESA:
    1 Compreensão e interpretação de textos.
    2 Emprego do sinal indicativo de crase.

    CONHECIMENTOS ESPECÍFICOS
    DIREITO CONSTITUCIONAL:
    1 Princípios fundamentais da República.
  `;
  const edital = pi.structureEditalHeuristic(sampleEdital, { concurso: "Teste Nacional", banca: "FGV" });
  assert.equal(edital.metadata.concurso, "Teste Nacional");
  assert.equal(edital.disciplinas.length, 2);
  assert.equal(edital.disciplinas[0].categoria, "basicos");
  assert.equal(edital.disciplinas[1].categoria, "especificos");

  const sampleExam = Array.from({ length: 12 }, (_, i) =>
    `QUESTÃO ${i + 1}\nEnunciado de teste suficientemente longo para passar no filtro da questão número ${i + 1}.\nA) Opção A\nB) Opção B`
  ).join("\n\n");
  const batches = pi.splitExamIntoBatches(sampleExam, 6);
  assert.equal(batches.length, 2);
});

test("AI_TUTOR.extractJsonFromText limpa cercas markdown e vírgulas finais", () => {
  const { window } = createBrowserSandbox();
  const raw = "Aqui está o JSON:\n```json\n{\"ok\": true, \"items\": [1, 2,]}\n```";
  const parsed = window.AI_TUTOR.extractJsonFromText(raw);
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.items, [1, 2]);
});

test("COFEN 2026 registra todos os 13 cargos com diferenciação TI (Inglês + 305q TI) vs Não-TI (Informática)", () => {
  const { window } = createBrowserSandbox();
  const tm = window.TracksManager;
  const cofenTracks = tm.listTracks().filter(t => t.groupId === "cofen_2026");
  assert.equal(cofenTracks.length, 13);

  // Cargo 404 (Analista de Sistemas — TI): Língua Inglesa + 602 questões reais (Port 176 + Leg 121 + TI 305)
  const tiTrack = tm.getTrackById("cofen_2026_404");
  assert.ok(tiTrack);
  assert.ok(tiTrack.edital.disciplinas.some(d => d.id === "cofen_bas_ingles"));
  assert.ok(!tiTrack.edital.disciplinas.some(d => d.id === "cofen_bas_info"));
  assert.equal(tm.getQuestionsForTrack("cofen_2026_404").length, 602);

  // Cargo 411 (Enfermeiro — Não-TI): Noções de Informática + 332 questões reais (Port 176 + Info 35 + Leg 121)
  const enfTrack = tm.getTrackById("cofen_2026_411");
  assert.ok(enfTrack);
  assert.ok(enfTrack.edital.disciplinas.some(d => d.id === "cofen_bas_info"));
  assert.ok(!enfTrack.edital.disciplinas.some(d => d.id === "cofen_bas_ingles"));
  assert.equal(tm.getQuestionsForTrack("cofen_2026_411").length, 332);
});
