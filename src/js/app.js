// ============================================================================
// MOTOR INTERATIVO DE ESTUDO — ESTUDA EDITAL (MULTI-CONCURSO ADAPTATIVO)
// Arquitetura limpa, sem monkey-patching, UX focada e livre de poluição visual
// ============================================================================

(function () {
  const STEPS = [2, 7, 21, 45];
  const REASONS = [
    ["conteudo", "Conteúdo"],
    ["atencao", "Atenção"],
    ["pegadinha", "Pegadinha"],
    ["chute", "Chute"]
  ];

  const VIEW_TITLES = {
    dashboard: "Visão Geral",
    diagnostic: "Prática por Questões",
    errors: "Caderno de Erros",
    remediation: "Aulas & Reforço",
    review: "Revisão Espaçada",
    simulado: "Simulado Cronometrado",
    discursive: "Prova Discursiva",
    flashcards: "Flashcards Ativos",
    import: "Importar Provas & Base",
    edital: "Edital Verticalizado",
    handoff: "Dados, Backup & IA"
  };

  function getExamDate() {
    const raw = window.EDITAL_DATA && window.EDITAL_DATA.metadata && window.EDITAL_DATA.metadata.provas && window.EDITAL_DATA.metadata.provas.dataProva;
    if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
    const d = new Date(`${raw}T08:00:00-03:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeJsStr(str) {
    return String(str == null ? "" : str)
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, "&quot;");
  }

  function isRealQuestion(q) {
    if (!q) return false;
    if (q.sourceType === "real") return true;
    if (q.sourceType === "autoral") return false;
    const b = (q.banca || "").toLowerCase();
    return !b.includes("autoral") && !b.includes("estilo");
  }

  let ALL_QUESTIONS = [];
  let QUESTION_MAP = new Map();

  function getDefaultState() {
    if (window.TracksManager) {
      const track = window.TracksManager.getActiveTrack();
      return window.TracksManager.getDefaultTrackProgressState(track.edital);
    }
    return {
      answers: {},
      errorHistory: [],
      customQuestions: [],
      aiLessons: [],
      completedLessons: {},
      checkedTopics: {},
      discursiveDrafts: {},
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
      currentLessonSubject: "ALL",
      errorTopicFilter: "ALL",
      discursiveTab: "write",
      selectedDiscursiveId: "",
      lastSaved: new Date().toISOString()
    };
  }

  function loadState() {
    if (window.TracksManager) {
      const track = window.TracksManager.getActiveTrack();
      return window.TracksManager.getTrackState(track.id);
    }
    return getDefaultState();
  }

  let state = loadState();
  let curConf = "certeza";
  const PERM = {};
  const SESS = {};
  const REVDONE = new Set();
  const SIM = { on: false, qs: [], ans: {}, end: 0, start: 0, t: null, fin: false, n: 20, by: {}, hits: 0 };

  function ensure() {
    state.answers = state.answers || {};
    state.reviews = state.reviews || {};
    state.errors = state.errors || {};
    state.errorHistory = Array.isArray(state.errorHistory) ? state.errorHistory : [];
    state.customQuestions = Array.isArray(state.customQuestions) ? state.customQuestions : [];
    state.aiLessons = Array.isArray(state.aiLessons) ? state.aiLessons : [];
    state.completedLessons = state.completedLessons || {};
    state.checkedTopics = state.checkedTopics || {};
    state.discursiveDrafts = state.discursiveDrafts || {};
    state.simulados = Array.isArray(state.simulados) ? state.simulados : [];
    state.questionExplanations = state.questionExplanations || {};
    state.fc = state.fc || {};
    if (!state.diagMode) state.diagMode = "focus";
    if (typeof state.diagFocusIdx !== "number") state.diagFocusIdx = 0;
    if (typeof state.diagShuffle !== "boolean") state.diagShuffle = true;
    if (typeof state.diagOrderSeed !== "number") state.diagOrderSeed = Math.floor(Math.random() * 2147483647) + 1;
  }

  function isGenericRemediation(rl) {
    if (!rl || !rl.coreConcept) return true;
    return /^Item oficial da banca/i.test(String(rl.coreConcept).trim());
  }

  function getEffectiveRemediation(q) {
    if (!q) return null;
    if (state && state.questionExplanations && state.questionExplanations[q.id]) {
      return state.questionExplanations[q.id];
    }
    if (q.remediationLesson && !isGenericRemediation(q.remediationLesson)) {
      return q.remediationLesson;
    }
    return null;
  }

  window.generateQuestionExplanation = async function (qid) {
    const q = QUESTION_MAP.get(qid);
    if (!q) return;
    const statusEl = document.getElementById("ai-q-status-" + qid);
    const btnEl = document.getElementById("ai-q-btn-" + qid);

    if (!window.AI_TUTOR || !window.AI_TUTOR.isConfigured()) {
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "var(--danger-text)";
        statusEl.innerHTML = `Configure sua chave gratuita do Gemini ou OpenAI para gerar explicações. <button class="btn btn-outline btn-sm" style="margin-left:6px;" onclick="window.OnboardingWizard && OnboardingWizard.open(1)">Configurar chave IA</button>`;
      }
      return;
    }

    if (btnEl) {
      btnEl.disabled = true;
      btnEl.textContent = "⏳ Gerando explicação com IA...";
    }
    if (statusEl) {
      statusEl.style.display = "block";
      statusEl.style.color = "var(--text-muted)";
      statusEl.textContent = "Consultando sua IA para analisar a questão e o gabarito oficial...";
    }

    try {
      const ans = state.answers[qid];
      const opts = Array.isArray(q.options) ? q.options : [];
      const correctOpt = opts[q.correctIndex] != null ? String(opts[q.correctIndex]) : "";
      const chosenOpt = ans && opts[ans.selectedIndex] != null ? String(opts[ans.selectedIndex]) : "";
      const prompt = [
        "Você é um professor especialista em concursos públicos brasileiros.",
        "Explique de forma objetiva, didática e cirúrgica a questão oficial abaixo.",
        "",
        `Banca: ${q.banca || "Oficial"} | Órgão/Ano: ${q.orgao || ""} ${q.year || ""}`,
        `Disciplina: ${subjName(q.subjectId)}`,
        `Enunciado: ${q.statement || ""}`,
        `Alternativas: ${opts.map((o, i) => `${i + 1}) ${o}`).join(" | ")}`,
        `Gabarito oficial: ${correctOpt}`,
        chosenOpt && chosenOpt !== correctOpt ? `Resposta marcada pelo aluno (errou): ${chosenOpt}` : "",
        "",
        "Retorne APENAS um JSON válido com as chaves exatamente assim:",
        '{',
        '  "title": "Título curto do assunto cobrado (máx 70 caracteres)",',
        '  "explanation": "Explicação clara de por que o gabarito oficial está correto e (se houver) por que o erro comum falha.",',
        '  "coreConcept": "Regra principal ou fundamento legal/gramatical/técnico que resolve a questão.",',
        '  "accessTrap": "Principal pegadinha da banca nesta questão.",',
        '  "mnemonic": "Regra de bolso ou macete curto para não errar mais."',
        '}'
      ].filter(Boolean).join("\n");

      const parsed = await window.AI_TUTOR.askJson(prompt, { temperature: 0.25 });
      if (!parsed || (!parsed.coreConcept && !parsed.explanation)) {
        throw new Error("A IA retornou uma resposta incompleta. Tente novamente.");
      }

      ensure();
      state.questionExplanations[qid] = {
        title: String(parsed.title || `${subjName(q.subjectId)} — Explicação IA`).trim(),
        explanation: String(parsed.explanation || "").trim(),
        coreConcept: String(parsed.coreConcept || parsed.explanation || "").trim(),
        accessTrap: String(parsed.accessTrap || "").trim(),
        mnemonic: String(parsed.mnemonic || "").trim(),
        generatedByAi: true,
        generatedAt: new Date().toISOString()
      };
      saveState();
      if (typeof window.refreshActiveView === "function") window.refreshActiveView();
    } catch (err) {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = "✨ Gerar explicação com IA";
      }
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "var(--danger-text)";
        statusEl.textContent = "Erro ao gerar explicação: " + (err && err.message ? err.message : String(err));
      }
    }
  };

  function rebuildQuestionBank() {
    const map = new Map();
    if (window.TracksManager) {
      const track = window.TracksManager.getActiveTrack();
      window.TracksManager.getQuestionsForTrack(track.id).forEach(q => {
        if (q && q.id) map.set(q.id, q);
      });
    }
    (state && Array.isArray(state.customQuestions) ? state.customQuestions : []).forEach(q => {
      if (q && q.id) map.set(q.id, q);
    });
    QUESTION_MAP = map;
    ALL_QUESTIONS = Array.from(map.values());
  }

  rebuildQuestionBank();
  ensure();

  function saveState() {
    try {
      state.lastSaved = new Date().toISOString();
      if (window.TracksManager) {
        const track = window.TracksManager.getActiveTrack();
        window.TracksManager.saveTrackState(track.id, state);
      }
      updateSidebarBadges();
      updateSaveIndicator();
      if (window.CloudSync && window.TracksManager) {
        window.CloudSync.schedulePush(window.TracksManager.getWorkspaceSnapshot());
      }
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e);
    }
  }

  function renderTrackSwitcherUI() {
    if (!window.TracksManager) return;
    const tracks = window.TracksManager.listTracks();
    const active = window.TracksManager.getActiveTrack();

    // Agrupa trilhas com groupId (ex: COFEN 2026 com 13 cargos) em uma única entrada no 1º seletor
    const groupedOptions = [];
    const seenGroups = new Set();
    tracks.forEach(t => {
      if (t.groupId) {
        if (seenGroups.has(t.groupId)) return;
        seenGroups.add(t.groupId);
        const members = tracks.filter(x => x.groupId === t.groupId);
        groupedOptions.push({
          value: `group:${t.groupId}`,
          label: `${t.groupName || t.groupId} (${members.length} cargos)`,
          selected: active.groupId === t.groupId
        });
      } else {
        const prefix = t.builtin ? "" : "★ ";
        groupedOptions.push({
          value: t.id,
          label: `${prefix}${t.shortName}`,
          selected: active.id === t.id
        });
      }
    });

    const sel = document.getElementById("track-select");
    if (sel) {
      sel.innerHTML = groupedOptions
        .map(o => `<option value="${escapeHtml(o.value)}" ${o.selected ? "selected" : ""}>${escapeHtml(o.label)}</option>`)
        .join("");
    }

    const roleWrap = document.getElementById("role-select-wrapper");
    const roleSel = document.getElementById("role-select");
    if (roleWrap && roleSel) {
      if (active.groupId) {
        const members = tracks.filter(x => x.groupId === active.groupId);
        roleWrap.style.display = "block";
        roleSel.innerHTML = members
          .map(m => `<option value="${escapeHtml(m.id)}" ${m.id === active.id ? "selected" : ""}>${escapeHtml(m.roleCode ? `${m.roleCode} — ${m.roleName}` : m.shortName)}</option>`)
          .join("");
      } else {
        roleWrap.style.display = "none";
      }
    }

    const badgeEl = document.getElementById("brand-badge-text");
    const titleEl = document.getElementById("brand-title");
    const subEl = document.getElementById("brand-subtitle");
    if (badgeEl) badgeEl.textContent = active.badge || "EE";
    if (titleEl) titleEl.textContent = "Estuda Edital";
    if (subEl) subEl.textContent = active.shortName || "Multi-Concurso";
  }

  window.onConcursoSelectChange = function (val) {
    if (!val) return;
    if (val.startsWith("group:")) {
      const gid = val.slice(6);
      const tracks = window.TracksManager ? window.TracksManager.listTracks() : [];
      const firstMember = tracks.find(t => t.groupId === gid);
      if (firstMember) window.switchTrack(firstMember.id);
      return;
    }
    window.switchTrack(val);
  };

  window.switchTrack = function (trackId) {
    if (!window.TracksManager) return;
    clearInterval(SIM.t);
    SIM.on = false;
    Object.keys(PERM).forEach(k => delete PERM[k]);
    Object.keys(SESS).forEach(k => delete SESS[k]);
    REVDONE.clear();

    window.TracksManager.setActiveTrack(trackId);
    if (typeof window.TracksManager.markOnboardingCompleted === "function") {
      window.TracksManager.markOnboardingCompleted();
    }
    state = loadState();
    ensure();
    rebuildQuestionBank();
    saveState();
    renderTrackSwitcherUI();
    renderCountdown();
    updateSidebarBadges();
    updateSaveIndicator();
    switchView(state.currentView || "dashboard");
  };

  window.reloadActiveTrack = function () {
    if (!window.TracksManager) return;
    window.TracksManager.syncWindowGlobalsForTrack(window.TracksManager.getActiveTrack());
    rebuildQuestionBank();
    renderTrackSwitcherUI();
    renderCountdown();
    updateSidebarBadges();
    if (window.CloudSync) window.CloudSync.schedulePush(window.TracksManager.getWorkspaceSnapshot());
  };

  window.appendCustomQuestions = function (list) {
    if (!Array.isArray(list) || !list.length) return;
    ensure();
    const existingMap = new Map(state.customQuestions.map(q => [q.id, q]));
    list.forEach(q => {
      if (q && q.id) existingMap.set(q.id, Object.assign({ sourceType: "real" }, q));
    });
    state.customQuestions = Array.from(existingMap.values());
    rebuildQuestionBank();
    saveState();
  };

  function updateSaveIndicator() {
    const el = document.getElementById("save-status-indicator");
    const topEl = document.getElementById("topbar-save-status");
    const timeStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const cs = window.CloudSync ? window.CloudSync.getStatus() : null;
    let label = `Salvo às ${timeStr}`;
    if (cs && cs.user) {
      if (cs.status === "syncing") label = "Sincronizando nuvem...";
      else if (cs.status === "synced") label = `Nuvem OK (${timeStr})`;
      else if (cs.status === "error") label = `Local (${timeStr}) • Erro nuvem`;
    }
    if (el) el.innerHTML = `<span class="save-dot"></span> ${escapeHtml(label)}`;
    if (topEl) topEl.textContent = label;
  }

  function subjName(id) {
    const d = window.EDITAL_DATA && Array.isArray(window.EDITAL_DATA.disciplinas)
      ? window.EDITAL_DATA.disciplinas.find(x => x.id === id)
      : null;
    return d ? d.nome : id;
  }

  function shuffle(a) {
    const copy = a.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Mantém a MESMA ordem de alternativas antes e depois de responder (sem pulo visual!)
  function orderedOptions(q, ans) {
    const idxs = q.options.map((_, i) => i);
    let perm;
    if (ans && Array.isArray(ans.optOrder) && ans.optOrder.length === idxs.length) {
      perm = ans.optOrder;
    } else if (ans) {
      perm = idxs;
    } else {
      if (!PERM[q.id]) PERM[q.id] = shuffle(idxs);
      perm = PERM[q.id];
    }
    return perm.map((i, pos) => ({
      optText: String.fromCharCode(65 + pos) + ") " + String(q.options[i] || "").replace(/^\s*[A-E]\)\s*/, ""),
      optIdx: i
    }));
  }

  function schedule(qid, ok, conf) {
    ensure();
    const p = state.reviews[qid];
    const step = !ok ? 0 : (conf === "certeza" ? (p ? Math.min(p.step + 1, STEPS.length - 1) : 1) : (p ? p.step : 0));
    let due = new Date(Date.now() + STEPS[step] * 864e5);
    const examDate = getExamDate();
    if (examDate && due > examDate) {
      due = new Date(Math.max(Date.now() + 864e5, examDate.getTime() - 864e5));
    }
    state.reviews[qid] = { step, due: due.toISOString(), conf: conf || null };
  }

  function dueIds() {
    ensure();
    const now = Date.now();
    return Object.keys(state.reviews).filter(id => QUESTION_MAP.has(id) && Date.parse(state.reviews[id].due) <= now);
  }

  function recordErrorIfWrong(q, selectedIndex, ok, conf) {
    if (ok) return;
    ensure();
    state.errorHistory.push({
      questionId: q.id,
      subjectId: q.subjectId,
      topicId: q.topicId,
      topicName: q.topicName || "",
      selectedIndex,
      correctIndex: q.correctIndex,
      conf: conf || null,
      timestamp: new Date().toISOString()
    });
  }

  function getSubjectStats(subjectId) {
    const subjQuestions = ALL_QUESTIONS.filter(q => q.subjectId === subjectId);
    let answered = 0;
    let correct = 0;
    subjQuestions.forEach(q => {
      const ans = state.answers[q.id];
      if (ans) {
        answered++;
        if (ans.correct) correct++;
      }
    });
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : null;
    let status = "NAO_AVALIADO";
    let statusLabel = "Não avaliado";
    let statusClass = "status-untested";

    if (answered > 0) {
      if (accuracy < 75) {
        status = "PONTO_FRACO";
        statusLabel = `Ponto fraco (${accuracy}%)`;
        statusClass = "status-weak";
      } else if (accuracy < 90) {
        status = "EM_EVOLUCAO";
        statusLabel = `Em evolução (${accuracy}%)`;
        statusClass = "status-evolving";
      } else {
        status = "DOMINADO";
        statusLabel = `Dominado (${accuracy}%)`;
        statusClass = "status-mastered";
      }
    }

    return {
      totalQuestions: subjQuestions.length,
      answered,
      correct,
      wrong: answered - correct,
      accuracy,
      status,
      statusLabel,
      statusClass
    };
  }

  // Filtra apenas respostas de questões existentes em ALL_QUESTIONS (corrige bug >100%)
  function getGlobalStats() {
    const totalQ = ALL_QUESTIONS.length;
    let answeredCount = 0;
    let correctCount = 0;
    let wrongCount = 0;

    ALL_QUESTIONS.forEach(q => {
      const ans = state.answers[q.id];
      if (ans) {
        answeredCount++;
        if (ans.correct) correctCount++;
        else wrongCount++;
      }
    });

    const overallAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    let projectedBasicPts = 0;
    let projectedSpecPts = 0;
    const weakSubjects = [];

    window.EDITAL_DATA.disciplinas.forEach(d => {
      const st = getSubjectStats(d.id);
      if (st.status === "PONTO_FRACO") {
        weakSubjects.push({ disciplina: d, stats: st });
      }
      const rate = st.accuracy !== null ? st.accuracy / 100 : 0;
      const pts = rate * d.pontosProva;
      if (d.categoria === "basicos") projectedBasicPts += pts;
      else projectedSpecPts += pts;
    });

    return {
      totalQ,
      answeredCount,
      correctCount,
      wrongCount,
      overallAccuracy,
      projectedBasicPts: Number(projectedBasicPts.toFixed(1)),
      projectedSpecPts: Number(projectedSpecPts.toFixed(1)),
      projectedTotalPts: Number((projectedBasicPts + projectedSpecPts).toFixed(1)),
      weakSubjects
    };
  }

  function updateSidebarBadges() {
    const g = getGlobalStats();
    const dueCount = dueIds().length;

    const badgeQ = document.getElementById("badge-questions-count");
    if (badgeQ) badgeQ.textContent = `${g.answeredCount}/${g.totalQ}`;

    const badgeErr = document.getElementById("badge-errors-count");
    if (badgeErr) {
      badgeErr.textContent = g.wrongCount;
      badgeErr.classList.toggle("alert", g.wrongCount > 0);
    }

    const badgeWeak = document.getElementById("badge-weak-count");
    if (badgeWeak) {
      badgeWeak.textContent = g.weakSubjects.length;
      badgeWeak.classList.toggle("alert", g.weakSubjects.length > 0);
    }

    const badgeRev = document.getElementById("badge-review");
    if (badgeRev) {
      badgeRev.textContent = dueCount;
      badgeRev.classList.toggle("alert", dueCount > 0);
    }
  }

  function renderCountdown() {
    const el = document.getElementById("countdown-days");
    const lbl = document.getElementById("countdown-label");
    const examDate = getExamDate();
    if (!examDate) {
      if (lbl) lbl.textContent = "Data da Prova";
      if (el) el.textContent = "A definir";
      return;
    }
    const diffMs = examDate.getTime() - Date.now();
    const days = Math.max(0, Math.ceil(diffMs / 864e5));
    if (lbl) lbl.textContent = `Prova ${examDate.toLocaleDateString("pt-BR")}`;
    if (el) el.textContent = `${days} dias`;
  }

  // ==========================================================================
  // MOBILE DRAWER & NAVEGAÇÃO ENTRE TELAS (SEM CORROMPER FILTROS ENTRE ABAS)
  // ==========================================================================
  window.openMobileMenu = function () {
    document.getElementById("app-sidebar")?.classList.add("open");
    document.getElementById("sidebar-backdrop")?.classList.add("open");
  };

  window.closeMobileMenu = function () {
    document.getElementById("app-sidebar")?.classList.remove("open");
    document.getElementById("sidebar-backdrop")?.classList.remove("open");
  };

  window.switchView = function (viewId, optionalSubjectId) {
    closeMobileMenu();
    const validView = VIEW_TITLES[viewId] ? viewId : "dashboard";
    state.currentView = validView;

    if (optionalSubjectId) {
      if (validView === "diagnostic") {
        state.currentDiagSubject = optionalSubjectId;
        state.diagFocusIdx = 0;
      } else if (validView === "remediation") {
        state.currentLessonSubject = optionalSubjectId;
      }
    }
    saveState();

    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
    document.querySelectorAll(".nav-btn, .bnav-btn").forEach(btn => {
      if (btn.dataset.view) {
        btn.classList.toggle("active", btn.dataset.view === validView);
      }
    });

    const target = document.getElementById(`view-${validView}`);
    if (target) target.classList.add("active");

    const titleEl = document.getElementById("topbar-view-title");
    if (titleEl) titleEl.textContent = VIEW_TITLES[validView] || "Estuda Edital";

    if (validView === "dashboard") renderDashboard();
    else if (validView === "diagnostic") renderDiagnosticView();
    else if (validView === "errors") renderErrors();
    else if (validView === "remediation") renderRemediationView();
    else if (validView === "review") renderReview();
    else if (validView === "simulado") renderSim();
    else if (validView === "discursive") renderDiscursiveView();
    else if (validView === "flashcards") renderFlashcardsView();
    else if (validView === "import") { if (window.OnboardingWizard) window.OnboardingWizard.renderImportView(); }
    else if (validView === "edital") renderEditalView();
    else if (validView === "handoff") renderHandoffView();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================================================================
  // 1. VISÃO GERAL (DASHBOARD LIMPO E ORIENTADO À PRÓXIMA AÇÃO)
  // ==========================================================================
  window.setDashFilter = function (f) {
    state.dashSubjectFilter = f;
    saveState();
    renderDashboard();
  };

  function renderDashboard() {
    const container = document.getElementById("dashboard-content");
    if (!container) return;

    const g = getGlobalStats();
    const dueCount = dueIds().length;
    const filter = state.dashSubjectFilter || "ALL";

    // Hero único com a próxima ação mais importante (evita empilhar 4 banners!)
    let heroEyebrow = "Próximo passo recomendado";
    let heroTitle = "";
    let heroDesc = "";
    let heroBtn = "";

    if (dueCount > 0) {
      heroEyebrow = "Revisão espaçada pendente";
      heroTitle = `Você tem ${dueCount} questão(ões) vencida(s) para revisar hoje`;
      heroDesc = "Revisar no intervalo programado consolida a memória de longo prazo antes de avançar para novos blocos.";
      heroBtn = `<button class="btn btn-primary" onclick="switchView('review')">Revisar agora</button>`;
    } else if (g.weakSubjects.length > 0) {
      const worst = g.weakSubjects.slice().sort((a, b) => (a.stats.accuracy || 0) - (b.stats.accuracy || 0))[0];
      heroEyebrow = `Atenção prioritária • ${g.weakSubjects.length} ponto(s) fraco(s)`;
      heroTitle = `Reforçar ${worst.disciplina.nome} (${worst.stats.accuracy}% de acerto)`;
      heroDesc = "Você errou questões importantes neste tema. Revise o resumo cirúrgico ou gere uma aula sob medida dos seus erros.";
      heroBtn = `
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="switchView('remediation', '${worst.disciplina.id}')">Abrir aula focada</button>
          <button class="btn btn-outline" onclick="switchView('errors')">Ver caderno de erros</button>
        </div>
      `;
    } else if (g.answeredCount === 0) {
      heroEyebrow = "Comece por aqui";
      heroTitle = "Inicie sua avaliação diagnóstica por questões";
      heroDesc = "Responda questões reais para mapear o que você já domina e registrar automaticamente onde precisa de aula.";
      const firstD = (window.EDITAL_DATA.disciplinas || []).find(d => ALL_QUESTIONS.some(q => q.subjectId === d.id)) || (window.EDITAL_DATA.disciplinas || [])[0];
      heroBtn = firstD
        ? `<button class="btn btn-primary" onclick="switchView('diagnostic', '${escapeHtml(firstD.id)}')">Começar por ${escapeHtml(firstD.nome)}</button>`
        : `<button class="btn btn-primary" onclick="switchView('diagnostic')">Começar questões</button>`;
    } else {
      heroEyebrow = "Ritmo consistente";
      heroTitle = "Continue avançando no banco de questões";
      heroDesc = `Você já respondeu ${g.answeredCount} de ${g.totalQ} questões com ${g.overallAccuracy}% de aproveitamento.`;
      heroBtn = `<button class="btn btn-primary" onclick="switchView('diagnostic')">Continuar questões</button>`;
    }

    const disciplinas = window.EDITAL_DATA.disciplinas.filter(d => {
      if (filter === "WEAK") return getSubjectStats(d.id).status === "PONTO_FRACO";
      if (filter === "SPEC") return d.categoria !== "basicos";
      if (filter === "BASIC") return d.categoria === "basicos";
      return true;
    });

    const subjectsHtml = disciplinas.length
      ? disciplinas.map(d => {
          const st = getSubjectStats(d.id);
          const pct = st.totalQuestions > 0 ? Math.round((st.answered / st.totalQuestions) * 100) : 0;
          return `
            <div class="subject-card">
              <div>
                <div class="subj-top">
                  <span class="subj-code">${escapeHtml(d.codigo)} • Peso ${d.peso}</span>
                  <span class="subj-pts">${d.pontosProva.toFixed(0)} pts na prova</span>
                </div>
                <h4 class="subj-title" title="${escapeHtml(d.descricao)}">${escapeHtml(d.nome)}</h4>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="status-badge ${st.statusClass}">${st.statusLabel}</span>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${st.answered}/${st.totalQuestions}</span>
                </div>
                <div class="progress-bar-wrap">
                  <div class="progress-bar-fill" style="width:${pct}%;"></div>
                </div>
                <div style="display:flex; gap:6px; margin-top:10px;">
                  <button class="btn btn-primary btn-sm" style="flex:1;" onclick="switchView('diagnostic', '${d.id}')">Questões</button>
                  <button class="btn btn-outline btn-sm" style="flex:1;" onclick="switchView('remediation', '${d.id}')">Aula</button>
                </div>
              </div>
            </div>
          `;
        }).join("")
      : `<div class="card" style="text-align:center; color:var(--text-muted);">Nenhuma disciplina neste filtro no momento.</div>`;

    container.innerHTML = `
      <div class="action-hero">
        <div>
          <div class="action-hero-eyebrow">${heroEyebrow}</div>
          <h3>${escapeHtml(heroTitle)}</h3>
          <p>${escapeHtml(heroDesc)}</p>
        </div>
        ${heroBtn}
      </div>

      <div class="kpi-strip">
        <div class="kpi-box">
          <div class="kpi-label">Resolvidas</div>
          <div class="kpi-val">${g.answeredCount}<span style="font-size:0.9rem; color:var(--text-muted); font-weight:500;">/${g.totalQ}</span></div>
          <div class="kpi-sub">${g.wrongCount} erro(s) registrado(s)</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Aproveitamento</div>
          <div class="kpi-val" style="color:${g.answeredCount === 0 ? "var(--text-primary)" : g.overallAccuracy >= 75 ? "var(--success-text)" : "var(--warning-text)"};">${g.overallAccuracy}%</div>
          <div class="kpi-sub">Meta recomendada: 75%+</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Projeção Objetiva</div>
          <div class="kpi-val">${g.projectedTotalPts}<span style="font-size:0.9rem; color:var(--text-muted); font-weight:500;">/119</span></div>
          <div class="kpi-sub">Bás: ${g.projectedBasicPts} • Esp: ${g.projectedSpecPts}</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Pontos Fracos</div>
          <div class="kpi-val" style="color:${g.weakSubjects.length > 0 ? "var(--danger-text)" : "var(--success-text)"};">${g.weakSubjects.length}</div>
          <div class="kpi-sub">${dueCount} revisão(ões) hoje</div>
        </div>
      </div>

      <details class="guide-box" style="margin-bottom:20px;">
        <summary>Como funciona o ciclo de estudo adaptativo?</summary>
        <div class="guide-body" style="font-size:0.87rem; color:var(--text-secondary); display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px;">
          <div><strong>1. Questões Primeiro:</strong> teste seu domínio direto nas questões reais, marcando se respondeu com certeza, dúvida ou chute.</div>
          <div><strong>2. Registro de Erros:</strong> se acertar com certeza, avança rápido; se errar, o tópico e a alternativa marcada ficam salvos.</div>
          <div><strong>3. Aula Cirúrgica:</strong> estude apenas o que foi ruim na aba Aulas ou gere uma explicação sob medida com sua API Key.</div>
          <div><strong>4. Revisão Espaçada:</strong> erros retornam em 2 dias e avançam gradualmente (7, 21 e 45 dias) até o dia da prova.</div>
        </div>
      </details>

      <div class="section-head">
        <div>
          <h2>Disciplinas do Edital</h2>
          <p>${escapeHtml((window.EDITAL_DATA.metadata && window.EDITAL_DATA.metadata.concurso) || "Meu Concurso")} • ${escapeHtml((window.EDITAL_DATA.metadata && window.EDITAL_DATA.metadata.cargo) || "")}${window.EDITAL_DATA.metadata && window.EDITAL_DATA.metadata.banca ? " • " + escapeHtml(window.EDITAL_DATA.metadata.banca) : ""}</p>
        </div>
        <div class="segmented-tabs">
          <button class="seg-btn ${filter === "ALL" ? "active" : ""}" onclick="setDashFilter('ALL')">Todas (${window.EDITAL_DATA.disciplinas.length})</button>
          <button class="seg-btn ${filter === "WEAK" ? "active" : ""}" onclick="setDashFilter('WEAK')">Pontos Fracos (${g.weakSubjects.length})</button>
          <button class="seg-btn ${filter === "SPEC" ? "active" : ""}" onclick="setDashFilter('SPEC')">Específicos (${window.EDITAL_DATA.disciplinas.filter(d => d.categoria === "especificos").length})</button>
          <button class="seg-btn ${filter === "BASIC" ? "active" : ""}" onclick="setDashFilter('BASIC')">Básicos (${window.EDITAL_DATA.disciplinas.filter(d => d.categoria === "basicos").length})</button>
        </div>
      </div>

      <div class="subjects-grid">
        ${subjectsHtml}
      </div>
    `;
  }

  // ==========================================================================
  // 2. QUESTÕES (MODO FOCO 1 POR VEZ POR PADRÃO + FILTROS RETRÁTEIS)
  // ==========================================================================
  function seededOrderHash(seed, str) {
    let h = (seed ^ 0x811c9dc5) >>> 0;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b) >>> 0;
    h ^= h >>> 13;
    return h >>> 0;
  }

  function getFilteredDiagnosticQuestions() {
    const subjFilter = state.currentDiagSubject || "ALL";
    const originFilter = state.currentDiagOrigin || "ALL";
    const bancaFilter = state.currentDiagBanca || "ALL";
    const statusFilter = state.currentDiagStatus || "ALL";

    const list = ALL_QUESTIONS.filter(q => {
      if (subjFilter !== "ALL" && q.subjectId !== subjFilter) return false;
      if (originFilter === "REAL" && !isRealQuestion(q)) return false;
      if (originFilter === "AUTORAL" && isRealQuestion(q)) return false;
      if (bancaFilter !== "ALL") {
        const b = (q.banca || "").toLowerCase();
        if (!b.includes(bancaFilter.toLowerCase())) return false;
      }
      const ans = state.answers[q.id];
      if (statusFilter === "UNANSWERED" && ans) return false;
      if (statusFilter === "WRONG" && (!ans || ans.correct)) return false;
      if (statusFilter === "CORRECT" && (!ans || !ans.correct)) return false;
      return true;
    });

    if (state.diagShuffle !== false) {
      const seed = state.diagOrderSeed || 1;
      return list.slice().sort((a, b) => seededOrderHash(seed, a.id) - seededOrderHash(seed, b.id));
    }
    return list;
  }

  window.setConf = function (c) {
    curConf = c;
    document.querySelectorAll(".conf-chip").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.c === c);
    });
  };

  function renderConfSelectorHtml() {
    const opts = [
      ["certeza", "Certeza"],
      ["duvida", "Dúvida"],
      ["chute", "Chute"]
    ];
    return `
      <div class="conf-selector">
        <span class="conf-label">Nível de confiança nesta resposta:</span>
        <div class="conf-chips">
          ${opts.map(([id, label]) => `<button type="button" class="conf-chip ${curConf === id ? "active" : ""}" data-c="${id}" onclick="setConf('${id}')">${label}</button>`).join("")}
        </div>
      </div>
    `;
  }

  function renderQuestionCardHtml(q, posIdx, totalFiltered) {
    const ans = state.answers[q.id];
    const subj = window.EDITAL_DATA.disciplinas.find(d => d.id === q.subjectId);
    const isReal = isRealQuestion(q);
    const qidEsc = escapeJsStr(q.id);

    const originBadge = isReal
      ? `<span class="status-badge status-mastered">Real${q.year ? " " + escapeHtml(q.year) : ""}${q.qconcursosId ? " • " + escapeHtml(q.qconcursosId) : ""}</span>`
      : `<span class="status-badge status-untested">Legado autoral</span>`;

    const optsList = orderedOptions(q, ans);
    const optionsButtons = optsList.map(({ optText, optIdx }) => {
      let btnClass = "option-btn";
      if (ans) {
        if (optIdx === q.correctIndex) btnClass += " correct";
        else if (optIdx === ans.selectedIndex && !ans.correct) btnClass += " wrong";
      }
      return `
        <button class="${btnClass}" ${ans ? "disabled" : ""} onclick="window.answerQuestion('${qidEsc}', ${optIdx})">
          ${escapeHtml(optText)}
        </button>
      `;
    }).join("");

    let feedbackHtml = "";
    if (ans) {
      const rem = getEffectiveRemediation(q);
      const displayExplanation = (rem && rem.generatedByAi && rem.explanation) ? rem.explanation : (q.explanation || "");
      feedbackHtml = `
        <div class="feedback-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
            <strong style="color:${ans.correct ? "var(--success-text)" : "var(--danger-text)"}; font-size:0.95rem;">
              ${ans.correct ? "Resposta correta!" : "Resposta incorreta — salva no Caderno de Erros"}
              ${ans.conf ? `<span style="font-weight:500; color:var(--text-muted); font-size:0.8rem;"> (${escapeHtml(ans.conf)})</span>` : ""}
            </strong>
            <button class="btn btn-outline btn-sm" onclick="window.resetQuestion('${qidEsc}')">Refazer</button>
          </div>
          <p style="white-space:pre-line; font-size:0.9rem; color:var(--text-secondary); line-height:1.65;">${escapeHtml(displayExplanation)}</p>

          ${rem ? `
            <details class="guide-box" ${!ans.correct || rem.generatedByAi ? "open" : ""} style="margin-top:14px;">
              <summary>${rem.generatedByAi ? "✨ Explicação cirúrgica (IA): " : "Resumo cirúrgico: "}${escapeHtml(rem.title)}</summary>
              <div class="guide-body" style="font-size:0.89rem;">
                <p style="white-space:pre-line; margin-bottom:10px;">${escapeHtml(rem.coreConcept)}</p>
                ${rem.accessTrap ? `<p style="color:var(--danger-text); margin-bottom:6px;"><strong>Pegadinha de prova:</strong> ${escapeHtml(rem.accessTrap)}</p>` : ""}
                ${rem.mnemonic ? `<p style="color:var(--success-text);"><strong>Regra de bolso:</strong> ${escapeHtml(rem.mnemonic)}</p>` : ""}
                <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
                  ${rem.generatedByAi ? `<button class="btn btn-outline btn-sm" id="ai-q-btn-${escapeHtml(q.id)}" onclick="window.generateQuestionExplanation('${qidEsc}')">↻ Gerar novamente com IA</button>` : ""}
                  <button class="btn btn-outline btn-sm" onclick="switchView('remediation', '${escapeJsStr(q.subjectId)}')">Abrir aula da disciplina</button>
                  ${!ans.correct ? `<button class="btn btn-primary btn-sm" onclick="switchView('errors')">Ir para Caderno de Erros / IA</button>` : ""}
                </div>
                <div id="ai-q-status-${escapeHtml(q.id)}" style="display:none; font-size:0.82rem; margin-top:8px;"></div>
              </div>
            </details>
          ` : `
            <div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
              <button class="btn btn-primary btn-sm" id="ai-q-btn-${escapeHtml(q.id)}" onclick="window.generateQuestionExplanation('${qidEsc}')">✨ Gerar explicação com IA</button>
              <button class="btn btn-outline btn-sm" onclick="switchView('remediation', '${escapeJsStr(q.subjectId)}')">Abrir aula da disciplina</button>
              ${!ans.correct ? `<button class="btn btn-outline btn-sm" onclick="switchView('errors')">Caderno de Erros</button>` : ""}
            </div>
            <div id="ai-q-status-${escapeHtml(q.id)}" style="display:none; font-size:0.82rem; margin-top:8px;"></div>
          `}
        </div>
      `;
    }

    const bancaClean = isReal ? (q.banca || "Prova Oficial") : "Instituto ACCESS (modelo)";

    return `
      <div class="question-card" id="qcard-${escapeHtml(q.id)}">
        <div class="q-meta">
          <span class="q-tag" style="font-weight:700; color:var(--accent-primary);">${posIdx + 1} / ${totalFiltered}</span>
          ${originBadge}
          <span class="q-tag">${escapeHtml(bancaClean)}</span>
          <span class="q-tag">${escapeHtml(subj ? subj.codigo : q.subjectId)}</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-muted); margin:-6px 0 14px; font-weight:500;">
          ${escapeHtml(subj ? subj.nome : "")}${q.topicName ? " • " + escapeHtml(q.topicName) : ""}
        </div>
        <div class="q-statement">${escapeHtml(q.statement)}</div>
        ${!ans ? renderConfSelectorHtml() : ""}
        <div class="options-list">
          ${optionsButtons}
        </div>
        ${feedbackHtml}
      </div>
    `;
  }

  function renderDiagnosticView() {
    const container = document.getElementById("diagnostic-content");
    if (!container) return;

    const filtered = getFilteredDiagnosticQuestions();
    const realCount = ALL_QUESTIONS.filter(isRealQuestion).length;
    const autoralCount = ALL_QUESTIONS.length - realCount;
    const subjFilter = state.currentDiagSubject || "ALL";
    const originFilter = state.currentDiagOrigin || "ALL";
    const bancaFilter = state.currentDiagBanca || "ALL";
    const statusFilter = state.currentDiagStatus || "ALL";
    const isFocus = state.diagMode !== "list";

    if (state.diagFocusIdx >= filtered.length) state.diagFocusIdx = Math.max(0, filtered.length - 1);
    if (state.diagFocusIdx < 0) state.diagFocusIdx = 0;

    const activeFiltersCount = [subjFilter !== "ALL", originFilter !== "ALL", bancaFilter !== "ALL", statusFilter !== "ALL"].filter(Boolean).length;

    const optionsSubjects = [
      `<option value="ALL" ${subjFilter === "ALL" ? "selected" : ""}>Todas as disciplinas (${ALL_QUESTIONS.length})</option>`,
      ...window.EDITAL_DATA.disciplinas.map(d => {
        const count = ALL_QUESTIONS.filter(q => q.subjectId === d.id).length;
        return `<option value="${d.id}" ${subjFilter === d.id ? "selected" : ""}>[${escapeHtml(d.codigo)}] ${escapeHtml(d.nome)} (${count})</option>`;
      })
    ].join("");

    let mainQuestionsHtml = "";
    if (!filtered.length) {
      mainQuestionsHtml = `
        <div class="card" style="text-align:center; padding:36px 20px;">
          <h3 style="font-size:1.05rem; margin-bottom:6px;">Nenhuma questão encontrada para este filtro</h3>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:14px;">Ajuste os filtros acima ou limpe a seleção atual.</p>
          <button class="btn btn-outline btn-sm" onclick="resetDiagFilters()">Limpar filtros</button>
        </div>
      `;
    } else if (isFocus) {
      const q = filtered[state.diagFocusIdx];
      mainQuestionsHtml = `
        ${renderQuestionCardHtml(q, state.diagFocusIdx, filtered.length)}
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:8px;">
          <button class="btn btn-outline" ${state.diagFocusIdx <= 0 ? "disabled" : ""} onclick="stepDiagQuestion(-1)">← Anterior</button>
          <span style="font-size:0.82rem; color:var(--text-muted);">Questão ${state.diagFocusIdx + 1} de ${filtered.length}</span>
          <button class="btn btn-primary" ${state.diagFocusIdx >= filtered.length - 1 ? "disabled" : ""} onclick="stepDiagQuestion(1)">Próxima →</button>
        </div>
      `;
    } else {
      mainQuestionsHtml = filtered.map((q, idx) => renderQuestionCardHtml(q, idx, filtered.length)).join("");
    }

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="q-toolbar">
          <div class="segmented-tabs">
            <button class="seg-btn ${isFocus ? "active" : ""}" onclick="setDiagMode('focus')">Modo Foco (1 por vez)</button>
            <button class="seg-btn ${!isFocus ? "active" : ""}" onclick="setDiagMode('list')">Lista (${filtered.length})</button>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
            <button class="btn btn-outline btn-sm" id="btn-reshuffle-diag" onclick="reshuffleDiagQuestions()" title="Sortear nova ordem aleatória das questões deste filtro">🔀 Embaralhar</button>
            <button class="btn btn-outline btn-sm" id="btn-toggle-shuffle" onclick="toggleDiagShuffle()" title="Alternar entre ordem aleatória e ordem original das provas">Ordem: ${state.diagShuffle !== false ? "Aleatória" : "Original"}</button>
            ${subjFilter !== "ALL" ? `<button class="btn btn-outline btn-sm" onclick="switchView('remediation', '${escapeJsStr(subjFilter)}')">Abrir aula desta matéria</button>` : ""}
          </div>
        </div>

        <details class="guide-box" ${activeFiltersCount > 0 && filtered.length === 0 ? "open" : ""}>
          <summary>Filtros de questões ${activeFiltersCount > 0 ? `(${activeFiltersCount} ativo${activeFiltersCount > 1 ? "s" : ""})` : ""}</summary>
          <div class="guide-body">
            <div class="filter-grid">
              <div>
                <label class="field-label">Disciplina</label>
                <select class="form-control" onchange="changeDiagSubject(this.value)">${optionsSubjects}</select>
              </div>
              <div>
                <label class="field-label">Origem</label>
                <select class="form-control" onchange="changeDiagOrigin(this.value)">
                  <option value="ALL" ${originFilter === "ALL" ? "selected" : ""}>Todas (${ALL_QUESTIONS.length})</option>
                  <option value="REAL" ${originFilter === "REAL" ? "selected" : ""}>Apenas Reais (${realCount})</option>
                  <option value="AUTORAL" ${originFilter === "AUTORAL" ? "selected" : ""}>Legado Autoral (${autoralCount})</option>
                </select>
              </div>
              <div>
                <label class="field-label">Banca</label>
                <select class="form-control" onchange="changeDiagBanca(this.value)">
                  <option value="ALL" ${bancaFilter === "ALL" ? "selected" : ""}>Todas as bancas</option>
                  ${Array.from(new Set(ALL_QUESTIONS.map(q => (q.banca || "").trim()).filter(Boolean)))
                    .sort((a, b) => a.localeCompare(b))
                    .map(b => `<option value="${escapeHtml(b)}" ${bancaFilter === b ? "selected" : ""}>${escapeHtml(b)}</option>`)
                    .join("")}
                </select>
              </div>
              <div>
                <label class="field-label">Status</label>
                <select class="form-control" onchange="changeDiagStatus(this.value)">
                  <option value="ALL" ${statusFilter === "ALL" ? "selected" : ""}>Todas</option>
                  <option value="UNANSWERED" ${statusFilter === "UNANSWERED" ? "selected" : ""}>Não respondidas</option>
                  <option value="WRONG" ${statusFilter === "WRONG" ? "selected" : ""}>Apenas as que errei</option>
                  <option value="CORRECT" ${statusFilter === "CORRECT" ? "selected" : ""}>Apenas as que acertei</option>
                </select>
              </div>
            </div>
            ${activeFiltersCount > 0 ? `<div style="margin-top:10px; display:flex; justify-content:flex-end;"><button class="btn btn-outline btn-sm" onclick="resetDiagFilters()">Limpar todos os filtros</button></div>` : ""}
          </div>
        </details>

        ${mainQuestionsHtml}
      </div>
    `;
  }

  window.setDiagMode = function (mode) {
    state.diagMode = mode;
    saveState();
    renderDiagnosticView();
  };

  window.reshuffleDiagQuestions = function () {
    state.diagShuffle = true;
    state.diagOrderSeed = Math.floor(Math.random() * 2147483647) + 1;
    state.diagFocusIdx = 0;
    curConf = "certeza";
    saveState();
    renderDiagnosticView();
  };

  window.toggleDiagShuffle = function () {
    state.diagShuffle = state.diagShuffle === false;
    if (state.diagShuffle && !state.diagOrderSeed) {
      state.diagOrderSeed = Math.floor(Math.random() * 2147483647) + 1;
    }
    state.diagFocusIdx = 0;
    curConf = "certeza";
    saveState();
    renderDiagnosticView();
  };

  window.stepDiagQuestion = function (delta) {
    const filtered = getFilteredDiagnosticQuestions();
    const next = state.diagFocusIdx + delta;
    if (next >= 0 && next < filtered.length) {
      state.diagFocusIdx = next;
      curConf = "certeza";
      saveState();
      renderDiagnosticView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  window.resetDiagFilters = function () {
    state.currentDiagSubject = "ALL";
    state.currentDiagOrigin = "ALL";
    state.currentDiagBanca = "ALL";
    state.currentDiagStatus = "ALL";
    state.diagFocusIdx = 0;
    saveState();
    renderDiagnosticView();
  };

  window.changeDiagSubject = function (val) { state.currentDiagSubject = val; state.diagFocusIdx = 0; saveState(); renderDiagnosticView(); };
  window.changeDiagOrigin = function (val) { state.currentDiagOrigin = val; state.diagFocusIdx = 0; saveState(); renderDiagnosticView(); };
  window.changeDiagBanca = function (val) { state.currentDiagBanca = val; state.diagFocusIdx = 0; saveState(); renderDiagnosticView(); };
  window.changeDiagStatus = function (val) { state.currentDiagStatus = val; state.diagFocusIdx = 0; saveState(); renderDiagnosticView(); };

  window.answerQuestion = function (questionId, selectedIndex) {
    const q = QUESTION_MAP.get(questionId);
    if (!q) return;
    const conf = curConf || "certeza";
    const ok = selectedIndex === q.correctIndex;
    const optOrder = PERM[q.id] ? PERM[q.id].slice() : q.options.map((_, i) => i);

    state.answers[questionId] = {
      selectedIndex,
      correct: ok,
      timestamp: new Date().toISOString(),
      subjectId: q.subjectId,
      topicId: q.topicId,
      conf,
      optOrder
    };
    recordErrorIfWrong(q, selectedIndex, ok, conf);
    schedule(questionId, ok, conf);
    curConf = "certeza";
    saveState();

    // Preserva posição de rolagem ao responder no modo lista
    const prevScroll = window.scrollY;
    renderDiagnosticView();
    if (state.diagMode === "list") window.scrollTo({ top: prevScroll });
  };

  window.resetQuestion = function (questionId) {
    delete PERM[questionId];
    delete SESS[questionId];
    REVDONE.delete(questionId);
    delete state.answers[questionId];
    delete state.reviews[questionId];
    delete state.errors[questionId];
    saveState();
    const prevScroll = window.scrollY;
    renderDiagnosticView();
    window.scrollTo({ top: prevScroll });
  };

  // ==========================================================================
  // 3. CADERNO DE ERROS & GERADOR DE AULA PERSONALIZADA
  // ==========================================================================
  function buildPersonalizedLessonPrompt(filterSubjectId) {
    ensure();
    const wrong = ALL_QUESTIONS
      .filter(q => state.answers[q.id] && state.answers[q.id].correct === false)
      .filter(q => !filterSubjectId || filterSubjectId === "ALL" || q.subjectId === filterSubjectId);

    if (!wrong.length) return null;

    const byTopic = {};
    wrong.forEach(q => {
      const key = `${subjName(q.subjectId)} :: ${q.topicName || q.topicId}`;
      if (!byTopic[key]) byTopic[key] = [];
      byTopic[key].push(q);
    });

    const meta = (window.EDITAL_DATA && window.EDITAL_DATA.metadata) || {};
    const lines = [
      `Você é meu Tutor Adaptativo de Concursos Públicos, especialista no edital "${meta.concurso || "Meu Concurso"}" (${meta.cargo || "Cargo"}, Banca ${meta.banca || "Multibanca"}).`,
      "",
      "## MISSÃO",
      "Abaixo estão EXCLUSIVAMENTE as questões que eu ERREI. Não perca tempo com teoria genérica do que eu já sei. Monte uma AULA CIRÚRGICA focada nos meus erros reais.",
      "",
      "## REGRAS OBRIGATÓRIAS DA AULA",
      "1. Agrupe a aula pelos tópicos em que mais errei (do mais crítico para o menos crítico).",
      "2. Para cada lacuna identificada:",
      "   - Explique o conceito do zero com clareza e rigor técnico de prova;",
      "   - Mostre EXATAMENTE por que a alternativa que eu marquei estava errada (desmontando o meu raciocínio falso);",
      `   - Destaque a pegadinha clássica da banca (${meta.banca || "banca organizadora"});`,
      "   - Dê um exemplo prático ou caso concreto da matéria/lei;",
      "   - Crie uma tabela comparativa ou regra rápida para fixação.",
      "3. Se meu erro foi marcado como 'certeza' (erro confiante / falso positivo), dê atenção dobrada: explique qual conceito confundi.",
      "4. Ao final, entregue um checklist de revisão ativa de 5 pontos-chave.",
      "",
      `## MEUS ERROS REGISTRADOS (${wrong.length} questão(ões))`,
      ""
    ];

    Object.entries(byTopic)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([groupTitle, qs]) => {
        lines.push(`### ${groupTitle} (${qs.length} erro(s))`);
        qs.forEach(q => {
          const ans = state.answers[q.id] || {};
          const reason = state.errors[q.id] || "não classificado";
          const chosenText = (typeof ans.selectedIndex === "number" && q.options[ans.selectedIndex]) ? q.options[ans.selectedIndex] : "não registrada";
          const correctText = q.options[q.correctIndex] || "";
          lines.push(`- **[${q.id}]** (${q.banca}${q.year ? " " + q.year : ""}${q.qconcursosId ? " | " + q.qconcursosId : ""})`);
          lines.push(`  - Confiança: \`${ans.conf || "não informada"}\` | Motivo do erro: \`${reason}\``);
          lines.push(`  - Enunciado: ${q.statement.replace(/\s+/g, " ").slice(0, 420)}`);
          lines.push(`  - O que eu marquei (ERRADO): ${chosenText}`);
          lines.push(`  - Gabarito correto: ${correctText}`);
        });
        lines.push("");
      });

    return lines.join("\n");
  }

  window.getPersonalizedLessonPrompt = buildPersonalizedLessonPrompt;
  window.refreshActiveView = function () {
    switchView(state.currentView || "dashboard");
  };

  window.saveGeneratedAiLesson = function (lessonObj) {
    ensure();
    state.aiLessons.unshift(lessonObj);
    if (state.aiLessons.length > 25) state.aiLessons = state.aiLessons.slice(0, 25);
    saveState();
    window.refreshActiveView();
  };

  window.deleteAiLesson = function (lessonId) {
    ensure();
    if (!confirm("Remover esta aula salva?")) return;
    state.aiLessons = state.aiLessons.filter(l => l.id !== lessonId);
    saveState();
    window.refreshActiveView();
  };

  function renderSavedAiLessonsHtml(filterSubjectId) {
    ensure();
    const list = state.aiLessons.filter(l => !filterSubjectId || filterSubjectId === "ALL" || l.subjectFilter === "ALL" || l.subjectFilter === filterSubjectId);
    if (!list.length) return "";

    const renderMd = window.AI_TUTOR ? window.AI_TUTOR.renderMarkdownSafe : (s => `<pre style="white-space:pre-wrap;">${escapeHtml(s)}</pre>`);
    return list.map((l, idx) => {
      const dt = l.createdAt ? new Date(l.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "";
      const scope = l.subjectFilter && l.subjectFilter !== "ALL" ? subjName(l.subjectFilter) : "Todos os erros";
      return `
        <details class="guide-box" ${idx === 0 ? "open" : ""}>
          <summary>
            <span>Aula IA: ${escapeHtml(scope)} <small style="color:var(--text-muted); font-weight:400;">• ${escapeHtml(dt)} (${escapeHtml(l.model || "IA")})</small></span>
          </summary>
          <div class="guide-body">
            ${renderMd(l.markdown)}
            <div style="margin-top:14px; display:flex; justify-content:flex-end;">
              <button class="btn btn-outline btn-sm" style="color:var(--danger-text);" onclick="deleteAiLesson('${escapeJsStr(l.id)}')">Apagar aula</button>
            </div>
          </div>
        </details>
      `;
    }).join("");
  }

  window.copyPersonalizedLessonPrompt = function (filterSubjectId) {
    const promptText = buildPersonalizedLessonPrompt(filterSubjectId);
    if (!promptText) {
      alert("Nenhum erro registrado neste filtro ainda.");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(promptText)
        .then(() => alert("Prompt copiado! Cole no seu agente de IA."))
        .catch(() => showPromptModal(promptText));
    } else {
      showPromptModal(promptText);
    }
  };

  window.downloadErrorReportMd = function (filterSubjectId) {
    const promptText = buildPersonalizedLessonPrompt(filterSubjectId);
    if (!promptText) {
      alert("Nenhum erro registrado para exportar.");
      return;
    }
    const blob = new Blob([promptText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dossie_erros_dpdf_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  function showPromptModal(text) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;";
    overlay.innerHTML =
      '<div style="background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-strong);border-radius:12px;max-width:680px;width:100%;padding:20px;box-shadow:var(--shadow);">' +
        '<h3 style="margin-bottom:6px;font-size:1.05rem;">Prompt de Aula Personalizada</h3>' +
        '<p style="font-size:0.84rem;color:var(--text-muted);margin-bottom:10px;">Copie o texto abaixo para colar no seu agente IA:</p>' +
        '<textarea readonly class="form-control" style="height:260px;font-family:monospace;font-size:0.78rem;"></textarea>' +
        '<div style="display:flex;justify-content:flex-end;margin-top:12px;">' +
          '<button class="btn btn-primary btn-sm" data-close="1">Fechar</button>' +
        '</div>' +
      '</div>';
    overlay.querySelector("textarea").value = text;
    overlay.addEventListener("click", ev => {
      if (ev.target === overlay || ev.target.getAttribute("data-close")) overlay.remove();
    });
    document.body.appendChild(overlay);
  }

  window.setReason = function (qid, r) {
    ensure();
    state.errors[qid] = state.errors[qid] === r ? "" : r;
    saveState();
    const y = window.scrollY;
    renderErrors();
    window.scrollTo({ top: y });
  };

  window.setErrorTopicFilter = function (subjId) {
    state.errorTopicFilter = subjId;
    saveState();
    renderErrors();
  };

  window.reviewNow = function (qid) {
    ensure();
    state.reviews[qid] = Object.assign(state.reviews[qid] || { step: 0 }, { due: new Date().toISOString() });
    REVDONE.delete(qid);
    delete SESS[qid];
    delete PERM[qid];
    saveState();
    switchView("review");
  };

  function renderErrors() {
    ensure();
    const container = document.getElementById("errors-content");
    if (!container) return;

    const allWrong = ALL_QUESTIONS.filter(q => state.answers[q.id] && state.answers[q.id].correct === false);
    const activeSubj = state.errorTopicFilter || "ALL";
    const wrong = activeSubj === "ALL" ? allWrong : allWrong.filter(q => q.subjectId === activeSubj);

    const subjCounts = {};
    allWrong.forEach(q => { subjCounts[q.subjectId] = (subjCounts[q.subjectId] || 0) + 1; });

    const filterChips = Object.entries(subjCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([sid, n]) => `<button class="seg-btn ${activeSubj === sid ? "active" : ""}" onclick="setErrorTopicFilter('${escapeJsStr(sid)}')">${escapeHtml(subjName(sid))} (${n})</button>`)
      .join("");

    const aiCardHtml = window.AI_TUTOR ? window.AI_TUTOR.renderConfigCard("err", activeSubj) : "";
    const aiSavedHtml = renderSavedAiLessonsHtml(activeSubj);

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="section-head">
          <div>
            <h2>Caderno de Erros</h2>
            <p>${allWrong.length} erro(s) acumulado(s) • Classifique o motivo e transforme suas falhas em aula.</p>
          </div>
          ${allWrong.length ? `
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" onclick="copyPersonalizedLessonPrompt('${escapeJsStr(activeSubj)}')">Copiar Prompt</button>
              <button class="btn btn-outline btn-sm" onclick="downloadErrorReportMd('${escapeJsStr(activeSubj)}')">Baixar .md</button>
            </div>
          ` : ""}
        </div>

        ${aiCardHtml}
        ${aiSavedHtml}

        ${allWrong.length > 0 ? `
          <div class="segmented-tabs" style="margin-bottom:14px; width:100%;">
            <button class="seg-btn ${activeSubj === "ALL" ? "active" : ""}" onclick="setErrorTopicFilter('ALL')">Todas (${allWrong.length})</button>
            ${filterChips}
          </div>
        ` : ""}

        ${wrong.length ? wrong.map(q => {
          const ans = state.answers[q.id] || {};
          const chosen = typeof ans.selectedIndex === "number" ? q.options[ans.selectedIndex] : null;
          const qidEsc = escapeJsStr(q.id);
          return `
            <div class="card">
              <div style="display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap; font-size:0.76rem; color:var(--text-muted); margin-bottom:8px;">
                <span>${escapeHtml(subjName(q.subjectId))} • ${escapeHtml(q.topicName || q.topicId)}</span>
                <span>${escapeHtml(q.banca)}${ans.conf ? ` • Confiança: ${escapeHtml(ans.conf)}` : ""}</span>
              </div>
              <p style="white-space:pre-line; font-size:0.92rem; margin-bottom:10px;">${escapeHtml(q.statement)}</p>
              ${chosen ? `<div style="font-size:0.84rem; color:var(--danger-text); margin-bottom:4px;">Sua marcação: ${escapeHtml(chosen)}</div>` : ""}
              <div style="font-size:0.85rem; color:var(--success-text); font-weight:600; margin-bottom:10px;">Gabarito: ${escapeHtml(q.options[q.correctIndex] || "")}</div>

              <details style="margin-bottom:10px;">
                <summary style="cursor:pointer; font-size:0.82rem; color:var(--accent-primary); font-weight:600;">Ver comentário e resumo cirúrgico</summary>
                <div style="margin-top:8px; padding:12px; background:var(--bg-elevated); border-radius:8px; font-size:0.86rem; white-space:pre-line; color:var(--text-secondary);">${escapeHtml(q.explanation || "")}</div>
              </details>

              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; padding-top:10px; border-top:1px solid var(--border-color);">
                <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
                  <span style="font-size:0.74rem; color:var(--text-muted); margin-right:2px;">Motivo:</span>
                  ${REASONS.map(r => `<button class="btn ${state.errors[q.id] === r[0] ? "btn-primary" : "btn-outline"} btn-sm" onclick="setReason('${qidEsc}', '${r[0]}')">${r[1]}</button>`).join("")}
                </div>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-outline btn-sm" onclick="switchView('remediation', '${escapeJsStr(q.subjectId)}')">Aula</button>
                  <button class="btn btn-primary btn-sm" onclick="reviewNow('${qidEsc}')">Revisar</button>
                </div>
              </div>
            </div>
          `;
        }).join("") : `
          <div class="card" style="text-align:center; padding:32px 20px; color:var(--text-muted);">
            Nenhum erro registrado aqui. Resolva questões na aba <strong>Questões</strong> — o que você errar aparecerá automaticamente neste caderno.
          </div>
        `}
      </div>
    `;
  }

  // ==========================================================================
  // 4. AULAS & REFORÇO (SELETOR LIMPO + ACORDEÕES CONFORTÁVEIS DE LEITURA)
  // ==========================================================================
  window.selectLessonSubject = function (subjId) {
    state.currentLessonSubject = subjId;
    saveState();
    renderRemediationView();
  };

  function renderRemediationView() {
    const container = document.getElementById("remediation-content");
    if (!container) return;

    const g = getGlobalStats();
    let currentSubjId = state.currentLessonSubject;
    if (!currentSubjId || !window.EDITAL_DATA.disciplinas.some(d => d.id === currentSubjId)) {
      currentSubjId = g.weakSubjects.length > 0 ? g.weakSubjects[0].disciplina.id : ((window.EDITAL_DATA.disciplinas.find(d => ALL_QUESTIONS.some(q => q.subjectId === d.id)) || window.EDITAL_DATA.disciplinas[0] || {}).id);
      state.currentLessonSubject = currentSubjId;
    }

    const subj = window.EDITAL_DATA.disciplinas.find(d => d.id === currentSubjId);
    const lesson = window.LESSONS_DATA[currentSubjId];
    const st = getSubjectStats(currentSubjId);
    const subjWrongQuestions = ALL_QUESTIONS.filter(q => q.subjectId === currentSubjId && state.answers[q.id] && !state.answers[q.id].correct);

    const selectOptions = window.EDITAL_DATA.disciplinas.map(d => {
      const dst = getSubjectStats(d.id);
      const prefix = dst.status === "PONTO_FRACO" ? "⚠ " : "";
      const acc = dst.accuracy !== null ? ` (${dst.accuracy}%)` : "";
      return `<option value="${d.id}" ${d.id === currentSubjId ? "selected" : ""}>${prefix}[${escapeHtml(d.codigo)}] ${escapeHtml(d.nome)}${acc}</option>`;
    }).join("");

    const weakQuickChips = g.weakSubjects.length
      ? `<div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:10px;">
          <span style="font-size:0.75rem; color:var(--danger-text); font-weight:600; align-self:center;">Pontos fracos:</span>
          ${g.weakSubjects.map(w => `<button class="btn ${w.disciplina.id === currentSubjId ? "btn-danger" : "btn-outline"} btn-sm" onclick="selectLessonSubject('${w.disciplina.id}')">${escapeHtml(w.disciplina.codigo)} (${w.stats.accuracy}%)</button>`).join("")}
        </div>`
      : "";

    const aiCardHtml = window.AI_TUTOR ? window.AI_TUTOR.renderConfigCard("rem", currentSubjId) : "";
    const aiSavedHtml = renderSavedAiLessonsHtml(currentSubjId);

    const wrongRemediationHtml = subjWrongQuestions.length
      ? `
        <details class="guide-box" open>
          <summary style="color:var(--danger-text);">Reforço direto nos seus erros desta disciplina (${subjWrongQuestions.length})</summary>
          <div class="guide-body">
            ${subjWrongQuestions.map(q => {
              const rem = getEffectiveRemediation(q);
              const qidEsc = escapeJsStr(q.id);
              return rem ? `
                <div class="remediation-box" style="margin-top:0; margin-bottom:10px;">
                  <h4>[${escapeHtml(q.id)}] ${rem.generatedByAi ? "✨ " : ""}${escapeHtml(rem.title)}</h4>
                  <p style="white-space:pre-line; font-size:0.88rem; margin:6px 0;">${escapeHtml(rem.coreConcept)}</p>
                  ${rem.accessTrap ? `<p style="font-size:0.84rem; color:var(--danger-text);"><strong>Pegadinha:</strong> ${escapeHtml(rem.accessTrap)}</p>` : ""}
                  ${rem.mnemonic ? `<p style="font-size:0.84rem; color:var(--success-text); margin-top:4px;"><strong>Regra:</strong> ${escapeHtml(rem.mnemonic)}</p>` : ""}
                </div>
              ` : `
                <div class="remediation-box" style="margin-top:0; margin-bottom:10px;">
                  <h4>[${escapeHtml(q.id)}] ${escapeHtml(q.orgao || "")} ${escapeHtml(String(q.year || ""))}</h4>
                  <p style="font-size:0.88rem; margin:6px 0;">${escapeHtml((q.statement || "").slice(0, 400))}${(q.statement || "").length > 400 ? "…" : ""}</p>
                  <p style="font-size:0.84rem; color:var(--success-text); margin-bottom:8px;"><strong>Gabarito oficial:</strong> ${escapeHtml(String((q.options || [])[q.correctIndex] ?? ""))}</p>
                  <button class="btn btn-primary btn-sm" id="ai-q-btn-${escapeHtml(q.id)}" onclick="window.generateQuestionExplanation('${qidEsc}')">✨ Gerar explicação com IA</button>
                  <div id="ai-q-status-${escapeHtml(q.id)}" style="display:none; font-size:0.82rem; margin-top:6px;"></div>
                </div>
              `;
            }).join("")}
          </div>
        </details>
      `
      : "";

    const modulesHtml = lesson && Array.isArray(lesson.modulos)
      ? lesson.modulos.map((m, idx) => `
          <details class="guide-box" ${idx === 0 ? "open" : ""}>
            <summary>${escapeHtml(m.subtitulo)}</summary>
            <div class="guide-body" style="font-size:0.92rem;">
              ${m.conteudoHtml}
            </div>
          </details>
        `).join("")
      : "";

    const topicsEditalHtml = subj
      ? `
        <details class="guide-box">
          <summary>Síntese rápida de todos os subtópicos do edital (${subj.topicos.length})</summary>
          <div class="guide-body">
            ${subj.topicos.map(t => `
              <div style="padding:12px; border:1px solid var(--border-color); border-radius:var(--radius-sm); margin-bottom:8px; background:var(--bg-elevated);">
                <div style="font-weight:700; font-size:0.9rem; margin-bottom:3px;">Item ${escapeHtml(t.numero)} — ${escapeHtml(t.titulo)}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">${escapeHtml(t.subitens)}</div>
                <div style="font-size:0.87rem; color:var(--text-secondary);"><strong>Resumo de prova:</strong> ${escapeHtml(t.resumoChave)}</div>
              </div>
            `).join("")}
          </div>
        </details>
      `
      : "";

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="card" style="padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:end; gap:12px; flex-wrap:wrap;">
            <div style="flex:1; min-width:240px;">
              <label class="field-label" for="lesson-subj-select">Disciplina em estudo</label>
              <select id="lesson-subj-select" class="form-control" onchange="selectLessonSubject(this.value)">
                ${selectOptions}
              </select>
            </div>
            <button class="btn btn-primary" onclick="switchView('diagnostic', '${escapeJsStr(currentSubjId)}')">Praticar questões desta matéria →</button>
          </div>
          ${weakQuickChips}
        </div>

        ${aiCardHtml}
        ${aiSavedHtml}
        ${wrongRemediationHtml}

        ${lesson ? `
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
              <span class="status-badge ${st.statusClass}">${st.statusLabel}</span>
              <span style="font-size:0.78rem; color:var(--text-muted);">Módulos teóricos base</span>
            </div>
            <h2 style="font-size:1.22rem; font-weight:800; margin-bottom:6px;">${escapeHtml(lesson.titulo)}</h2>
            <p style="color:var(--text-secondary); font-size:0.9rem;">${escapeHtml(lesson.visaoGeral)}</p>
          </div>
          ${modulesHtml}
          ${topicsEditalHtml}
        ` : ""}
      </div>
    `;
  }

  // ==========================================================================
  // 5. REVISÃO DO DIA & SIMULADO CRONOMETRADO
  // ==========================================================================
  function miniCardHtml(q, mode) {
    const sel = mode === "rev" ? SESS[q.id] : SIM.ans[q.id];
    const done = mode === "rev" ? sel !== undefined : mode === "simfb";
    const qidEsc = escapeJsStr(q.id);

    const opts = orderedOptions(q, done ? { optOrder: PERM[q.id] } : null).map(o => {
      let cls = "option-btn";
      if (done) {
        if (o.optIdx === q.correctIndex) cls += " correct";
        else if (o.optIdx === sel) cls += " wrong";
      } else if (mode === "sim" && sel === o.optIdx) {
        cls += " selected";
      }
      const fn = mode === "rev" ? "revAnswer" : "simPick";
      return `<button class="${cls}" data-qid="${escapeHtml(q.id)}" data-idx="${o.optIdx}" ${done ? "disabled" : ""} onclick="${fn}('${qidEsc}', ${o.optIdx})">${escapeHtml(o.optText)}</button>`;
    }).join("");

    const okk = sel === q.correctIndex;
    const fb = done
      ? `<div class="feedback-panel">
          <strong style="color:${sel === undefined ? "var(--text-muted)" : okk ? "var(--success-text)" : "var(--danger-text)"};">
            ${sel === undefined ? "Em branco" : okk ? "Correta!" : "Incorreta"}
          </strong>
          <p style="white-space:pre-line; font-size:0.87rem; color:var(--text-secondary); margin-top:6px;">${escapeHtml(q.explanation || "")}</p>
        </div>`
      : "";

    return `
      <div class="question-card" id="mcard-${escapeHtml(q.id)}">
        <div class="q-meta">
          <span class="q-tag">${escapeHtml(subjName(q.subjectId))}</span>
          <span class="q-tag">${escapeHtml(q.banca || "Banca")}</span>
        </div>
        <div class="q-statement">${escapeHtml(q.statement)}</div>
        ${mode === "rev" && !done ? renderConfSelectorHtml() : ""}
        <div class="options-list">${opts}</div>
        ${fb}
      </div>
    `;
  }

  window.revAnswer = function (qid, idx) {
    const q = QUESTION_MAP.get(qid);
    if (!q) return;
    const conf = curConf || "certeza";
    const ok = idx === q.correctIndex;
    SESS[qid] = idx;
    REVDONE.add(qid);
    const optOrder = PERM[q.id] ? PERM[q.id].slice() : q.options.map((_, i) => i);
    state.answers[qid] = { selectedIndex: idx, correct: ok, timestamp: new Date().toISOString(), subjectId: q.subjectId, topicId: q.topicId, conf, optOrder };
    recordErrorIfWrong(q, idx, ok, conf);
    schedule(qid, ok, conf);
    curConf = "certeza";
    saveState();
    const y = window.scrollY;
    renderReview();
    window.scrollTo({ top: y });
  };

  function renderReview() {
    ensure();
    const container = document.getElementById("review-content");
    if (!container) return;
    const ids = Array.from(new Set(dueIds().concat(Array.from(REVDONE))));
    const qs = ids.map(id => QUESTION_MAP.get(id)).filter(Boolean);

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="section-head">
          <div>
            <h2>Revisão Espaçada do Dia</h2>
            <p>${Object.keys(state.reviews).length} questão(ões) agendada(s) no ciclo de memória (2, 7, 21 e 45 dias).</p>
          </div>
        </div>
        ${qs.length
          ? qs.map(q => miniCardHtml(q, "rev")).join("")
          : `<div class="card" style="text-align:center; padding:32px 20px;">
              <h3 style="font-size:1.05rem; margin-bottom:6px;">Tudo em dia!</h3>
              <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:14px;">Não há questões vencidas para revisar agora.</p>
              <button class="btn btn-primary btn-sm" onclick="switchView('diagnostic')">Resolver novas questões</button>
            </div>`
        }
      </div>
    `;
  }

  // Simulado (sem pulo de scroll ao marcar alternativas!)
  const fmtTime = ms => {
    const s = Math.max(0, Math.round(ms / 1000));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };

  function simTick() {
    const el = document.getElementById("sim-timer");
    const left = SIM.end - Date.now();
    if (el) el.textContent = "Tempo: " + fmtTime(left);
    if (left <= 0) window.simFinish();
  }

  window.simStart = function () {
    const sel = document.getElementById("sim-n");
    const originSel = document.getElementById("sim-origin");
    const onlyReal = originSel && originSel.value === "REAL";
    const pool = onlyReal ? ALL_QUESTIONS.filter(isRealQuestion) : ALL_QUESTIONS;
    if (!pool.length) {
      alert("Nenhuma questão disponível para este filtro de simulado.");
      return;
    }
    const n = Math.min(sel ? +sel.value : 20, pool.length);
    SIM.n = n;
    SIM.qs = shuffle(pool).slice(0, n);
    SIM.ans = {};
    SIM.fin = false;
    SIM.on = true;
    SIM.start = Date.now();
    SIM.end = Date.now() + n * 180000;
    SIM.qs.forEach(q => delete PERM[q.id]);
    clearInterval(SIM.t);
    SIM.t = setInterval(simTick, 1000);
    renderSim();
  };

  window.simPick = function (qid, idx) {
    if (SIM.fin) return;
    SIM.ans[qid] = idx;
    // Atualiza apenas o card clicado e o contador no DOM (zero perda de scroll!)
    const card = document.getElementById("mcard-" + qid);
    if (card) {
      card.querySelectorAll(".option-btn").forEach(btn => {
        btn.classList.toggle("selected", Number(btn.dataset.idx) === idx);
      });
    }
    const prog = document.getElementById("sim-progress-count");
    if (prog) prog.textContent = `${Object.keys(SIM.ans).length} de ${SIM.n} marcadas`;
  };

  window.simReset = function () {
    clearInterval(SIM.t);
    SIM.on = false;
    renderSim();
  };

  window.simFinish = function () {
    if (!SIM.on || SIM.fin) return;
    clearInterval(SIM.t);
    SIM.fin = true;
    ensure();
    const secs = Math.round((Math.min(Date.now(), SIM.end) - SIM.start) / 1000);
    let hits = 0;
    const by = {};

    SIM.qs.forEach(q => {
      const a = SIM.ans[q.id];
      const ok = a === q.correctIndex;
      if (ok) hits++;
      const d = (by[q.subjectId] = by[q.subjectId] || [0, 0]);
      d[1]++;
      if (ok) d[0]++;
      const optOrder = PERM[q.id] ? PERM[q.id].slice() : q.options.map((_, i) => i);
      if (a !== undefined) {
        state.answers[q.id] = { selectedIndex: a, correct: ok, timestamp: new Date().toISOString(), subjectId: q.subjectId, topicId: q.topicId, conf: "simulado", optOrder };
        recordErrorIfWrong(q, a, ok, "simulado");
      }
      if (!ok) schedule(q.id, false, "simulado");
    });

    SIM.by = by;
    SIM.hits = hits;
    state.simulados.push({ date: new Date().toISOString(), n: SIM.n, hits, secs });
    saveState();
    renderSim();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function renderSim() {
    ensure();
    const container = document.getElementById("simulado-content");
    if (!container) return;

    if (!SIM.on) {
      const realCount = ALL_QUESTIONS.filter(isRealQuestion).length;
      const hist = state.simulados.slice(-5).reverse().map(s =>
        `<tr><td>${new Date(s.date).toLocaleDateString("pt-BR")}</td><td><strong>${s.hits}/${s.n}</strong> (${Math.round((100 * s.hits) / Math.max(1, s.n))}%)</td><td>${Math.max(1, Math.round(s.secs / 60))} min</td></tr>`
      ).join("");

      container.innerHTML = `
        <div class="focus-Stage">
          <div class="section-head">
            <div>
              <h2>Simulado Cronometrado</h2>
              <p>Questões misturadas sem gabarito imediato (3 min por questão). Os erros entram automaticamente na Revisão.</p>
            </div>
          </div>
          <div class="card">
            <div class="filter-grid" style="margin-bottom:14px;">
              <div>
                <label class="field-label" for="sim-n">Quantidade</label>
                <select id="sim-n" class="form-control">
                  <option value="10">10 questões (30 min)</option>
                  <option value="20" selected>20 questões (60 min)</option>
                  <option value="30">30 questões (90 min)</option>
                  ${(() => {
                    const tot = (window.EDITAL_DATA && window.EDITAL_DATA.metadata && window.EDITAL_DATA.metadata.provas && window.EDITAL_DATA.metadata.provas.objetiva && window.EDITAL_DATA.metadata.provas.objetiva.totalQuestoes) || 60;
                    return `<option value="${tot}">${tot} questões — Padrão do Edital</option>`;
                  })()}
                  <option value="${realCount}">Todas as reais (${realCount})</option>
                </select>
              </div>
              <div>
                <label class="field-label" for="sim-origin">Banco</label>
                <select id="sim-origin" class="form-control">
                  <option value="REAL" selected>Apenas questões reais (${realCount})</option>
                  <option value="ALL">Todas as questões (${ALL_QUESTIONS.length})</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary" onclick="simStart()">Iniciar simulado</button>
          </div>
          ${hist ? `
            <div class="card">
              <h3 class="card-title" style="margin-bottom:10px;">Últimos simulados</h3>
              <div class="lesson-table-wrapper">
                <table class="lesson-table">
                  <thead><tr><th>Data</th><th>Resultado</th><th>Tempo</th></tr></thead>
                  <tbody>${hist}</tbody>
                </table>
              </div>
            </div>
          ` : ""}
        </div>
      `;
      return;
    }

    let headHtml = "";
    if (SIM.fin) {
      const pct = Math.round((100 * SIM.hits) / Math.max(1, SIM.n));
      const rows = Object.keys(SIM.by).map(id => `<tr><td>${escapeHtml(subjName(id))}</td><td><strong>${SIM.by[id][0]}/${SIM.by[id][1]}</strong></td></tr>`).join("");
      headHtml = `
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Resultado: ${SIM.hits}/${SIM.n} (${pct}%)</h3>
            <button class="btn btn-primary btn-sm" onclick="simReset()">Novo simulado</button>
          </div>
          <div class="lesson-table-wrapper">
            <table class="lesson-table">
              <thead><tr><th>Disciplina</th><th>Acertos</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      `;
    } else {
      headHtml = `
        <div style="position:sticky; top:calc(var(--topbar-h) + 8px); z-index:40; background:var(--bg-card); border:1px solid var(--border-strong); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; gap:10px; box-shadow:var(--shadow-sm);">
          <strong id="sim-timer">Tempo: ${fmtTime(SIM.end - Date.now())}</strong>
          <span id="sim-progress-count" style="font-size:0.84rem; color:var(--text-muted);">${Object.keys(SIM.ans).length} de ${SIM.n} marcadas</span>
          <button class="btn btn-danger btn-sm" onclick="simFinish()">Finalizar</button>
        </div>
      `;
    }

    container.innerHTML = `<div class="focus-Stage">${headHtml}${SIM.qs.map(q => miniCardHtml(q, SIM.fin ? "simfb" : "sim")).join("")}</div>`;
  }

  // ==========================================================================
  // 6. PROVA DISCURSIVA (COM EDITOR DE RASCUNHO SALVO + CALCULADORA OFICIAL)
  // ==========================================================================
  window.setDiscursiveTab = function (tab) {
    state.discursiveTab = tab;
    saveState();
    renderDiscursiveView();
  };

  window.selectDiscursiveItem = function (id) {
    state.selectedDiscursiveId = id;
    saveState();
    renderDiscursiveView();
  };

  window.onDiscursiveDraftInput = function (id, maxLinhas, val) {
    ensure();
    const lines = val ? val.split("\n").length : 0;
    state.discursiveDrafts[id] = Object.assign(state.discursiveDrafts[id] || {}, {
      text: val,
      tl: lines,
      updatedAt: new Date().toISOString()
    });
    saveState();
    const counter = document.getElementById("draft-line-counter");
    if (counter) {
      counter.textContent = `${lines} / ${maxLinhas} linhas`;
      counter.style.color = lines > maxLinhas ? "var(--danger-text)" : "var(--text-muted)";
    }
  };

  function renderDiscursiveView() {
    const container = document.getElementById("discursive-content");
    if (!container) return;

    const data = window.DISCURSIVE_AND_FLASHCARDS || { temasDissertacao: [], questoesTecnicasDiscursivas: [], flashcards: [] };
    const tab = state.discursiveTab || "write";
    const allItems = [
      ...(data.temasDissertacao || []).map(t => ({
        id: t.id,
        type: "diss",
        label: `[Dissertação ${t.valorMaximo || 20} pts] ${t.titulo}`,
        titulo: t.titulo,
        sub: `${t.categoria} • Máx. ${t.maxLinhas} linhas`,
        maxLinhas: t.maxLinhas,
        valorMaximo: t.valorMaximo,
        enunciado: t.proposta,
        espelho: t.espelhoNotaMaxima,
        checklist: t.pontosChaveAvaliacao
      })),
      ...(data.questoesTecnicasDiscursivas || []).map(q => ({
        id: q.id,
        type: "qtec",
        label: `[Questão Técnica ${q.valorMaximo || 10} pts] ${q.titulo}`,
        titulo: q.titulo,
        sub: `${q.disciplina} • Máx. ${q.maxLinhas} linhas`,
        maxLinhas: q.maxLinhas,
        valorMaximo: q.valorMaximo,
        enunciado: q.comando,
        espelho: q.espelhoNotaMaxima,
        checklist: q.checklistCorrecao
      }))
    ];
    if (!allItems.length) {
      allItems.push({
        id: "LIVRE-01",
        type: "diss",
        label: "[Treino Livre] Dissertação / Estudo de Caso (30 linhas)",
        titulo: "Treino Livre de Discursiva",
        sub: "Personalizado • Máx. 30 linhas",
        maxLinhas: 30,
        valorMaximo: 20,
        enunciado: "Use este espaço para treinar redação dissertativa ou estudo de caso do seu concurso, controlando o limite de linhas e avaliando sua nota na aba Calculadora.",
        espelho: "Estrutura recomendada: 1) Introdução com tese clara; 2) Desenvolvimento em 2–3 parágrafos respondendo a cada tópico do comando; 3) Conclusão objetiva.",
        checklist: ["Respondeu a todos os tópicos do comando", "Respeitou o limite máximo de linhas", "Revisou concordância, regência e pontuação"]
      });
    }

    const selected = allItems.find(x => x.id === state.selectedDiscursiveId) || allItems[0];
    const draft = (state.discursiveDrafts && state.discursiveDrafts[selected.id]) || { text: "" };
    const lineCount = draft.text ? draft.text.split("\n").length : 0;

    let tabBody = "";
    if (tab === "write") {
      tabBody = `
        <div class="card">
          <label class="field-label" for="disc-item-select">Escolha a proposta para praticar</label>
          <select id="disc-item-select" class="form-control" onchange="selectDiscursiveItem(this.value)" style="margin-bottom:14px;">
            ${allItems.map(it => `<option value="${it.id}" ${it.id === selected.id ? "selected" : ""}>${escapeHtml(it.label)}</option>`).join("")}
          </select>

          <div style="font-size:0.76rem; color:var(--text-muted); margin-bottom:4px;">${escapeHtml(selected.sub)}</div>
          <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:10px;">${escapeHtml(selected.titulo)}</h3>
          <div style="white-space:pre-line; background:var(--bg-elevated); padding:14px; border-radius:var(--radius-sm); font-size:0.89rem; margin-bottom:16px;">${escapeHtml(selected.enunciado)}</div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <label class="field-label" style="margin:0;">Seu rascunho (salvo automaticamente)</label>
            <span id="draft-line-counter" style="font-size:0.78rem; font-weight:600; color:${lineCount > selected.maxLinhas ? "var(--danger-text)" : "var(--text-muted)"};">${lineCount} / ${selected.maxLinhas} linhas</span>
          </div>
          <textarea class="form-control" rows="12" placeholder="Escreva sua resposta aqui (use Enter a cada linha para simular as linhas da folha oficial)..." oninput="onDiscursiveDraftInput('${escapeJsStr(selected.id)}', ${selected.maxLinhas}, this.value)">${escapeHtml(draft.text)}</textarea>
        </div>

        <details class="guide-box">
          <summary>Ver espelho oficial nota máxima e critérios da banca</summary>
          <div class="guide-body">
            <p style="white-space:pre-line; font-size:0.9rem; margin-bottom:12px;">${escapeHtml(selected.espelho)}</p>
            <strong style="font-size:0.84rem; color:var(--accent-primary);">Critérios de correção:</strong>
            <ul class="lesson-list" style="margin-top:6px;">
              ${selected.checklist.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </div>
        </details>
      `;
    } else if (tab === "calc") {
      tabBody = `
        <div class="card">
          <h3 class="card-title" style="margin-bottom:6px;">Calculadora Oficial (Item 11.8 do Edital)</h3>
          <p style="font-size:0.86rem; color:var(--text-muted); margin-bottom:16px;">Simule o peso das linhas escritas (<code>TL</code>) e dos erros gramaticais (<code>NE</code>):</p>
          <div class="filter-grid">
            <div style="padding:14px; background:var(--bg-elevated); border-radius:var(--radius-sm);">
              <h4 style="font-size:0.95rem; margin-bottom:4px;">1. Dissertação Atualidades (Máx. 20 pts)</h4>
              <div style="font-size:0.76rem; color:var(--text-muted); margin-bottom:10px;"><code>ND = NC - (4 × NE ÷ TL)</code></div>
              <label class="field-label">Nota de Conteúdo (0 a 20)</label>
              <input type="number" id="calc-diss-nc" class="form-control" value="18.5" min="0" max="20" step="0.5" oninput="calcDiscursiveScore()" style="margin-bottom:8px;" />
              <label class="field-label">Linhas Escritas TL (1 a 30)</label>
              <input type="number" id="calc-diss-tl" class="form-control" value="29" min="1" max="30" oninput="calcDiscursiveScore()" style="margin-bottom:8px;" />
              <label class="field-label">Erros Gramaticais NE</label>
              <input type="number" id="calc-diss-ne" class="form-control" value="3" min="0" max="50" oninput="calcDiscursiveScore()" />
              <div id="res-diss-nd" style="margin-top:12px; font-weight:700; font-size:0.95rem;"></div>
            </div>

            <div style="padding:14px; background:var(--bg-elevated); border-radius:var(--radius-sm);">
              <h4 style="font-size:0.95rem; margin-bottom:4px;">2. Questão Técnica TI (Máx. 10 pts cada)</h4>
              <div style="font-size:0.76rem; color:var(--text-muted); margin-bottom:10px;"><code>NQi = NCi - (2 × NEi ÷ TLi)</code></div>
              <label class="field-label">Nota de Conteúdo (0 a 10)</label>
              <input type="number" id="calc-qtec-nc" class="form-control" value="9.5" min="0" max="10" step="0.5" oninput="calcDiscursiveScore()" style="margin-bottom:8px;" />
              <label class="field-label">Linhas Escritas TLi (1 a 20)</label>
              <input type="number" id="calc-qtec-tl" class="form-control" value="19" min="1" max="20" oninput="calcDiscursiveScore()" style="margin-bottom:8px;" />
              <label class="field-label">Erros Gramaticais NEi</label>
              <input type="number" id="calc-qtec-ne" class="form-control" value="2" min="0" max="50" oninput="calcDiscursiveScore()" />
              <div id="res-qtec-nq" style="margin-top:12px; font-weight:700; font-size:0.95rem;"></div>
            </div>
          </div>
        </div>
      `;
    } else {
      tabBody = allItems.map(it => `
        <details class="guide-box">
          <summary>${escapeHtml(it.label)}</summary>
          <div class="guide-body">
            <p style="white-space:pre-line; background:var(--bg-elevated); padding:12px; border-radius:8px; font-size:0.87rem; margin-bottom:12px;">${escapeHtml(it.enunciado)}</p>
            <strong style="font-size:0.84rem; color:var(--success-text);">Espelho Nota Máxima:</strong>
            <p style="white-space:pre-line; font-size:0.89rem; margin:8px 0 12px;">${escapeHtml(it.espelho)}</p>
            <button class="btn btn-outline btn-sm" onclick="selectDiscursiveItem('${escapeJsStr(it.id)}'); setDiscursiveTab('write');">Praticar este tema</button>
          </div>
        </details>
      `).join("");
    }

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="section-head">
          <div>
            <h2>Prova Discursiva (50 pts)</h2>
            <p>1 Dissertação de Atualidades (20 pts) + 3 Questões Técnicas de TI (30 pts).</p>
          </div>
          <div class="segmented-tabs">
            <button class="seg-btn ${tab === "write" ? "active" : ""}" onclick="setDiscursiveTab('write')">Praticar</button>
            <button class="seg-btn ${tab === "calc" ? "active" : ""}" onclick="setDiscursiveTab('calc')">Calculadora</button>
            <button class="seg-btn ${tab === "all" ? "active" : ""}" onclick="setDiscursiveTab('all')">Todos os Temas (${allItems.length})</button>
          </div>
        </div>
        ${tabBody}
      </div>
    `;

    if (tab === "calc") window.calcDiscursiveScore();
  }

  window.calcDiscursiveScore = function () {
    const ncD = parseFloat(document.getElementById("calc-diss-nc")?.value || 0);
    const tlD = Math.max(1, parseInt(document.getElementById("calc-diss-tl")?.value || 1, 10));
    const neD = Math.max(0, parseInt(document.getElementById("calc-diss-ne")?.value || 0, 10));
    const nd = Math.max(0, ncD - (4 * neD / tlD));
    const elD = document.getElementById("res-diss-nd");
    if (elD) {
      elD.textContent = `Nota Final (ND): ${nd.toFixed(2)} / 20,00 ${nd >= 10 ? "(Classificado)" : "(Eliminado < 10,0)"}`;
      elD.style.color = nd >= 10 ? "var(--success-text)" : "var(--danger-text)";
    }

    const ncQ = parseFloat(document.getElementById("calc-qtec-nc")?.value || 0);
    const tlQ = Math.max(1, parseInt(document.getElementById("calc-qtec-tl")?.value || 1, 10));
    const neQ = Math.max(0, parseInt(document.getElementById("calc-qtec-ne")?.value || 0, 10));
    const nqi = Math.max(0, ncQ - (2 * neQ / tlQ));
    const elQ = document.getElementById("res-qtec-nq");
    if (elQ) {
      elQ.textContent = `Questão: ${nqi.toFixed(2)} / 10,00 • Projeção 3x: ${(nqi * 3).toFixed(2)} / 30,00`;
      elQ.style.color = (nqi * 3) >= 15 ? "var(--success-text)" : "var(--danger-text)";
    }
  };

  // ==========================================================================
  // 7. FLASHCARDS DE REVISÃO ATIVA
  // ==========================================================================
  function getActiveFlashcards() {
    const preset = (window.DISCURSIVE_AND_FLASHCARDS && Array.isArray(window.DISCURSIVE_AND_FLASHCARDS.flashcards))
      ? window.DISCURSIVE_AND_FLASHCARDS.flashcards
      : [];
    if (preset.length) return preset;
    // Gera flashcards automáticos a partir das micro-aulas das questões da trilha!
    const generated = [];
    const seen = new Set();
    ALL_QUESTIONS.forEach(q => {
      const rem = getEffectiveRemediation(q);
      if (rem && rem.title && rem.coreConcept) {
        const key = rem.title.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        generated.push({
          disciplina: subjName(q.subjectId),
          frente: `${rem.title}\n\nQual é a regra-chave cobrada em prova?`,
          verso: `${rem.coreConcept}${rem.accessTrap ? "\n\nPegadinha: " + rem.accessTrap : ""}${rem.mnemonic ? "\n\nMacete: " + rem.mnemonic : ""}`
        });
      }
    });
    return generated;
  }

  function renderFlashcardsView() {
    const container = document.getElementById("flashcards-content");
    if (!container) return;
    ensure();

    const cards = getActiveFlashcards();
    if (!cards.length) {
      container.innerHTML = `
        <div class="focus-Stage">
          <div class="card" style="text-align:center; padding:28px;">
            <h3>Nenhum flashcard disponível nesta trilha ainda</h3>
            <p style="font-size:0.86rem; color:var(--text-secondary); margin:8px 0 14px;">
              Ative pacotes da Base Compartilhada ou importe provas na aba <strong>Importar Provas</strong> para gerar flashcards automáticos.
            </p>
            <button class="btn btn-primary btn-sm" onclick="switchView('import')">Importar Provas / Base</button>
          </div>
        </div>
      `;
      return;
    }
    const idx = Math.min(Math.max(0, state.flashcardIndex || 0), cards.length - 1);
    const card = cards[idx];
    const f = state.fc[idx];
    const dueCards = Object.keys(state.fc).filter(k => Date.parse(state.fc[k].due) <= Date.now()).length;

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="section-head">
          <div>
            <h2>Flashcards de Revisão Ativa</h2>
            <p>Cartão ${idx + 1} de ${cards.length} • ${dueCards} vencido(s) hoje</p>
          </div>
          <span class="q-tag">${escapeHtml(card.disciplina)}</span>
        </div>

        <div class="flashcard-container">
          <div class="flashcard-box" onclick="flipFlashcard()">
            <div style="font-size:0.74rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--accent-primary); font-weight:700; margin-bottom:12px;">
              ${state.flashcardFlipped ? "Resposta oficial (toque para voltar)" : "Pergunta (toque para revelar)"}
            </div>
            <div style="font-size:1.08rem; font-weight:600; white-space:pre-line; max-width:540px;">
              ${escapeHtml(state.flashcardFlipped ? card.verso : card.frente)}
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-top:14px;">
          <button class="btn btn-outline" onclick="prevFlashcard()">← Anterior</button>
          <button class="btn btn-outline" onclick="flipFlashcard()">Virar</button>
          <button class="btn btn-danger" onclick="fcMark(false)">Errei</button>
          <button class="btn btn-success" onclick="fcMark(true)">Acertei</button>
          <button class="btn btn-outline" onclick="nextFlashcard()">Próximo →</button>
        </div>
        ${f ? `<p style="text-align:center; font-size:0.78rem; color:var(--text-muted); margin-top:10px;">Próxima revisão deste cartão: ${new Date(f.due).toLocaleDateString("pt-BR")}</p>` : ""}
      </div>
    `;
  }

  window.flipFlashcard = function () { state.flashcardFlipped = !state.flashcardFlipped; renderFlashcardsView(); };
  window.nextFlashcard = function () {
    const total = getActiveFlashcards().length;
    if (!total) return;
    state.flashcardIndex = (state.flashcardIndex + 1) % total;
    state.flashcardFlipped = false;
    saveState();
    renderFlashcardsView();
  };
  window.prevFlashcard = function () {
    const total = getActiveFlashcards().length;
    if (!total) return;
    state.flashcardIndex = (state.flashcardIndex - 1 + total) % total;
    state.flashcardFlipped = false;
    saveState();
    renderFlashcardsView();
  };
  window.fcMark = function (ok) {
    ensure();
    const i = state.flashcardIndex;
    const p = state.fc[i];
    const step = ok ? Math.min((p ? p.step : 0) + 1, STEPS.length - 1) : 0;
    state.fc[i] = { step, due: new Date(Date.now() + STEPS[step] * 864e5).toISOString() };
    saveState();
    window.nextFlashcard();
  };

  // ==========================================================================
  // 8. EDITAL VERTICALIZADO (ACORDEÕES POR DISCIPLINA)
  // ==========================================================================
  function renderEditalView() {
    const container = document.getElementById("edital-content");
    if (!container) return;

    const totalTopics = window.EDITAL_DATA.disciplinas.reduce((acc, d) => acc + d.topicos.length, 0);
    const checkedCount = Object.keys(state.checkedTopics || {}).filter(k => state.checkedTopics[k]).length;

    const cronograma = Array.isArray(window.EDITAL_DATA.cronograma) ? window.EDITAL_DATA.cronograma : [];
    const cronogramaRows = cronograma.map(c => `
      <tr style="${c.destaque ? "background:var(--accent-soft); font-weight:600;" : ""}">
        <td>${escapeHtml(c.ordem)}</td>
        <td>${escapeHtml(c.evento)}</td>
        <td>${escapeHtml(c.data)}</td>
      </tr>
    `).join("");

    const verticalizadoHtml = window.EDITAL_DATA.disciplinas.map((d, idx) => {
      const st = getSubjectStats(d.id);
      const doneInSubj = d.topicos.filter(t => state.checkedTopics[t.id]).length;
      return `
        <details class="guide-box" ${idx === 0 ? "open" : ""}>
          <summary>
            <span><strong>${escapeHtml(d.codigo)}</strong> — ${escapeHtml(d.nome)} <small style="color:var(--text-muted); font-weight:400;">(${doneInSubj}/${d.topicos.length} itens • ${d.pontosProva} pts)</small></span>
          </summary>
          <div class="guide-body" style="padding-top:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="status-badge ${st.statusClass}">${st.statusLabel}</span>
              <button class="btn btn-outline btn-sm" onclick="switchView('diagnostic', '${d.id}')">Praticar questões</button>
            </div>
            ${d.topicos.map(t => {
              const checked = !!state.checkedTopics[t.id];
              return `
                <label style="display:flex; align-items:flex-start; gap:10px; padding:10px 4px; border-top:1px solid var(--border-color); cursor:pointer;">
                  <input type="checkbox" ${checked ? "checked" : ""} style="width:17px; height:17px; margin-top:3px;" onchange="toggleTopicCheck('${escapeJsStr(t.id)}')" />
                  <span style="flex:1;">
                    <strong style="display:block; font-size:0.89rem; ${checked ? "text-decoration:line-through; color:var(--text-muted);" : ""}">Item ${escapeHtml(t.numero)} — ${escapeHtml(t.titulo)}</strong>
                    <span style="font-size:0.8rem; color:var(--text-muted);">${escapeHtml(t.subitens)}</span>
                  </span>
                </label>
              `;
            }).join("")}
          </div>
        </details>
      `;
    }).join("");

    const editalLabel = (window.EDITAL_DATA.metadata && window.EDITAL_DATA.metadata.edital) || "Edital Ativo";
    container.innerHTML = `
      <div class="focus-Stage">
        <div class="section-head">
          <div>
            <h2>Edital Verticalizado</h2>
            <p>${checkedCount} de ${totalTopics} tópicos marcados como revisados.</p>
          </div>
        </div>

        ${cronograma.length ? `
          <details class="guide-box">
            <summary>Cronograma Previsto (${escapeHtml(editalLabel)})</summary>
            <div class="guide-body">
              <div class="lesson-table-wrapper" style="margin:0;">
                <table class="lesson-table">
                  <thead><tr><th>Item</th><th>Evento</th><th>Data</th></tr></thead>
                  <tbody>${cronogramaRows}</tbody>
                </table>
              </div>
            </div>
          </details>
        ` : ""}

        ${verticalizadoHtml}
      </div>
    `;
  }

  window.toggleTopicCheck = function (topicId) {
    state.checkedTopics[topicId] = !state.checkedTopics[topicId];
    saveState();
    const y = window.scrollY;
    renderEditalView();
    window.scrollTo({ top: y });
  };

  // ==========================================================================
  // 9. DADOS, BACKUP, IMPORTAÇÃO DE QUESTÕES REAIS & CONFIGURAÇÃO IA
  // ==========================================================================
  function renderHandoffView() {
    const container = document.getElementById("handoff-content");
    if (!container) return;

    const realCount = ALL_QUESTIONS.filter(isRealQuestion).length;
    const customCount = (state.customQuestions || []).length;
    const aiCardHtml = window.AI_TUTOR ? window.AI_TUTOR.renderConfigCard("settings", "ALL", true) : "";

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="section-head">
          <div>
            <h2>Dados, Backup &amp; Configuração</h2>
            <p>Gerencie seu progresso salvo no navegador, importe questões reais e configure sua API Key.</p>
          </div>
        </div>

        ${aiCardHtml}

        <div class="card">
          <h3 class="card-title" style="margin-bottom:6px;">Conta &amp; Sincronização na Nuvem (Supabase)</h3>
          ${(() => {
            const cs = window.CloudSync ? window.CloudSync.getStatus() : null;
            if (cs && cs.user) {
              return `
                <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:12px;">
                  Conectado como <strong>${escapeHtml(cs.user.email)}</strong> •
                  Status: <strong>${cs.status === "synced" ? "Sincronizado" : cs.status === "syncing" ? "Sincronizando..." : cs.status === "error" ? "Erro ao sincronizar" : "Local"}</strong>
                  ${cs.lastError ? `<br><span style="color:var(--danger-text);">${escapeHtml(cs.lastError)}</span>` : ""}
                </p>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button class="btn btn-primary btn-sm" onclick="CloudSync.syncNow().then(() => renderHandoffView()).catch(e => alert(e.message))">Sincronizar agora</button>
                  <button class="btn btn-outline btn-sm" onclick="CloudSync.openAuthModal()">Gerenciar conta</button>
                  <button class="btn btn-outline btn-sm" style="color:var(--danger-text);" onclick="CloudSync.signOut().then(() => renderHandoffView())">Sair</button>
                </div>
              `;
            }
            return `
              <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:12px;">
                Faça login gratuito para salvar seu progresso na nuvem e continuar de onde parou em qualquer dispositivo.
              </p>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm" onclick="CloudSync.openAuthModal()">Entrar / Criar conta</button>
              </div>
            `;
          })()}
        </div>

        <div class="card">
          <h3 class="card-title" style="margin-bottom:6px;">Trilha Ativa &amp; Banco de Questões</h3>
          ${(() => {
            const tr = window.TracksManager ? window.TracksManager.getActiveTrack() : null;
            return `
              <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:14px;">
                Concurso ativo: <strong>${escapeHtml(tr ? tr.shortName : "Padrão")}</strong> •
                Total carregado: <strong>${ALL_QUESTIONS.length} questões</strong> (${realCount} reais • ${customCount} importadas nesta trilha).
              </p>
              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm" onclick="switchView('import')">Importar PDF de Prova / Base Comum</button>
                <button class="btn btn-outline btn-sm" onclick="triggerImportQuestionsJson()">Importar Questões (.json)</button>
                <button class="btn btn-outline btn-sm" onclick="exportTrackBundleJson()">Exportar Trilha (.json)</button>
                ${tr && !tr.builtin ? `<button class="btn btn-outline btn-sm" style="color:var(--danger-text);" onclick="deleteActiveCustomTrack()">Excluir esta Trilha</button>` : ""}
              </div>
            `;
          })()}
        </div>

        <div class="card">
          <h3 class="card-title" style="margin-bottom:6px;">Sincronização &amp; Backup entre Dispositivos</h3>
          <p style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:14px;">
            Todas as suas trilhas e progresso ficam salvos no <code>localStorage</code> deste navegador (isolados por <code>track_id</code>). Você pode baixar o backup completo ou importar uma trilha compartilhada (<code>.json</code>).
          </p>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="exportProgressJson()">Baixar Backup Completo (.json)</button>
            <button class="btn btn-outline btn-sm" onclick="triggerImportBackup()">Restaurar Backup / Importar Trilha</button>
            <button class="btn btn-outline btn-sm" style="color:var(--danger-text);" onclick="resetAllProgress()">Zerar Respostas desta Trilha</button>
          </div>
          <details style="margin-top:12px; border-top:1px solid var(--border-color); padding-top:10px;">
            <summary style="cursor:pointer; font-size:0.8rem; color:var(--text-muted); font-weight:600;">SQL para tabelas multi-concurso no Supabase (user_tracks + user_track_progress)</summary>
            <pre style="margin-top:8px; font-size:0.75rem; background:var(--bg-elevated); padding:10px; border-radius:8px; overflow-x:auto;">create table if not exists public.user_tracks (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  track_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, track_id)
);
alter table public.user_tracks enable row level security;
create policy "user_tracks_owner_all" on public.user_tracks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.user_track_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, track_id)
);
alter table public.user_track_progress enable row level security;
create policy "user_track_progress_owner_all" on public.user_track_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);</pre>
          </details>
        </div>
      </div>
    `;
  }

  window.triggerImportQuestionsJson = function () {
    let input = document.getElementById("import-questions-json-input");
    if (!input) {
      input = document.createElement("input");
      input.type = "file";
      input.id = "import-questions-json-input";
      input.accept = ".json";
      input.style.display = "none";
      input.addEventListener("change", window.importQuestionsJsonFile);
      document.body.appendChild(input);
    }
    input.click();
  };

  window.importQuestionsJsonFile = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.questions) ? parsed.questions : []);
        const valid = list.filter(q => q && q.id && q.subjectId && q.statement && Array.isArray(q.options) && typeof q.correctIndex === "number");
        if (!valid.length) {
          alert("Nenhuma questão válida encontrada no JSON. Confira o schema em src/data/questions_reais.js.");
          return;
        }
        ensure();
        const existingMap = new Map(state.customQuestions.map(q => [q.id, q]));
        valid.forEach(q => existingMap.set(q.id, Object.assign({ sourceType: "real" }, q)));
        state.customQuestions = Array.from(existingMap.values());
        rebuildQuestionBank();
        saveState();
        alert(`${valid.length} questão(ões) real(is) importada(s)! Total agora: ${ALL_QUESTIONS.length}.`);
        switchView("diagnostic");
      } catch (err) {
        alert("Erro ao importar JSON de questões: " + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  window.exportTrackBundleJson = function () {
    if (!window.TracksManager) return;
    const active = window.TracksManager.getActiveTrack();
    const bundle = window.TracksManager.exportTrackBundle(active.id);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `trilha_${active.id}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  window.deleteActiveCustomTrack = function () {
    if (!window.TracksManager) return;
    const active = window.TracksManager.getActiveTrack();
    if (active.builtin) {
      alert("Trilhas prontas da plataforma não podem ser excluídas.");
      return;
    }
    if (!confirm(`Excluir a trilha "${active.shortName}" e todo o progresso dela?`)) return;
    window.TracksManager.deleteCustomTrack(active.id);
    window.switchTrack(window.TracksManager.getActiveTrack().id);
  };

  window.exportProgressJson = function () {
    const payload = window.TracksManager ? window.TracksManager.getWorkspaceSnapshot() : state;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `estuda_edital_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  window.triggerImportBackup = function () {
    document.getElementById("import-json-input")?.click();
  };

  function mergeProgress(current, imported) {
    return window.TracksManager
      ? window.TracksManager.mergeSingleTrackProgress(current, imported)
      : Object.assign({}, current, imported);
  }

  function askImportMode(onChoice) {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;";
    overlay.innerHTML =
      '<div style="background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-strong);border-radius:12px;max-width:420px;width:100%;padding:20px;box-shadow:var(--shadow);">' +
        '<h3 style="margin-bottom:8px;font-size:1.05rem;">Como importar o backup?</h3>' +
        '<p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:14px;">' +
          '<strong>Mesclar</strong> combina o arquivo com o progresso atual sem perder respostas, rascunhos ou aulas.<br><br>' +
          '<strong>Substituir tudo</strong> usa apenas os dados do arquivo.' +
        '</p>' +
        '<div style="display:flex;flex-direction:column;gap:8px;">' +
          '<button class="btn btn-primary" data-mode="merge">Mesclar com progresso atual</button>' +
          '<button class="btn btn-danger" data-mode="replace">Substituir tudo</button>' +
          '<button class="btn btn-outline" data-mode="cancel">Cancelar</button>' +
        '</div>' +
      '</div>';
    overlay.addEventListener("click", ev => {
      const mode = ev.target && ev.target.getAttribute && ev.target.getAttribute("data-mode");
      if (!mode) return;
      overlay.remove();
      if (mode !== "cancel") onChoice(mode);
    });
    document.body.appendChild(overlay);
  }

  window.importProgressJsonFile = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        // Caso 1: pacote compartilhável de trilha (estuda_edital_track_v1)
        if (imported && imported.format === "estuda_edital_track_v1" && window.TracksManager) {
          const created = window.TracksManager.importTrackBundle(imported);
          window.switchTrack(created.id);
          alert(`Trilha "${created.shortName}" importada com sucesso!`);
          return;
        }
        // Caso 2: workspace multi-track ou backup de progresso legado
        const isWorkspace = imported && typeof imported === "object" && (imported.trackStates || imported.customTracks);
        const isLegacy = imported && typeof imported === "object" && (
          imported.answers || imported.checkedTopics || imported.discursiveDrafts ||
          imported.customQuestions || imported.aiLessons || imported.reviews
        );
        if (!isWorkspace && !isLegacy) {
          alert("Arquivo JSON inválido. Selecione um backup ou trilha exportada pelo Estuda Edital.");
          return;
        }
        askImportMode(mode => {
          if (isWorkspace && window.TracksManager) {
            window.TracksManager.applyMergedWorkspace(imported);
            state = loadState();
          } else {
            state = mode === "merge"
              ? Object.assign(getDefaultState(), mergeProgress(state, imported))
              : Object.assign(getDefaultState(), imported);
          }
          ensure();
          rebuildQuestionBank();
          renderTrackSwitcherUI();
          saveState();
          switchView(state.currentView || "dashboard");
        });
      } catch (err) {
        alert("Erro ao ler o arquivo JSON: " + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  window.resetAllProgress = function () {
    if (!confirm("Zerar respostas, revisões e rascunhos desta trilha? (Suas questões importadas e aulas IA salvas serão mantidas).")) return;
    const preservedQuestions = state.customQuestions || [];
    const preservedLessons = state.aiLessons || [];
    clearInterval(SIM.t);
    SIM.on = false;
    Object.keys(PERM).forEach(k => delete PERM[k]);
    Object.keys(SESS).forEach(k => delete SESS[k]);
    REVDONE.clear();

    state = getDefaultState();
    state.customQuestions = preservedQuestions;
    state.aiLessons = preservedLessons;
    rebuildQuestionBank();
    saveState();
    switchView(state.currentView || "dashboard");
  };

  window.toggleTheme = function () {
    document.body.classList.toggle("light-theme");
    const theme = document.body.classList.contains("light-theme") ? "light" : "dark";
    if (window.TracksManager) window.TracksManager.setTheme(theme);
    saveState();
  };

  // Inicialização segura (funciona mesmo se DOMContentLoaded já tiver disparado)
  function initApp() {
    const theme = window.TracksManager ? window.TracksManager.getTheme() : "dark";
    if (theme === "light") {
      document.body.classList.add("light-theme");
    }
    renderTrackSwitcherUI();
    renderCountdown();
    updateSidebarBadges();
    updateSaveIndicator();
    switchView(state.currentView || "dashboard");

    if (window.CloudSync && window.TracksManager) {
      window.CloudSync.init({
        getState: () => window.TracksManager.getWorkspaceSnapshot(),
        applyMergedState: (cloudWorkspace) => {
          const mergedWs = window.TracksManager.applyMergedWorkspace(cloudWorkspace);
          state = loadState();
          ensure();
          rebuildQuestionBank();
          renderTrackSwitcherUI();
          renderCountdown();
          updateSidebarBadges();
          updateSaveIndicator();
          switchView(state.currentView || "dashboard");
          return mergedWs;
        },
        onStatusChange: () => {
          updateSaveIndicator();
          if (state.currentView === "handoff") {
            renderHandoffView();
          }
        }
      });
    }

    // Na primeira visita, abre o Wizard guiado (o usuário pode pular ou escolher trilha pronta em 1 clique)
    if (window.TracksManager && !window.TracksManager.isOnboardingCompleted() && window.OnboardingWizard) {
      setTimeout(() => window.OnboardingWizard.open(1), 250);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
