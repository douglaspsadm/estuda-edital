// ============================================================================
// GERENCIADOR DE TRILHAS MULTI-CONCURSO (track_id)
// ============================================================================
// Isola edital, questões, aulas, erros, revisões e simulados por track_id.
// Mantém 100% de compatibilidade com o motor adaptativo de estudo (app.js).
// ============================================================================

(function () {
  "use strict";

  const WORKSPACE_KEY = "ESTUDA_EDITAL_WORKSPACE_V1";

  // Captura os templates originais do DPDF TI carregados antes deste script
  const DPDF_EDITAL_SNAPSHOT = window.EDITAL_DATA ? JSON.parse(JSON.stringify(window.EDITAL_DATA)) : null;
  const DPDF_LESSONS_SNAPSHOT = window.LESSONS_DATA ? JSON.parse(JSON.stringify(window.LESSONS_DATA)) : {};
  const DPDF_DISCURSIVE_SNAPSHOT = window.DISCURSIVE_AND_FLASHCARDS
    ? JSON.parse(JSON.stringify(window.DISCURSIVE_AND_FLASHCARDS))
    : { temasDissertacao: [], questoesTecnicasDiscursivas: [], flashcards: [] };

  const DISCIPLINE_COLORS = [
    "#3b82f6", "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981",
    "#ec4899", "#ef4444", "#6366f1", "#14b8a6", "#f97316"
  ];

  // Template pronto 2: Base Nacional Comum (qualquer concurso / pré-edital)
  const BASE_COMUM_EDITAL = {
    metadata: {
      concurso: "Base Nacional Comum — Pré-Edital",
      edital: "Trilha Universal de Disciplinas Básicas (Questões Reais)",
      banca: "Multibanca (CEBRASPE, FGV, FCC, IADES, Quadrix, ACCESS)",
      cargo: "Qualquer Área — Formação de Base",
      provas: {
        dataProva: "",
        objetiva: {
          turno: "Flexível",
          duracaoHoras: 4.0,
          tipo: "Múltipla Escolha / Certo ou Errado",
          totalQuestoes: 50,
          totalPontos: 50.0,
          corteMinimoGeral: 25.0,
          corteMinimoBasicos: 15.0,
          corteMinimoEspecificos: 0,
          regraPortugues: "Não zerar Língua Portuguesa"
        },
        discursiva: {
          turno: "Opcional",
          duracaoHoras: 2.0,
          totalPontos: 20.0,
          dissertacao: {
            tema: "Atualidades / Estudo de Caso",
            maxLinhas: 30,
            valorMaximo: 20.0,
            notaMinima: 10.0,
            formula: "ND = NC - (4 × NE ÷ TL)"
          }
        }
      }
    },
    cronograma: [
      { ordem: 1, evento: "Diagnóstico Inicial (Resolver 20 questões de cada disciplina base)", data: "Semana 1", destaque: true },
      { ordem: 2, evento: "Caderno de Erros + Aulas Cirúrgicas IA nos tópicos críticos", data: "Contínuo" },
      { ordem: 3, evento: "Revisão Espaçada (2d / 7d / 21d / 45d)", data: "Diário" }
    ],
    disciplinas: [
      {
        id: "comum_port",
        codigo: "BAS-01",
        nome: "Língua Portuguesa",
        categoria: "basicos",
        questoesProva: 15,
        peso: 1,
        pontosProva: 15.0,
        prioridade: "Alta",
        cor: "#3b82f6",
        descricao: "Interpretação de texto, coesão, morfossintaxe, crase, regência, concordância e reescrita.",
        topicos: [
          { id: "comum_port_1", numero: "1", titulo: "Compreensão e Interpretação de Textos", subitens: "Inferência, tipologia e gêneros textuais." },
          { id: "comum_port_2", numero: "2", titulo: "Coesão, Coerência e Conectores", subitens: "Conjunções, referenciação e tempos verbais." },
          { id: "comum_port_3", numero: "3", titulo: "Morfossintaxe, Concordância, Regência e Crase", subitens: "Sintaxe do período, crase, colocação pronominal e pontuação." }
        ]
      },
      {
        id: "comum_info",
        codigo: "BAS-02",
        nome: "Noções de Informática",
        categoria: "basicos",
        questoesProva: 10,
        peso: 1,
        pontosProva: 10.0,
        prioridade: "Média",
        cor: "#06b6d4",
        descricao: "Sistemas operacionais, suítes de escritório, redes, navegadores, nuvem e segurança da informação.",
        topicos: [
          { id: "comum_info_1", numero: "1", titulo: "Sistemas Operacionais e Escritório", subitens: "Windows, Linux, Word/Writer, Excel/Calc." },
          { id: "comum_info_2", numero: "2", titulo: "Redes, Internet e Segurança Digital", subitens: "Protocolos, navegadores, ameaças e backup." }
        ]
      },
      {
        id: "comum_lai_lgpd",
        codigo: "BAS-03",
        nome: "LAI, LGPD & Governança",
        categoria: "basicos",
        questoesProva: 10,
        peso: 1,
        pontosProva: 10.0,
        prioridade: "Alta",
        cor: "#8b5cf6",
        descricao: "Lei de Acesso à Informação (12.527/2011), LGPD (13.709/2018), gestão e governança pública.",
        topicos: [
          { id: "comum_lai_1", numero: "1", titulo: "Lei de Acesso à Informação (Lei 12.527/2011)", subitens: "Transparência ativa/passiva, prazos e sigilo." },
          { id: "comum_lgpd_2", numero: "2", titulo: "LGPD (Lei 13.709/2018)", subitens: "Bases legais, princípios, direitos do titular e ANPD." }
        ]
      },
      {
        id: "comum_14133",
        codigo: "BAS-04",
        nome: "Licitações e Contratos (Lei 14.133/2021)",
        categoria: "basicos",
        questoesProva: 10,
        peso: 1,
        pontosProva: 10.0,
        prioridade: "Alta",
        cor: "#f59e0b",
        descricao: "Nova Lei de Licitações e Contratos Administrativos, modalidades, dispensa, inexigibilidade e fiscalização.",
        topicos: [
          { id: "comum_14133_1", numero: "1", titulo: "Modalidades, Critérios e Contratação Direta", subitens: "Pregão, concorrência, diálogo competitivo, dispensa e inexigibilidade." },
          { id: "comum_14133_2", numero: "2", titulo: "Execução e Fiscalização de Contratos", subitens: "Sanções, alterações contratuais, gestor e fiscal." }
        ]
      },
      {
        id: "comum_maria",
        codigo: "BAS-05",
        nome: "Lei Maria da Penha (Lei 11.340/2006)",
        categoria: "basicos",
        questoesProva: 3,
        peso: 1,
        pontosProva: 3.0,
        prioridade: "Média",
        cor: "#ec4899",
        descricao: "Formas de violência doméstica, medidas protetivas de urgência e atendimento policial/judicial.",
        topicos: [
          { id: "comum_maria_1", numero: "1", titulo: "Formas de Violência e Medidas Protetivas", subitens: "Arts. 1º a 46 da Lei 11.340/2006 e súmulas STJ." }
        ]
      },
      {
        id: "comum_socorros",
        codigo: "BAS-06",
        nome: "Noções de Primeiros Socorros",
        categoria: "basicos",
        questoesProva: 2,
        peso: 1,
        pontosProva: 2.0,
        prioridade: "Baixa",
        cor: "#ef4444",
        descricao: "Suporte básico de vida, RCP, engasgo, hemorragias, queimaduras e fraturas.",
        topicos: [
          { id: "comum_socorros_1", numero: "1", titulo: "Suporte Básico de Vida e Emergências", subitens: "RCP, manobra de Heimlich, contenção de sangramentos." }
        ]
      }
    ]
  };

  function getBuiltinTracks() {
    const list = [];

    list.push({
      id: "base_comum_concursos",
      builtin: true,
      badge: "BASE",
      shortName: "Base Nacional Comum",
      subtitle: "Pré-Edital • Qualquer Área",
      description: "Disciplinas básicas universais (Português, Informática, LAI/LGPD, Lei 14.133, Maria da Penha e Primeiros Socorros) com +370 questões reais prontas.",
      edital: BASE_COMUM_EDITAL,
      enabledSharedPacks: [
        "pack_portugues",
        "pack_informatica",
        "pack_lai_lgpd",
        "pack_lei_14133",
        "pack_maria_penha",
        "pack_socorros"
      ],
      packMapping: {
        pack_portugues: "comum_port",
        pack_informatica: "comum_info",
        pack_lai_lgpd: "comum_lai_lgpd",
        pack_lei_14133: "comum_14133",
        pack_maria_penha: "comum_maria",
        pack_socorros: "comum_socorros"
      },
      lessons: {},
      discursive: { temas: [] }
    });

    if (window.COFEN_2026_DATA && typeof window.COFEN_2026_DATA.buildTracks === "function") {
      list.push(...window.COFEN_2026_DATA.buildTracks());
    }

    if (DPDF_EDITAL_SNAPSHOT) {
      list.push({
        id: "dpdf_ti_2026",
        builtin: true,
        badge: "TI",
        shortName: "DPDF 2026 — TI",
        subtitle: "Desenvolvimento de Sistemas • ACCESS",
        description: "Trilha completa pronta do Edital Nº 1 DPDF (Cargo 4 — TI), com 17 disciplinas, 805 questões reais comentadas, aulas-base e discursivas.",
        edital: DPDF_EDITAL_SNAPSHOT,
        useFullDpdfBank: true,
        enabledSharedPacks: [],
        packMapping: {},
        lessons: DPDF_LESSONS_SNAPSHOT,
        discursive: DPDF_DISCURSIVE_SNAPSHOT
      });
    }

    return list;
  }

  function getDefaultTrackProgressState(edital) {
    const firstSubj = edital && Array.isArray(edital.disciplinas) && edital.disciplinas[0]
      ? edital.disciplinas[0].id
      : "ALL";
    return {
      answers: {},
      errorHistory: [],
      customQuestions: [],
      aiLessons: [],
      completedLessons: {},
      checkedTopics: {},
      discursiveDrafts: {},
      customDiscursiveThemes: [],
      reviews: {},
      errors: {},
      simulados: [],
      fc: {},
      flashcardIndex: 0,
      flashcardFlipped: false,
      currentView: "dashboard",
      dashSubjectFilter: "ALL",
      currentDiagSubject: "ALL",
      currentDiagStatus: "ALL",
      currentDiagBanca: "ALL",
      currentDiagOrigin: "ALL",
      diagMode: "focus",
      diagFocusIdx: 0,
      currentLessonSubject: firstSubj,
      errorTopicFilter: "ALL",
      discursiveTab: "write",
      selectedDiscursiveId: "",
      lastSaved: new Date().toISOString()
    };
  }

  function getDefaultWorkspace() {
    return {
      version: 1,
      activeTrackId: "base_comum_concursos",
      theme: "dark",
      onboardingCompleted: false,
      customTracks: {},
      trackStates: {},
      lastSaved: new Date().toISOString()
    };
  }

  function loadWorkspace() {
    try {
      const raw = localStorage.getItem(WORKSPACE_KEY);
      if (!raw) return getDefaultWorkspace();
      const parsed = JSON.parse(raw);
      return Object.assign(getDefaultWorkspace(), parsed || {});
    } catch (e) {
      return getDefaultWorkspace();
    }
  }

  let workspace = loadWorkspace();

  function persistWorkspace() {
    try {
      workspace.lastSaved = new Date().toISOString();
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
    } catch (e) {
      console.error("Erro ao salvar workspace no localStorage:", e);
    }
  }

  function normalizeEdital(rawEdital) {
    const src = rawEdital && typeof rawEdital === "object" ? rawEdital : {};
    const meta = src.metadata && typeof src.metadata === "object" ? src.metadata : {};
    const provas = meta.provas && typeof meta.provas === "object" ? meta.provas : {};
    const obj = provas.objetiva && typeof provas.objetiva === "object" ? provas.objetiva : {};
    const disc = provas.discursiva && typeof provas.discursiva === "object" ? provas.discursiva : {};

    const rawDisciplinas = Array.isArray(src.disciplinas) ? src.disciplinas : [];
    const disciplinas = rawDisciplinas.map((d, idx) => {
      const id = (d && d.id ? String(d.id) : `disc_${idx + 1}`).replace(/[^a-zA-Z0-9_-]/g, "_");
      const topicosRaw = Array.isArray(d && d.topicos) ? d.topicos : [];
      const topicos = topicosRaw.length
        ? topicosRaw.map((t, ti) => ({
            id: (t && t.id ? String(t.id) : `${id}_t${ti + 1}`).replace(/[^a-zA-Z0-9_-]/g, "_"),
            numero: t && t.numero != null ? String(t.numero) : String(ti + 1),
            titulo: (t && t.titulo) ? String(t.titulo) : `Tópico ${ti + 1}`,
            subitens: (t && t.subitens) ? String(t.subitens) : "",
            resumoChave: (t && t.resumoChave) ? String(t.resumoChave) : ""
          }))
        : [{ id: `${id}_t1`, numero: "1", titulo: "Conteúdo Geral", subitens: (d && d.descricao) || "", resumoChave: "" }];

      const questoesProva = Number(d && d.questoesProva) || 10;
      const peso = Number(d && d.peso) || 1;
      const pontosProva = Number(d && d.pontosProva) || Number((questoesProva * peso).toFixed(1));
      const categoria = (d && d.categoria === "especificos") ? "especificos" : "basicos";

      return {
        id,
        codigo: (d && d.codigo) || `${categoria === "especificos" ? "ESP" : "BAS"}-${String(idx + 1).padStart(2, "0")}`,
        nome: (d && d.nome) ? String(d.nome).trim() : `Disciplina ${idx + 1}`,
        categoria,
        questoesProva,
        peso,
        pontosProva,
        prioridade: (d && d.prioridade) || (peso > 1 ? "Alta" : "Média"),
        cor: (d && d.cor) || DISCIPLINE_COLORS[idx % DISCIPLINE_COLORS.length],
        descricao: (d && d.descricao) ? String(d.descricao) : "",
        topicos
      };
    });

    const totalQuestoesCalc = disciplinas.reduce((s, d) => s + (Number(d.questoesProva) || 0), 0) || 60;
    const totalPontosCalc = disciplinas.reduce((s, d) => s + (Number(d.pontosProva) || 0), 0) || totalQuestoesCalc;

    return {
      metadata: {
        concurso: meta.concurso || "Meu Concurso",
        edital: meta.edital || "Edital Personalizado",
        banca: meta.banca || "A definir",
        cargo: meta.cargo || "Cargo / Especialidade",
        remuneracao: meta.remuneracao || null,
        vagas: meta.vagas || null,
        provas: {
          dataProva: provas.dataProva || "",
          objetiva: {
            turno: obj.turno || "A definir",
            duracaoHoras: Number(obj.duracaoHoras) || 4.0,
            tipo: obj.tipo || "Múltipla Escolha",
            totalQuestoes: Number(obj.totalQuestoes) || totalQuestoesCalc,
            totalPontos: Number(obj.totalPontos) || totalPontosCalc,
            corteMinimoGeral: Number(obj.corteMinimoGeral) || Number((totalPontosCalc * 0.5).toFixed(1)),
            corteMinimoBasicos: Number(obj.corteMinimoBasicos) || 0,
            corteMinimoEspecificos: Number(obj.corteMinimoEspecificos) || 0,
            regraPortugues: obj.regraPortugues || ""
          },
          discursiva: {
            turno: disc.turno || "",
            duracaoHoras: Number(disc.duracaoHoras) || 0,
            totalPontos: Number(disc.totalPontos) || 0,
            dissertacao: disc.dissertacao || {
              tema: "Tema Discursivo / Estudo de Caso",
              maxLinhas: 30,
              valorMaximo: 20.0,
              notaMinima: 10.0,
              formula: "ND = NC - (4 × NE ÷ TL)"
            },
            questoesTecnicas: disc.questoesTecnicas || null
          }
        }
      },
      cronograma: Array.isArray(src.cronograma) ? src.cronograma : [],
      disciplinas
    };
  }

  function listTracks() {
    const builtins = getBuiltinTracks();
    const customs = Object.values(workspace.customTracks || {}).sort(
      (a, b) => Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0)
    );
    return [...customs, ...builtins];
  }

  function getTrackById(trackId) {
    if (!trackId) return null;
    if (workspace.customTracks && workspace.customTracks[trackId]) {
      return workspace.customTracks[trackId];
    }
    return getBuiltinTracks().find(t => t.id === trackId) || null;
  }

  function getActiveTrack() {
    let track = getTrackById(workspace.activeTrackId);
    if (!track) {
      track = getBuiltinTracks()[0];
      workspace.activeTrackId = track.id;
      persistWorkspace();
    }
    return track;
  }

  function setActiveTrack(trackId) {
    const track = getTrackById(trackId);
    if (!track) return null;
    workspace.activeTrackId = track.id;
    persistWorkspace();
    syncWindowGlobalsForTrack(track);
    return track;
  }

  function getTrackState(trackId) {
    const tid = trackId || getActiveTrack().id;
    const track = getTrackById(tid) || getActiveTrack();
    const defaults = getDefaultTrackProgressState(track.edital);
    const saved = workspace.trackStates && workspace.trackStates[tid];
    return Object.assign(defaults, saved || {});
  }

  function saveTrackState(trackId, stateObj) {
    const tid = trackId || getActiveTrack().id;
    workspace.trackStates = workspace.trackStates || {};
    workspace.trackStates[tid] = Object.assign({}, stateObj, { lastSaved: new Date().toISOString() });
    persistWorkspace();
  }

  function saveCustomTrack(trackInput) {
    const now = new Date().toISOString();
    const id = (trackInput.id || `track_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, "_");
    const edital = normalizeEdital(trackInput.edital);
    const meta = edital.metadata;

    const shortName = trackInput.shortName || meta.concurso || "Meu Concurso";
    const badge = (trackInput.badge || shortName.replace(/[^A-Za-z0-9]/g, "").slice(0, 3) || "ED").toUpperCase();

    const trackDef = {
      id,
      builtin: false,
      badge,
      shortName,
      subtitle: trackInput.subtitle || `${meta.cargo || "Concurso"} • ${meta.banca || ""}`.replace(/\s*•\s*$/, ""),
      description: trackInput.description || meta.edital || "",
      edital,
      enabledSharedPacks: Array.isArray(trackInput.enabledSharedPacks) ? trackInput.enabledSharedPacks : [],
      packMapping: trackInput.packMapping && typeof trackInput.packMapping === "object" ? trackInput.packMapping : {},
      lessons: trackInput.lessons || {},
      discursive: trackInput.discursive || { temas: [] },
      createdAt: trackInput.createdAt || now,
      updatedAt: now
    };

    workspace.customTracks = workspace.customTracks || {};
    workspace.customTracks[id] = trackDef;
    workspace.activeTrackId = id;
    workspace.onboardingCompleted = true;
    persistWorkspace();
    syncWindowGlobalsForTrack(trackDef);
    return trackDef;
  }

  function updateTrackSharedPacks(trackId, enabledPacks, packMapping) {
    const track = workspace.customTracks && workspace.customTracks[trackId];
    if (!track) return null;
    track.enabledSharedPacks = Array.isArray(enabledPacks) ? enabledPacks : [];
    track.packMapping = packMapping && typeof packMapping === "object" ? packMapping : {};
    track.updatedAt = new Date().toISOString();
    persistWorkspace();
    if (workspace.activeTrackId === trackId) {
      syncWindowGlobalsForTrack(track);
    }
    return track;
  }

  function deleteCustomTrack(trackId) {
    if (!workspace.customTracks || !workspace.customTracks[trackId]) return false;
    delete workspace.customTracks[trackId];
    if (workspace.trackStates && workspace.trackStates[trackId]) {
      delete workspace.trackStates[trackId];
    }
    if (workspace.activeTrackId === trackId) {
      workspace.activeTrackId = getBuiltinTracks()[0].id;
    }
    persistWorkspace();
    syncWindowGlobalsForTrack(getActiveTrack());
    return true;
  }

  function getQuestionsForTrack(trackId) {
    const track = getTrackById(trackId) || getActiveTrack();
    const map = new Map();

    // 1. Se for a trilha DPDF pronta, inclui todas as 805 questões reais originais
    if (track.useFullDpdfBank && Array.isArray(window.QUESTIONS_REAIS)) {
      window.QUESTIONS_REAIS.forEach(q => {
        if (q && q.id) map.set(q.id, q);
      });
    } else if (window.SHARED_BANK && Array.isArray(track.enabledSharedPacks) && track.enabledSharedPacks.length) {
      // 2. Pacotes da Base Compartilhada ligados nesta trilha (com remapeamento de subjectId!)
      const mapped = window.SHARED_BANK.buildMappedQuestionsForTrack(track.enabledSharedPacks, track.packMapping);
      mapped.forEach(q => {
        if (q && q.id) map.set(q.id, q);
      });
    }

    // 3. Questões importadas/customizadas pelo aluno nesta trilha
    const tState = getTrackState(track.id);
    (tState.customQuestions || []).forEach(q => {
      if (q && q.id) map.set(q.id, q);
    });

    return Array.from(map.values());
  }

  function syncWindowGlobalsForTrack(track) {
    const t = track || getActiveTrack();
    window.EDITAL_DATA = t.edital;
    window.LESSONS_DATA = t.lessons || {};
    window.DISCURSIVE_AND_FLASHCARDS = (t.discursive && (t.discursive.temasDissertacao || t.discursive.flashcards))
      ? t.discursive
      : { temasDissertacao: [], questoesTecnicasDiscursivas: [], flashcards: [] };
  }

  function getTheme() {
    return workspace.theme || "dark";
  }

  function setTheme(theme) {
    workspace.theme = theme === "light" ? "light" : "dark";
    persistWorkspace();
  }

  function isOnboardingCompleted() {
    return !!workspace.onboardingCompleted;
  }

  function markOnboardingCompleted() {
    workspace.onboardingCompleted = true;
    persistWorkspace();
  }

  function getWorkspaceSnapshot() {
    return JSON.parse(JSON.stringify(workspace));
  }

  function mergeSingleTrackProgress(current, imported) {
    const cur = current || {};
    const imp = imported || {};
    const merged = Object.assign({}, cur);
    const ts = x => (x && x.timestamp ? Date.parse(x.timestamp) || 0 : 0);

    merged.answers = Object.assign({}, cur.answers || {});
    Object.keys(imp.answers || {}).forEach(qid => {
      const c = merged.answers[qid];
      if (!c || ts(imp.answers[qid]) >= ts(c)) merged.answers[qid] = imp.answers[qid];
    });

    merged.checkedTopics = Object.assign({}, cur.checkedTopics || {}, imp.checkedTopics || {});
    merged.completedLessons = Object.assign({}, cur.completedLessons || {}, imp.completedLessons || {});

    const impNewer = (Date.parse(imp.lastSaved) || 0) > (Date.parse(cur.lastSaved) || 0);
    merged.discursiveDrafts = Object.assign({}, cur.discursiveDrafts || {});
    Object.keys(imp.discursiveDrafts || {}).forEach(tid => {
      if (!merged.discursiveDrafts[tid] || impNewer) merged.discursiveDrafts[tid] = imp.discursiveDrafts[tid];
    });

    merged.reviews = Object.assign({}, imp.reviews || {}, cur.reviews || {});
    merged.errors = Object.assign({}, imp.errors || {}, cur.errors || {});
    merged.fc = Object.assign({}, imp.fc || {}, cur.fc || {});

    const simMap = new Map();
    (imp.simulados || []).forEach(s => s && s.date && simMap.set(s.date, s));
    (cur.simulados || []).forEach(s => s && s.date && simMap.set(s.date, s));
    merged.simulados = Array.from(simMap.values()).sort((a, b) => Date.parse(a.date || 0) - Date.parse(b.date || 0));

    const errMap = new Map();
    (imp.errorHistory || []).forEach(e => { if (e && (e.id || e.questionId)) errMap.set(`${e.id || e.questionId}|${e.timestamp || ""}`, e); });
    (cur.errorHistory || []).forEach(e => { if (e && (e.id || e.questionId)) errMap.set(`${e.id || e.questionId}|${e.timestamp || ""}`, e); });
    merged.errorHistory = Array.from(errMap.values()).sort((a, b) => Date.parse(a.timestamp || 0) - Date.parse(b.timestamp || 0));

    const lessonsMap = new Map();
    (imp.aiLessons || []).forEach(l => l && l.id && lessonsMap.set(l.id, l));
    (cur.aiLessons || []).forEach(l => l && l.id && lessonsMap.set(l.id, l));
    merged.aiLessons = Array.from(lessonsMap.values()).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0));

    const qMap = new Map();
    (imp.customQuestions || []).forEach(q => q && q.id && qMap.set(q.id, q));
    (cur.customQuestions || []).forEach(q => q && q.id && qMap.set(q.id, q));
    merged.customQuestions = Array.from(qMap.values());

    return merged;
  }

  function applyMergedWorkspace(remote) {
    if (!remote || typeof remote !== "object") return getWorkspaceSnapshot();

    // Suporte a backup legado (single-track) ou workspace multi-track
    if (!remote.trackStates && (remote.answers || remote.checkedTopics || remote.customQuestions)) {
      const tid = workspace.activeTrackId || "dpdf_ti_2026";
      workspace.trackStates[tid] = mergeSingleTrackProgress(workspace.trackStates[tid], remote);
      persistWorkspace();
      return getWorkspaceSnapshot();
    }

    // Mescla trilhas customizadas por updatedAt
    const remoteTracks = remote.customTracks || {};
    workspace.customTracks = workspace.customTracks || {};
    Object.keys(remoteTracks).forEach(tid => {
      const localT = workspace.customTracks[tid];
      const remT = remoteTracks[tid];
      if (!localT || Date.parse(remT.updatedAt || 0) >= Date.parse(localT.updatedAt || 0)) {
        workspace.customTracks[tid] = remT;
      }
    });

    // Mescla estados por track_id
    const remoteStates = remote.trackStates || {};
    workspace.trackStates = workspace.trackStates || {};
    Object.keys(remoteStates).forEach(tid => {
      workspace.trackStates[tid] = mergeSingleTrackProgress(workspace.trackStates[tid], remoteStates[tid]);
    });

    if (remote.onboardingCompleted) workspace.onboardingCompleted = true;
    persistWorkspace();
    syncWindowGlobalsForTrack(getActiveTrack());
    return getWorkspaceSnapshot();
  }

  function exportTrackBundle(trackId) {
    const track = getTrackById(trackId) || getActiveTrack();
    const tState = getTrackState(track.id);
    return {
      format: "estuda_edital_track_v1",
      exportedAt: new Date().toISOString(),
      track: {
        shortName: track.shortName,
        subtitle: track.subtitle,
        badge: track.badge,
        description: track.description,
        edital: track.edital,
        enabledSharedPacks: track.enabledSharedPacks || [],
        packMapping: track.packMapping || {}
      },
      customQuestions: tState.customQuestions || []
    };
  }

  function importTrackBundle(bundle) {
    if (!bundle || typeof bundle !== "object" || !bundle.track || !bundle.track.edital) {
      throw new Error("Arquivo de trilha inválido. Esperado formato estuda_edital_track_v1.");
    }
    const created = saveCustomTrack(bundle.track);
    if (Array.isArray(bundle.customQuestions) && bundle.customQuestions.length) {
      const st = getTrackState(created.id);
      st.customQuestions = bundle.customQuestions;
      saveTrackState(created.id, st);
    }
    return created;
  }

  // Inicializa os globals de acordo com a trilha ativa logo no boot
  syncWindowGlobalsForTrack(getActiveTrack());

  window.TracksManager = {
    WORKSPACE_KEY,
    DISCIPLINE_COLORS,
    normalizeEdital,
    listTracks,
    getTrackById,
    getActiveTrack,
    setActiveTrack,
    getTrackState,
    saveTrackState,
    saveCustomTrack,
    updateTrackSharedPacks,
    deleteCustomTrack,
    getQuestionsForTrack,
    syncWindowGlobalsForTrack,
    getDefaultTrackProgressState,
    mergeSingleTrackProgress,
    getTheme,
    setTheme,
    isOnboardingCompleted,
    markOnboardingCompleted,
    getWorkspaceSnapshot,
    applyMergedWorkspace,
    exportTrackBundle,
    importTrackBundle
  };
})();
