// ============================================================================
// MOTOR INTERATIVO DE ESTUDO — ESTUDA EDITAL (MULTI-CONCURSO ADAPTATIVO)
// Arquitetura limpa, sem monkey-patching, UX focada e livre de poluição visual
// ============================================================================

(function () {
  const STEPS = [1, 7, 21, 45];
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
      customFlashcards: [],
      fcFilter: "all",
      fcSubjectFilter: "ALL",
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
  const SIM = {
    on: false,
    mode: "quick",
    tab: "obj",
    qs: [],
    ans: {},
    end: 0,
    start: 0,
    t: null,
    fin: false,
    n: 20,
    by: {},
    hits: 0,
    wrongs: 0,
    blanks: 0,
    discPrompt: null,
    discText: "",
    discMinLines: 20,
    discMaxLines: 30,
    discAiReview: ""
  };

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
    state.customFlashcards = Array.isArray(state.customFlashcards) ? state.customFlashcards : [];
    if (!state.fcFilter) state.fcFilter = "all";
    if (!state.fcSubjectFilter) state.fcSubjectFilter = "ALL";
    if (!state.diagMode) state.diagMode = "focus";
    if (typeof state.diagFocusIdx !== "number") state.diagFocusIdx = 0;
    if (typeof state.diagShuffle !== "boolean") state.diagShuffle = true;
    if (typeof state.diagOrderSeed !== "number") state.diagOrderSeed = Math.floor(Math.random() * 2147483647) + 1;
  }

  function isGenericRemediation(rl) {
    if (!rl || !rl.coreConcept) return true;
    return /^Item oficial da banca/i.test(String(rl.coreConcept).trim());
  }

  function isOfficialBankQuestion(q) {
    if (!q || !q.id) return false;
    const isCustom = Array.isArray(state && state.customQuestions) && state.customQuestions.some(c => c && c.id === q.id);
    if (isCustom) return false;
    return q.sourceType === "real";
  }

  function getEffectiveRemediation(q) {
    if (!q) return null;
    if (state && state.questionExplanations && state.questionExplanations[q.id]) {
      return state.questionExplanations[q.id];
    }
    if (q.remediationLesson && !isGenericRemediation(q.remediationLesson)) {
      return q.remediationLesson;
    }
    if (window.CloudSync && typeof window.CloudSync.getCachedSharedExplanation === "function") {
      const shared = window.CloudSync.getCachedSharedExplanation(q.id);
      if (shared) return shared;
    }
    return null;
  }

  function ensureSharedExplanationLoaded(q) {
    if (!q || !isOfficialBankQuestion(q)) return;
    if (getEffectiveRemediation(q)) return;
    if (!window.CloudSync || typeof window.CloudSync.fetchSharedExplanation !== "function") return;
    window.CloudSync.fetchSharedExplanation(q.id).then(found => {
      if (found && typeof window.refreshActiveView === "function") {
        window.refreshActiveView();
      }
    });
  }

  window.voteCommunityExplanation = async function (qid, isReport) {
    const statusEl = document.getElementById("ai-q-status-" + qid);
    if (!window.CloudSync || typeof window.CloudSync.voteSharedExplanation !== "function") return;
    const res = await window.CloudSync.voteSharedExplanation(qid, isReport);
    if (!res.ok) {
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "var(--danger-text)";
        statusEl.textContent = res.reason === "login_required"
          ? "Faça login na nuvem (botão Nuvem / Entrar) para avaliar ou reportar uma explicação."
          : ("Não foi possível registrar: " + (res.reason || "erro"));
      }
      return;
    }
    if (typeof window.refreshActiveView === "function") window.refreshActiveView();
  };

  function trimToSentence(text, max) {
    const t = String(text || "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    const last = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
    if (last > max * 0.5) return cut.slice(0, last + 1).trim();
    const sp = cut.lastIndexOf(" ");
    return (sp > 0 ? cut.slice(0, sp) : cut).trim() + "…";
  }

  let toastTimer = null;
  window.showToast = function (message, type) {
    const existing = document.getElementById("app-toast-el");
    if (existing) existing.remove();
    clearTimeout(toastTimer);
    const el = document.createElement("div");
    el.id = "app-toast-el";
    el.setAttribute("role", "status");
    el.className = `app-toast ${type === "success" ? "app-toast-success" : type === "error" ? "app-toast-error" : ""}`;
    el.textContent = String(message || "");
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    toastTimer = setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 200);
    }, 3800);
  };

  window.generateQuestionExplanation = async function (qid) {
    const q = QUESTION_MAP.get(qid);
    if (!q) return;
    const statusEl = document.getElementById("ai-q-status-" + qid);
    const btnEl = document.getElementById("ai-q-btn-" + qid);

    if (!window.AI_TUTOR || !window.AI_TUTOR.isConfigured()) {
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "var(--danger-text)";
        statusEl.innerHTML = `Configure sua chave gratuita do Gemini ou OpenAI para gerar explicações. <button class="btn btn-outline btn-sm" style="margin-left:6px;" onclick="window.OnboardingWizard && OnboardingWizard.open(2)">Configurar chave IA</button>`;
      }
      return;
    }

    const aiCfg = window.AI_TUTOR.loadConfig ? window.AI_TUTOR.loadConfig() : {};
    const modelLabel = aiCfg.model || "IA";
    const startedAt = Date.now();
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = `<span class="ai-spinner" aria-hidden="true"></span> Gerando dica...`;
    }
    const renderProgress = () => {
      const secs = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "";
        statusEl.innerHTML = `<div class="ai-loading-banner"><span class="ai-spinner" aria-hidden="true"></span><span>Gerando dica cirúrgica com <strong>${escapeHtml(modelLabel)}</strong>…</span><span class="ai-elapsed">${secs}s</span></div>`;
      }
    };
    renderProgress();
    const timerId = setInterval(renderProgress, 1000);

    try {
      const ans = state.answers[qid];
      const opts = Array.isArray(q.options) ? q.options : [];
      const correctOpt = opts[q.correctIndex] != null ? String(opts[q.correctIndex]) : "";
      const chosenOpt = ans && opts[ans.selectedIndex] != null ? String(opts[ans.selectedIndex]) : "";
      const prompt = [
        "Você é um professor de concursos públicos brasileiros. Escreva uma DICA CIRÚRGICA curta sobre a questão abaixo: não é uma aula, é um lembrete rápido para o aluno não errar de novo.",
        "",
        "Regras obrigatórias:",
        "- Linguagem simples e direta, em português, sem markdown, sem listas e sem repetir o enunciado.",
        "- Foque só no ponto que decide a questão (a regra que justifica o gabarito oficial).",
        "- Respeite os limites de tamanho de cada campo.",
        "",
        `Banca: ${q.banca || "Oficial"} | Órgão/Ano: ${q.orgao || ""} ${q.year || ""}`,
        `Disciplina: ${subjName(q.subjectId)}`,
        `Enunciado: ${q.statement || ""}`,
        `Alternativas: ${opts.map((o, i) => `${i + 1}) ${o}`).join(" | ")}`,
        `Gabarito oficial: ${correctOpt}`,
        chosenOpt && chosenOpt !== correctOpt ? `Resposta marcada pelo aluno (errou): ${chosenOpt}` : "",
        "",
        "Retorne APENAS um JSON válido, exatamente com estas chaves:",
        '{',
        '  "title": "assunto cobrado, até 60 caracteres",',
        '  "explanation": "por que o gabarito está certo, em até 2 frases e 280 caracteres",',
        '  "coreConcept": "a regra-chave em 1 frase, até 160 caracteres",',
        '  "accessTrap": "a pegadinha da banca em 1 frase, até 140 caracteres",',
        '  "mnemonic": "macete para lembrar, até 90 caracteres"',
        '}'
      ].filter(Boolean).join("\n");

      const parsed = await window.AI_TUTOR.askJson(prompt, { temperature: 0.25 });
      clearInterval(timerId);
      if (!parsed || (!parsed.coreConcept && !parsed.explanation)) {
        throw new Error("A IA retornou uma resposta incompleta. Tente novamente.");
      }

      const remObj = {
        title: trimToSentence(parsed.title || `${subjName(q.subjectId)} — Dica IA`, 70),
        explanation: trimToSentence(parsed.explanation, 320),
        coreConcept: trimToSentence(parsed.coreConcept || parsed.explanation, 200),
        accessTrap: trimToSentence(parsed.accessTrap, 170),
        mnemonic: trimToSentence(parsed.mnemonic, 110),
        modelName: String(aiCfg.model || aiCfg.provider || "").trim(),
        generatedByAi: true,
        generatedAt: new Date().toISOString()
      };

      ensure();
      state.questionExplanations[qid] = remObj;
      const fcCreated = createFlashcardFromTip(q, remObj);
      saveState();

      // Retroalimenta o cache comunitário para questões oficiais (sem bloquear a UI)
      if (isOfficialBankQuestion(q) && window.CloudSync && typeof window.CloudSync.publishSharedExplanation === "function") {
        window.CloudSync.publishSharedExplanation(qid, remObj).then(ok => {
          if (ok && state.questionExplanations[qid]) {
            state.questionExplanations[qid].sharedToCommunity = true;
            saveState();
            if (typeof window.refreshActiveView === "function") window.refreshActiveView();
          }
        }).catch(() => {});
      }

      if (typeof window.refreshActiveView === "function") window.refreshActiveView();
      window.showToast(fcCreated ? "Dica cirúrgica pronta + 1 flashcard criado para revisão!" : "Dica cirúrgica pronta!", "success");
    } catch (err) {
      clearInterval(timerId);
      const msg = err && err.message ? err.message : String(err);
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = "Gerar dica com IA";
      }
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.innerHTML = `<div class="ai-loading-banner" style="border-color:var(--danger); color:var(--danger-text);">Erro ao gerar dica: ${escapeHtml(msg)}</div>`;
      }
      window.showToast("Erro ao gerar dica: " + msg, "error");
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
      heroEyebrow = "Revisão do dia";
      heroTitle = `${dueCount} ${dueCount === 1 ? "questão pendente" : "questões pendentes"} para revisar`;
      heroDesc = "Revise os erros anteriores antes de avançar para blocos novos.";
      heroBtn = `<button class="btn btn-primary" onclick="switchView('review')">Revisar agora</button>`;
    } else if (g.weakSubjects.length > 0) {
      const worst = g.weakSubjects.slice().sort((a, b) => (a.stats.accuracy || 0) - (b.stats.accuracy || 0))[0];
      heroEyebrow = `Prioridade · ${g.weakSubjects.length} ${g.weakSubjects.length === 1 ? "ponto fraco" : "pontos fracos"}`;
      heroTitle = `Reforçar ${worst.disciplina.nome} (${worst.stats.accuracy}%)`;
      heroDesc = "Revise seus erros recentes nesta disciplina ou gere uma aula focada.";
      heroBtn = `
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="switchView('remediation', '${worst.disciplina.id}')">Abrir aula</button>
          <button class="btn btn-outline" onclick="switchView('errors')">Ver erros</button>
        </div>
      `;
    } else if (g.answeredCount === 0) {
      const meta = window.EDITAL_DATA.metadata || {};
      heroEyebrow = meta.banca ? `${meta.concurso || "Estuda Edital"} · ${meta.banca}` : (meta.concurso || "Estuda Edital");
      heroTitle = "Comece pelas questões reais";
      heroDesc = "Responda no seu ritmo. Cada erro vai direto para o caderno de revisão.";
      const firstD = (window.EDITAL_DATA.disciplinas || []).find(d => ALL_QUESTIONS.some(q => q.subjectId === d.id)) || (window.EDITAL_DATA.disciplinas || [])[0];
      heroBtn = firstD
        ? `<button class="btn btn-primary" onclick="switchView('diagnostic', '${escapeHtml(firstD.id)}')">Começar ${escapeHtml(firstD.nome)}</button>`
        : `<button class="btn btn-primary" onclick="switchView('diagnostic')">Começar questões</button>`;
    } else {
      heroEyebrow = "Em andamento";
      heroTitle = `${g.answeredCount} de ${g.totalQ} questões respondidas`;
      heroDesc = `Aproveitamento atual de ${g.overallAccuracy}%. Continue praticando para consolidar o edital.`;
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
                  <span class="subj-code">${escapeHtml(d.codigo)} · Peso ${d.peso}</span>
                  <span class="subj-pts">${d.pontosProva.toFixed(0)} pts</span>
                </div>
                <h4 class="subj-title" title="${escapeHtml(d.descricao)}">${escapeHtml(d.nome)}</h4>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="status-badge ${st.statusClass}">${st.statusLabel}</span>
                  <span style="font-size:0.75rem; color:var(--text-muted); font-variant-numeric:tabular-nums;">${st.answered}/${st.totalQuestions}</span>
                </div>
                <div class="progress-bar-wrap">
                  <div class="progress-bar-fill" style="width:${pct}%;"></div>
                </div>
                <div style="display:flex; gap:6px; margin-top:10px;">
                  <button class="btn btn-outline btn-sm" style="flex:1;" onclick="switchView('diagnostic', '${d.id}')">Questões</button>
                  <button class="btn btn-ghost btn-sm" onclick="switchView('remediation', '${d.id}')">Aula</button>
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
          <div class="kpi-val">${g.answeredCount}<span style="font-size:0.86rem; color:var(--text-muted); font-weight:500;">/${g.totalQ}</span></div>
          <div class="kpi-sub">${g.wrongCount} ${g.wrongCount === 1 ? "erro" : "erros"}</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Aproveitamento</div>
          <div class="kpi-val" style="color:${g.answeredCount === 0 ? "var(--text-primary)" : g.overallAccuracy >= 75 ? "var(--success-text)" : "var(--warning-text)"};">${g.overallAccuracy}%</div>
          <div class="kpi-sub">Meta: 75%+</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Projeção</div>
          <div class="kpi-val">${g.projectedTotalPts}<span style="font-size:0.86rem; color:var(--text-muted); font-weight:500;">/119</span></div>
          <div class="kpi-sub">Bás ${g.projectedBasicPts} · Esp ${g.projectedSpecPts}</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-label">Pontos fracos</div>
          <div class="kpi-val" style="color:${g.weakSubjects.length > 0 ? "var(--danger-text)" : "var(--text-primary)"};">${g.weakSubjects.length}</div>
          <div class="kpi-sub">${dueCount} ${dueCount === 1 ? "revisão hoje" : "revisões hoje"}</div>
        </div>
      </div>

      <div class="section-head">
        <div>
          <h2>Disciplinas do Edital</h2>
          <p>${escapeHtml((window.EDITAL_DATA.metadata && window.EDITAL_DATA.metadata.cargo) || (window.EDITAL_DATA.metadata && window.EDITAL_DATA.metadata.concurso) || "")}</p>
        </div>
        <div class="segmented-tabs">
          <button class="seg-btn ${filter === "ALL" ? "active" : ""}" onclick="setDashFilter('ALL')">Todas (${window.EDITAL_DATA.disciplinas.length})</button>
          <button class="seg-btn ${filter === "WEAK" ? "active" : ""}" onclick="setDashFilter('WEAK')">Fracos (${g.weakSubjects.length})</button>
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

  let diagJustAnsweredId = null;

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
      if (statusFilter === "UNANSWERED" && ans && q.id !== diagJustAnsweredId) return false;
      if (statusFilter === "WRONG" && (!ans || ans.correct)) return false;
      if (statusFilter === "CORRECT" && (!ans || !ans.correct)) return false;
      return true;
    });

    const isAnsweredPast = (q) => Boolean(state.answers[q.id]) && q.id !== diagJustAnsweredId;
    const seed = state.diagOrderSeed || 1;
    const useShuffle = state.diagShuffle !== false;

    if (statusFilter === "ALL") {
      // Sempre coloca questões NÃO respondidas primeiro, preservando ordem aleatória ou original dentro de cada grupo
      const unanswered = [];
      const answered = [];
      list.forEach(q => (isAnsweredPast(q) ? answered : unanswered).push(q));
      if (useShuffle) {
        unanswered.sort((a, b) => seededOrderHash(seed, a.id) - seededOrderHash(seed, b.id));
        answered.sort((a, b) => seededOrderHash(seed, a.id) - seededOrderHash(seed, b.id));
      }
      return unanswered.concat(answered);
    }

    if (useShuffle) {
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
      if (!rem) ensureSharedExplanationLoaded(q);
      const displayExplanation = (rem && rem.generatedByAi && rem.explanation) ? rem.explanation : (q.explanation || "");
      const summaryPrefix = rem && rem.fromCommunity
        ? "Dica da comunidade: "
        : (rem && rem.generatedByAi ? "Dica cirúrgica (IA): " : "Resumo cirúrgico: ");
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
              <summary>${summaryPrefix}${escapeHtml(rem.title)}</summary>
              <div class="guide-body" style="font-size:0.89rem;">
                <p style="white-space:pre-line; margin-bottom:10px;">${escapeHtml(rem.coreConcept)}</p>
                ${rem.accessTrap ? `<p style="color:var(--danger-text); margin-bottom:6px;"><strong>Pegadinha de prova:</strong> ${escapeHtml(rem.accessTrap)}</p>` : ""}
                ${rem.mnemonic ? `<p style="color:var(--success-text);"><strong>Regra de bolso:</strong> ${escapeHtml(rem.mnemonic)}</p>` : ""}
                <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                  ${rem.sharedToCommunity ? `<span style="font-size:0.78rem; color:var(--success-text); font-weight:600;">✓ Compartilhada com a comunidade</span>` : ""}
                  ${rem.fromCommunity ? `
                    <button class="btn btn-outline btn-sm" onclick="window.voteCommunityExplanation('${qidEsc}', false)">Útil (${rem.upvotes || 0})</button>
                    <button class="btn btn-outline btn-sm" onclick="window.voteCommunityExplanation('${qidEsc}', true)">Reportar erro</button>
                  ` : ""}
                  ${rem.generatedByAi ? `${window.AI_TUTOR && window.AI_TUTOR.renderQuickModelSelect ? window.AI_TUTOR.renderQuickModelSelect() : ""}<button class="btn btn-outline btn-sm" id="ai-q-btn-${escapeHtml(q.id)}" onclick="window.generateQuestionExplanation('${qidEsc}')">↻ ${rem.fromCommunity ? "Gerar outra com minha IA" : "Gerar novamente com IA"}</button>` : ""}
                  <button class="btn btn-outline btn-sm" onclick="switchView('remediation', '${escapeJsStr(q.subjectId)}')">Abrir aula da disciplina</button>
                  ${!ans.correct ? `<button class="btn btn-primary btn-sm" onclick="switchView('errors')">Ir para Caderno de Erros / IA</button>` : ""}
                </div>
                <div id="ai-q-status-${escapeHtml(q.id)}" style="display:none; font-size:0.82rem; margin-top:8px;"></div>
              </div>
            </details>
          ` : `
            <div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
              <button class="btn btn-primary btn-sm" id="ai-q-btn-${escapeHtml(q.id)}" onclick="window.generateQuestionExplanation('${qidEsc}')">Gerar dica com IA</button>
              ${window.AI_TUTOR && window.AI_TUTOR.renderQuickModelSelect ? window.AI_TUTOR.renderQuickModelSelect() : ""}
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
        <div class="q-meta" style="font-size:0.78rem; color:var(--text-muted); gap:8px;">
          <span style="font-weight:700; color:var(--accent-primary); font-variant-numeric:tabular-nums;">${posIdx + 1}/${totalFiltered}</span>
          <span>·</span>
          <span>${escapeHtml(bancaClean)}</span>
          ${q.year ? `<span>·</span><span>${escapeHtml(String(q.year))}</span>` : ""}
          <span>·</span>
          <span>${escapeHtml(subj ? subj.codigo : q.subjectId)}</span>
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

  let sessionAnsweredCount = 0;
  let sessionReminderDismissedAt = 0;

  window.dismissSessionCycleBanner = function () {
    sessionReminderDismissedAt = sessionAnsweredCount;
    renderDiagnosticView();
  };

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

    const secondaryFiltersCount = [originFilter !== "ALL", bancaFilter !== "ALL", statusFilter !== "ALL"].filter(Boolean).length;
    const totalUnansweredAll = ALL_QUESTIONS.filter(q => !state.answers[q.id]).length;
    const filteredUnanswered = filtered.filter(q => !state.answers[q.id]).length;

    const optionsSubjects = [
      `<option value="ALL" ${subjFilter === "ALL" ? "selected" : ""}>Todas as disciplinas (${totalUnansweredAll} inéditas / ${ALL_QUESTIONS.length})</option>`,
      ...window.EDITAL_DATA.disciplinas.map(d => {
        const subQs = ALL_QUESTIONS.filter(q => q.subjectId === d.id);
        const rem = subQs.filter(q => !state.answers[q.id]).length;
        return `<option value="${d.id}" ${subjFilter === d.id ? "selected" : ""}>[${escapeHtml(d.codigo)}] ${escapeHtml(d.nome)} (${rem} inéditas / ${subQs.length})</option>`;
      })
    ].join("");

    const showCycleBanner = sessionAnsweredCount >= 25 && (sessionAnsweredCount - sessionReminderDismissedAt) >= 25;
    const cycleBannerHtml = showCycleBanner ? `
      <div class="card" id="diag-cycle-banner" style="padding:12px 14px; margin-bottom:12px; border:1px solid var(--accent-primary); display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
        <div style="font-size:0.84rem; color:var(--text-secondary);">
          <strong>${sessionAnsweredCount} questões feitas nesta sessão.</strong> Para fixar melhor (intercalação), vale alternar a disciplina acima ou fazer uma revisão rápida de 5 min.
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="switchView('review')">Revisão rápida</button>
          <button class="btn btn-outline btn-sm" onclick="switchView('flashcards')">Flashcards</button>
          <button class="btn btn-outline btn-sm" onclick="dismissSessionCycleBanner()">Continuar</button>
        </div>
      </div>
    ` : "";

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
        <div id="diag-subject-bar" style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:12px;">
          <div style="flex:1; min-width:220px;">
            <label class="field-label" for="diag-subject-select" style="margin-bottom:4px; display:block;">Disciplina ativa (${filteredUnanswered} não respondida(s))</label>
            <select id="diag-subject-select" class="form-control" onchange="changeDiagSubject(this.value)">${optionsSubjects}</select>
          </div>
          ${subjFilter !== "ALL" ? `<button class="btn btn-outline btn-sm" style="align-self:flex-end;" onclick="switchView('remediation', '${escapeJsStr(subjFilter)}')">Abrir aula desta matéria</button>` : ""}
        </div>

        <div class="q-toolbar">
          <div class="segmented-tabs">
            <button class="seg-btn ${isFocus ? "active" : ""}" onclick="setDiagMode('focus')">Modo Foco (1 por vez)</button>
            <button class="seg-btn ${!isFocus ? "active" : ""}" onclick="setDiagMode('list')">Lista (${filtered.length})</button>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
            <button class="btn btn-outline btn-sm" id="btn-reshuffle-diag" onclick="reshuffleDiagQuestions()" title="Sortear nova ordem aleatória das questões deste filtro">Embaralhar</button>
            <button class="btn btn-outline btn-sm" id="btn-toggle-shuffle" onclick="toggleDiagShuffle()" title="Alternar entre ordem aleatória e ordem original das provas">Ordem: ${state.diagShuffle !== false ? "Aleatória" : "Original"}</button>
          </div>
        </div>

        <details class="guide-box" ${secondaryFiltersCount > 0 && filtered.length === 0 ? "open" : ""}>
          <summary>Mais filtros ${secondaryFiltersCount > 0 ? `(${secondaryFiltersCount} ativo${secondaryFiltersCount > 1 ? "s" : ""})` : "(Origem, Banca, Status)"}</summary>
          <div class="guide-body">
            <div class="filter-grid">
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
            ${(secondaryFiltersCount > 0 || subjFilter !== "ALL") ? `<div style="margin-top:10px; display:flex; justify-content:flex-end;"><button class="btn btn-outline btn-sm" onclick="resetDiagFilters()">Limpar todos os filtros</button></div>` : ""}
          </div>
        </details>

        ${cycleBannerHtml}
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
    diagJustAnsweredId = null;
    state.diagShuffle = true;
    state.diagOrderSeed = Math.floor(Math.random() * 2147483647) + 1;
    state.diagFocusIdx = 0;
    curConf = "certeza";
    saveState();
    renderDiagnosticView();
  };

  window.toggleDiagShuffle = function () {
    diagJustAnsweredId = null;
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
    const before = getFilteredDiagnosticQuestions();
    const curId = before[state.diagFocusIdx] ? before[state.diagFocusIdx].id : null;
    const hadJustAnswered = Boolean(diagJustAnsweredId && curId === diagJustAnsweredId);
    diagJustAnsweredId = null;
    const filtered = getFilteredDiagnosticQuestions();
    let next = state.diagFocusIdx + delta;
    if (hadJustAnswered && delta > 0 && filtered[state.diagFocusIdx] && filtered[state.diagFocusIdx].id !== curId) {
      // A questão recém-respondida foi movida para o fim (ou filtrada), então o índice atual já aponta para a próxima inédita
      next = state.diagFocusIdx;
    }
    if (next >= 0 && next < filtered.length) {
      state.diagFocusIdx = next;
      curConf = "certeza";
      saveState();
      renderDiagnosticView();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  window.resetDiagFilters = function () {
    diagJustAnsweredId = null;
    state.currentDiagSubject = "ALL";
    state.currentDiagOrigin = "ALL";
    state.currentDiagBanca = "ALL";
    state.currentDiagStatus = "ALL";
    state.diagFocusIdx = 0;
    saveState();
    renderDiagnosticView();
  };

  window.changeDiagSubject = function (val) { diagJustAnsweredId = null; state.currentDiagSubject = val; state.diagFocusIdx = 0; saveState(); renderDiagnosticView(); };
  window.changeDiagOrigin = function (val) { diagJustAnsweredId = null; state.currentDiagOrigin = val; state.diagFocusIdx = 0; saveState(); renderDiagnosticView(); };
  window.changeDiagBanca = function (val) { diagJustAnsweredId = null; state.currentDiagBanca = val; state.diagFocusIdx = 0; saveState(); renderDiagnosticView(); };
  window.changeDiagStatus = function (val) { diagJustAnsweredId = null; state.currentDiagStatus = val; state.diagFocusIdx = 0; saveState(); renderDiagnosticView(); };

  window.answerQuestion = function (questionId, selectedIndex) {
    const q = QUESTION_MAP.get(questionId);
    if (!q) return;
    const conf = curConf || "certeza";
    const ok = selectedIndex === q.correctIndex;
    const optOrder = PERM[q.id] ? PERM[q.id].slice() : q.options.map((_, i) => i);

    diagJustAnsweredId = questionId;
    sessionAnsweredCount += 1;
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
      "5. Encerre com a seção `## Flashcards de Revisão` contendo 3 cartões objetivos exatamente no formato:",
      "   - **Frente:** <pergunta curta e direta de prova> | **Verso:** <regra-chave, pegadinha e macete>",
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
    const scope = lessonObj.subjectFilter && lessonObj.subjectFilter !== "ALL" ? subjName(lessonObj.subjectFilter) : "Revisão Geral";
    const createdFlashcards = createFlashcardsFromLesson(lessonObj, scope);
    saveState();
    window.refreshActiveView();
    return { createdFlashcards };
  };

  window.createFlashcardsFromSavedLesson = function (lessonId) {
    ensure();
    const l = state.aiLessons.find(x => x.id === lessonId);
    if (!l) return;
    const scope = l.subjectFilter && l.subjectFilter !== "ALL" ? subjName(l.subjectFilter) : "Revisão Geral";
    const n = createFlashcardsFromLesson(l, scope);
    saveState();
    if (typeof window.showToast === "function") {
      window.showToast(n > 0 ? `${n} flashcard(s) criado(s) desta aula!` : "Os flashcards desta aula já estavam no seu baralho.", "success");
    }
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
      const linkedCount = (state.customFlashcards || []).filter(fc => fc.lessonId === l.id).length;
      return `
        <details class="guide-box" data-ai-lesson-id="${escapeHtml(l.id)}" ${idx === 0 ? "open" : ""}>
          <summary>
            <span>Aula IA: ${escapeHtml(scope)} <small style="color:var(--text-muted); font-weight:400;">• ${escapeHtml(dt)} (${escapeHtml(l.model || "IA")})${linkedCount ? ` • ${linkedCount} flashcard(s)` : ""}</small></span>
          </summary>
          <div class="guide-body">
            ${renderMd(l.markdown)}
            <div style="margin-top:14px; display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
              ${linkedCount
                ? `<button class="btn btn-outline btn-sm" onclick="setFcFilter('ai'); switchView('flashcards');">Revisar ${linkedCount} flashcard(s) desta aula →</button>`
                : `<button class="btn btn-outline btn-sm" onclick="createFlashcardsFromSavedLesson('${escapeJsStr(l.id)}')">+ Criar flashcards desta aula</button>`}
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
                  <button class="btn btn-primary btn-sm" id="ai-q-btn-${escapeHtml(q.id)}" onclick="window.generateQuestionExplanation('${qidEsc}')">Gerar dica com IA</button>
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

  let earlyReviewIds = [];

  window.startEarlyReview = function () {
    ensure();
    const now = Date.now();
    // Prioriza: 1) questões erradas ainda agendadas, 2) dúvidas/chutes, 3) próximas a vencer
    const scheduled = Object.entries(state.reviews || {})
      .map(([id, r]) => ({ id, due: Date.parse(r.due) || now, q: QUESTION_MAP.get(id), ans: state.answers[id] }))
      .filter(x => x.q);

    scheduled.sort((a, b) => {
      const aErr = a.ans && !a.ans.correct ? 0 : 1;
      const bErr = b.ans && !b.ans.correct ? 0 : 1;
      if (aErr !== bErr) return aErr - bErr;
      return a.due - b.due;
    });

    earlyReviewIds = scheduled.slice(0, 10).map(x => x.id);
    if (!earlyReviewIds.length) {
      if (typeof window.showToast === "function") window.showToast("Responda algumas questões primeiro para montar uma revisão.", "info");
      return;
    }
    renderReview();
  };

  window.clearEarlyReview = function () {
    earlyReviewIds = [];
    renderReview();
  };

  function renderReview() {
    ensure();
    const container = document.getElementById("review-content");
    if (!container) return;

    const now = Date.now();
    const dayMs = 864e5;
    const dueNow = dueIds();
    const activeIds = Array.from(new Set(dueNow.concat(earlyReviewIds).concat(Array.from(REVDONE))));
    const qs = activeIds.map(id => QUESTION_MAP.get(id)).filter(Boolean);

    // Agrupa próximas revisões por janela temporal e disciplina
    const buckets = {
      tomorrow: { label: "Amanhã (24h)", items: [], bySubj: {} },
      week: { label: "Próximos 7 dias", items: [], bySubj: {} },
      later: { label: "Mais adiante (8+ dias)", items: [], bySubj: {} }
    };
    const totalScheduled = Object.keys(state.reviews || {}).length;
    Object.entries(state.reviews || {}).forEach(([id, r]) => {
      const dueTs = Date.parse(r.due);
      if (!dueTs || dueTs <= now) return;
      const q = QUESTION_MAP.get(id);
      if (!q) return;
      const diffDays = (dueTs - now) / dayMs;
      const bucket = diffDays <= 1.5 ? buckets.tomorrow : diffDays <= 7.5 ? buckets.week : buckets.later;
      bucket.items.push(id);
      const sName = subjName(q.subjectId);
      bucket.bySubj[sName] = (bucket.bySubj[sName] || 0) + 1;
    });

    const fcAll = typeof getActiveFlashcards === "function" ? getActiveFlashcards() : [];
    const fcDue = typeof isFcDue === "function" ? fcAll.filter(isFcDue).length : 0;
    const fcAiCount = fcAll.filter(c => c.source === "ai_lesson" || c.source === "ai_tip" || c.source === "manual").length;
    const wrongCount = ALL_QUESTIONS.filter(q => state.answers[q.id] && !state.answers[q.id].correct).length;

    const renderBucketHtml = (b) => {
      if (!b.items.length) return "";
      const subjChips = Object.entries(b.bySubj)
        .sort((a, b2) => b2[1] - a[1])
        .map(([name, cnt]) => `<span class="q-tag">${escapeHtml(name)} (${cnt})</span>`)
        .join("");
      return `
        <div class="card" style="padding:14px 16px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;">
            <strong style="font-size:0.92rem;">${escapeHtml(b.label)}</strong>
            <span style="font-size:0.8rem; color:var(--text-muted);">${b.items.length} questão(ões)</span>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">${subjChips}</div>
        </div>
      `;
    };

    const scheduleHtml = [buckets.tomorrow, buckets.week, buckets.later].map(renderBucketHtml).filter(Boolean).join("");

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="section-head">
          <div>
            <h2>Revisão Espaçada do Dia</h2>
            <p>Ciclo: Questões → Erros & Aula Cirúrgica → Revisão (1, 7, 21 e 45 dias) + Flashcards.</p>
          </div>
          ${totalScheduled > 0 && !dueNow.length && !earlyReviewIds.length
            ? `<button class="btn btn-primary btn-sm" id="btn-early-review" onclick="startEarlyReview()">Antecipar revisão rápida (10)</button>`
            : earlyReviewIds.length
              ? `<button class="btn btn-outline btn-sm" onclick="clearEarlyReview()">Encerrar revisão antecipada</button>`
              : ""}
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:10px; margin-bottom:16px;">
          <div class="card" style="padding:12px 14px;">
            <div style="font-size:0.75rem; color:var(--text-muted);">Questões para hoje</div>
            <div style="font-size:1.3rem; font-weight:700; margin-top:2px;">${dueNow.length}</div>
            <div style="font-size:0.76rem; color:var(--text-secondary);">${totalScheduled} no ciclo de memória</div>
          </div>
          <div class="card" style="padding:12px 14px; cursor:pointer;" onclick="switchView('flashcards')">
            <div style="font-size:0.75rem; color:var(--text-muted);">Flashcards (Aulas & Dicas)</div>
            <div style="font-size:1.3rem; font-weight:700; margin-top:2px;">${fcDue > 0 ? `${fcDue} vencido(s)` : `${fcAiCount} IA`}</div>
            <div style="font-size:0.76rem; color:var(--accent-primary);">Abrir Flashcards →</div>
          </div>
          <div class="card" style="padding:12px 14px; cursor:pointer;" onclick="switchView('errors')">
            <div style="font-size:0.75rem; color:var(--text-muted);">Caderno de Erros</div>
            <div style="font-size:1.3rem; font-weight:700; margin-top:2px;">${wrongCount}</div>
            <div style="font-size:0.76rem; color:var(--accent-primary);">Gerar Aula Cirúrgica →</div>
          </div>
        </div>

        ${qs.length
          ? `
            <h3 style="font-size:0.95rem; margin:6px 0 10px;">
              ${earlyReviewIds.length && !dueNow.length ? "Revisão rápida antecipada (priorizando erros e próximas a vencer)" : "Questões vencidas para revisar agora"}
            </h3>
            ${qs.map(q => miniCardHtml(q, "rev")).join("")}
          `
          : `<div class="card" style="text-align:center; padding:26px 20px; margin-bottom:16px;">
              <h3 style="font-size:1.02rem; margin-bottom:6px;">Tudo em dia por hoje!</h3>
              <p style="color:var(--text-muted); font-size:0.86rem; margin-bottom:14px;">
                ${totalScheduled > 0
                  ? "Suas questões respondidas já estão agendadas na curva de 1, 7, 21 e 45 dias abaixo. Se quiser reforçar agora, antecipe uma revisão rápida."
                  : "Responda questões na aba Questões para iniciar automaticamente seu ciclo de revisão espaçada (1, 7, 21 e 45 dias)."}
              </p>
              <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                ${totalScheduled > 0 ? `<button class="btn btn-primary btn-sm" onclick="startEarlyReview()">Antecipar revisão rápida</button>` : ""}
                <button class="btn btn-outline btn-sm" onclick="switchView('diagnostic')">Resolver novas questões</button>
                ${fcAll.length ? `<button class="btn btn-outline btn-sm" onclick="switchView('flashcards')">Revisar Flashcards</button>` : ""}
              </div>
            </div>`
        }

        ${scheduleHtml ? `
          <div style="margin-top:18px;">
            <h3 style="font-size:0.95rem; margin-bottom:10px;">Agenda das próximas revisões (por disciplina)</h3>
            ${scheduleHtml}
          </div>
        ` : ""}
      </div>
    `;
  }

  // Simulado & Concurso Completo (Objetiva + Dissertativa com cronômetro)
  const fmtTime = ms => {
    const totalSec = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  function getSimDiscursiveThemes() {
    const data = window.DISCURSIVE_AND_FLASHCARDS || {};
    const list = [];
    if (Array.isArray(data.temasDissertacao)) list.push(...data.temasDissertacao);
    if (Array.isArray(data.questoesTecnicasDiscursivas)) list.push(...data.questoesTecnicasDiscursivas);
    if (!list.length) {
      const meta = (window.EDITAL_DATA && window.EDITAL_DATA.metadata) || {};
      const cargo = meta.cargo || meta.concurso || "Concurso Público";
      list.push({
        id: "SIM_DISC_DEFAULT",
        titulo: `Tema Dissertativo — ${cargo}`,
        linhasMax: 30,
        proposta: `Redija um texto dissertativo-argumentativo (20 a 30 linhas) abordando os desafios atuais, princípios da Administração Pública e boas práticas técnicas relacionadas à atuação em ${cargo}.`
      });
    }
    return list;
  }

  function pickProportionalQuestions(pool, targetN) {
    const disciplinas = (window.EDITAL_DATA && Array.isArray(window.EDITAL_DATA.disciplinas)) ? window.EDITAL_DATA.disciplinas : [];
    const totalEditalQ = disciplinas.reduce((acc, d) => acc + (Number(d.questoesProva) || 0), 0);
    if (!disciplinas.length || totalEditalQ <= 0) {
      return shuffle(pool).slice(0, targetN);
    }
    const chosen = [];
    const usedIds = new Set();
    disciplinas.forEach(d => {
      const want = Math.max(1, Math.round(((Number(d.questoesProva) || 0) / totalEditalQ) * targetN));
      const subPool = shuffle(pool.filter(q => q.subjectId === d.id && !usedIds.has(q.id)));
      subPool.slice(0, want).forEach(q => {
        if (chosen.length < targetN) {
          chosen.push(q);
          usedIds.add(q.id);
        }
      });
    });
    if (chosen.length < targetN) {
      shuffle(pool.filter(q => !usedIds.has(q.id))).slice(0, targetN - chosen.length).forEach(q => {
        chosen.push(q);
        usedIds.add(q.id);
      });
    }
    return chosen.slice(0, targetN);
  }

  function simTick() {
    const el = document.getElementById("sim-timer");
    const left = SIM.end - Date.now();
    if (el) {
      el.textContent = "Tempo: " + fmtTime(left);
      if (left <= 600000) el.style.color = "var(--danger-text)";
      else if (left <= 1800000) el.style.color = "var(--warning-text)";
      else el.style.color = "";
    }
    if (left <= 0) window.simFinish(true);
  }

  window.setSimSetupMode = function (mode) {
    state.simSetupMode = mode === "full" ? "full" : "quick";
    saveState();
    renderSim();
  };

  window.simSetTab = function (tab) {
    SIM.tab = tab === "disc" ? "disc" : "obj";
    renderSim();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.simOnDiscInput = function (val) {
    SIM.discText = val;
    const lines = val.trim() ? val.split("\n").length : 0;
    const words = val.trim() ? val.trim().split(/\s+/).length : 0;
    const counter = document.getElementById("sim-disc-counter");
    if (counter) {
      counter.textContent = `${lines} / ${SIM.discMaxLines} linhas · ${words} palavras`;
      counter.style.color = (lines > SIM.discMaxLines || (lines > 0 && lines < SIM.discMinLines)) ? "var(--warning-text)" : "var(--success-text)";
    }
    const tabLbl = document.getElementById("sim-tab-disc-lbl");
    if (tabLbl) tabLbl.textContent = `Dissertativa (${lines}/${SIM.discMaxLines} linhas)`;
  };

  window.simStart = function (modeArg) {
    const mode = modeArg || state.simSetupMode || "quick";
    const originSel = document.getElementById("sim-origin");
    const onlyReal = originSel && originSel.value === "REAL";
    const pool = onlyReal ? ALL_QUESTIONS.filter(isRealQuestion) : ALL_QUESTIONS;
    if (!pool.length) {
      alert("Nenhuma questão disponível para este filtro de simulado.");
      return;
    }

    let n = 20;
    let durationMs = 60 * 60000;
    let selectedQs = [];

    if (mode === "full") {
      const nSel = document.getElementById("sim-full-n");
      const durSel = document.getElementById("sim-full-dur");
      const themeSel = document.getElementById("sim-full-theme");
      n = Math.min(nSel ? +nSel.value : 60, pool.length);
      const durMin = durSel ? +durSel.value : 240;
      durationMs = durMin * 60000;
      selectedQs = pickProportionalQuestions(pool, n);
      const themes = getSimDiscursiveThemes();
      const chosenTheme = themes.find(t => t.id === (themeSel && themeSel.value)) || themes[0];
      SIM.discPrompt = chosenTheme;
      SIM.discText = "";
      SIM.discMinLines = 20;
      SIM.discMaxLines = (chosenTheme && chosenTheme.linhasMax) || 30;
      SIM.discAiReview = "";
    } else {
      const sel = document.getElementById("sim-n");
      n = Math.min(sel ? +sel.value : 20, pool.length);
      durationMs = n * 180000;
      selectedQs = shuffle(pool).slice(0, n);
      SIM.discPrompt = null;
      SIM.discText = "";
      SIM.discAiReview = "";
    }

    SIM.mode = mode;
    SIM.tab = "obj";
    SIM.n = selectedQs.length;
    SIM.qs = selectedQs;
    SIM.ans = {};
    SIM.fin = false;
    SIM.on = true;
    SIM.start = Date.now();
    SIM.end = Date.now() + durationMs;
    SIM.qs.forEach(q => delete PERM[q.id]);
    clearInterval(SIM.t);
    SIM.t = setInterval(simTick, 1000);
    renderSim();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.simPick = function (qid, idx) {
    if (SIM.fin) return;
    // Permite desmarcar clicando na mesma alternativa (útil em provas Certo/Errado!)
    if (SIM.ans[qid] === idx) {
      delete SIM.ans[qid];
    } else {
      SIM.ans[qid] = idx;
    }
    const card = document.getElementById("mcard-" + qid);
    if (card) {
      card.querySelectorAll(".option-btn").forEach(btn => {
        btn.classList.toggle("selected", SIM.ans[qid] !== undefined && Number(btn.dataset.idx) === SIM.ans[qid]);
      });
    }
    const count = Object.keys(SIM.ans).length;
    const prog = document.getElementById("sim-progress-count");
    if (prog) prog.textContent = `${count} de ${SIM.n} marcadas`;
    const tabObj = document.getElementById("sim-tab-obj-lbl");
    if (tabObj) tabObj.textContent = `Objetiva (${count}/${SIM.n})`;
  };

  window.simReset = function () {
    clearInterval(SIM.t);
    SIM.on = false;
    renderSim();
  };

  window.simFinish = function (autoTimeout) {
    if (!SIM.on || SIM.fin) return;
    if (!autoTimeout) {
      const answered = Object.keys(SIM.ans).length;
      const missingObj = SIM.n - answered;
      const emptyDisc = SIM.mode === "full" && !SIM.discText.trim();
      if (missingObj > 0 || emptyDisc) {
        const parts = [];
        if (missingObj > 0) parts.push(`${missingObj} questão(ões) objetiva(s) em branco`);
        if (emptyDisc) parts.push("dissertativa em branco");
        if (!confirm(`Você ainda tem ${parts.join(" e ")}. Deseja entregar a prova mesmo assim?`)) return;
      }
    }

    clearInterval(SIM.t);
    SIM.fin = true;
    ensure();
    const secs = Math.round((Math.min(Date.now(), SIM.end) - SIM.start) / 1000);
    let hits = 0;
    let wrongs = 0;
    let blanks = 0;
    const by = {};

    SIM.qs.forEach(q => {
      const a = SIM.ans[q.id];
      const d = (by[q.subjectId] = by[q.subjectId] || [0, 0, 0]); // [hits, total, wrongs]
      d[1]++;
      if (a === undefined) {
        blanks++;
        return;
      }
      const ok = a === q.correctIndex;
      if (ok) {
        hits++;
        d[0]++;
      } else {
        wrongs++;
        d[2]++;
      }
      const optOrder = PERM[q.id] ? PERM[q.id].slice() : q.options.map((_, i) => i);
      state.answers[q.id] = { selectedIndex: a, correct: ok, timestamp: new Date().toISOString(), subjectId: q.subjectId, topicId: q.topicId, conf: "simulado", optOrder };
      recordErrorIfWrong(q, a, ok, "simulado");
      if (!ok) schedule(q.id, false, "simulado");
    });

    const discLines = SIM.mode === "full" && SIM.discText.trim() ? SIM.discText.trim().split("\n").length : 0;
    if (SIM.mode === "full" && SIM.discPrompt && SIM.discText.trim()) {
      state.discursiveDrafts[SIM.discPrompt.id] = {
        text: SIM.discText,
        tl: discLines,
        updatedAt: new Date().toISOString()
      };
    }

    SIM.by = by;
    SIM.hits = hits;
    SIM.wrongs = wrongs;
    SIM.blanks = blanks;
    state.simulados.push({
      date: new Date().toISOString(),
      mode: SIM.mode,
      n: SIM.n,
      hits,
      wrongs,
      blanks,
      secs,
      discLines,
      discTitle: SIM.discPrompt ? SIM.discPrompt.titulo : ""
    });
    saveState();
    renderSim();
    if (typeof window.showToast === "function") {
      window.showToast(autoTimeout ? "Tempo esgotado! Prova entregue automaticamente." : "Prova entregue e corrigida!", "success");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.simGradeDiscursiveWithAi = async function () {
    const statusEl = document.getElementById("sim-disc-ai-status");
    const btnEl = document.getElementById("sim-disc-ai-btn");
    if (!SIM.discText || !SIM.discText.trim()) {
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.innerHTML = `<div class="ai-loading-banner" style="border-color:var(--danger); color:var(--danger-text);">A dissertativa está em branco.</div>`;
      }
      return;
    }
    if (!window.AI_TUTOR || !window.AI_TUTOR.isConfigured()) {
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.innerHTML = `Configure sua chave gratuita de IA para corrigir a dissertativa. <button class="btn btn-outline btn-sm" style="margin-left:6px;" onclick="window.OnboardingWizard && OnboardingWizard.open(2)">Configurar chave IA</button>`;
      }
      return;
    }

    const cfg = window.AI_TUTOR.loadConfig ? window.AI_TUTOR.loadConfig() : {};
    const startedAt = Date.now();
    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = `<span class="ai-spinner" aria-hidden="true"></span> Corrigindo dissertativa...`;
    }
    const tick = () => {
      const secs = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.innerHTML = `<div class="ai-loading-banner"><span class="ai-spinner" aria-hidden="true"></span><span>Corrigindo dissertativa com <strong>${escapeHtml(cfg.model || "IA")}</strong>…</span><span class="ai-elapsed">${secs}s</span></div>`;
      }
    };
    tick();
    const tid = setInterval(tick, 1000);

    try {
      const meta = (window.EDITAL_DATA && window.EDITAL_DATA.metadata) || {};
      const lines = SIM.discText.trim().split("\n").length;
      const prompt = [
        `Você é um examinador rigoroso da banca ${meta.banca || "de concursos públicos"} corrigindo a prova dissertativa de ${meta.concurso || "concurso"} (${meta.cargo || ""}).`,
        `Tema proposto: ${SIM.discPrompt ? SIM.discPrompt.titulo : "Redação"}`,
        `Comando da proposta: ${SIM.discPrompt ? (SIM.discPrompt.proposta || "") : ""}`,
        `Linhas escritas: ${lines} (faixa esperada: ${SIM.discMinLines} a ${SIM.discMaxLines} linhas).`,
        "",
        "TEXTO DO CANDIDATO:",
        SIM.discText.trim(),
        "",
        "Avalie em Markdown objetivo com:",
        "1. **Nota estimada (0 a 10)** dividida em: Conteúdo/Domínio do tema (até 6,0), Estrutura/Coesão (até 2,0) e Gramática/Norma culta (até 2,0).",
        "2. **Pontos fortes** (2 a 3 itens curtos).",
        "3. **Erros e lacunas a corrigir** (apontamentos cirúrgicos de conteúdo, argumentação e português).",
        "4. **Sugestão prática de reescrita** para o ponto mais fraco."
      ].join("\n");

      const md = await window.AI_TUTOR.askRaw(prompt, { temperature: 0.3 });
      clearInterval(tid);
      SIM.discAiReview = md;
      renderSim();
      if (typeof window.showToast === "function") window.showToast("Dissertativa corrigida pela IA!", "success");
    } catch (err) {
      clearInterval(tid);
      const msg = err && err.message ? err.message : String(err);
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.textContent = "Corrigir dissertativa com IA";
      }
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.innerHTML = `<div class="ai-loading-banner" style="border-color:var(--danger); color:var(--danger-text);">Erro na correção: ${escapeHtml(msg)}</div>`;
      }
      if (typeof window.showToast === "function") window.showToast("Erro na correção: " + msg, "error");
    }
  };

  function renderSim() {
    ensure();
    const container = document.getElementById("simulado-content");
    if (!container) return;

    if (!SIM.on) {
      const realCount = ALL_QUESTIONS.filter(isRealQuestion).length;
      const setupMode = state.simSetupMode || "full";
      const meta = (window.EDITAL_DATA && window.EDITAL_DATA.metadata) || {};
      const provas = meta.provas || {};
      const editalTotalQ = (provas.objetiva && provas.objetiva.totalQuestoes) || 60;
      const editalDurMin = Math.round(((provas.objetiva && provas.objetiva.duracaoHoras) || 4) * 60);
      const themes = getSimDiscursiveThemes();

      const hist = state.simulados.slice(-6).reverse().map(s => {
        const tipo = s.mode === "full" ? `Completo${s.discLines ? ` + ${s.discLines}L` : ""}` : "Objetiva";
        return `<tr><td>${new Date(s.date).toLocaleDateString("pt-BR")}</td><td>${escapeHtml(tipo)}</td><td><strong>${s.hits}/${s.n}</strong> (${Math.round((100 * s.hits) / Math.max(1, s.n))}%)</td><td>${Math.max(1, Math.round(s.secs / 60))} min</td></tr>`;
      }).join("");

      container.innerHTML = `
        <div class="focus-Stage">
          <div class="section-head">
            <div>
              <h2>Simulado &amp; Concurso Completo</h2>
              <p>Treine com cronômetro real: só objetiva ou prova completa (Objetiva + Dissertativa).</p>
            </div>
            <div class="segmented-tabs">
              <button class="seg-btn ${setupMode === "full" ? "active" : ""}" onclick="setSimSetupMode('full')">Concurso Completo</button>
              <button class="seg-btn ${setupMode === "quick" ? "active" : ""}" onclick="setSimSetupMode('quick')">Simulado Rápido</button>
            </div>
          </div>

          ${setupMode === "full" ? `
            <div class="card">
              <div style="margin-bottom:14px;">
                <strong style="font-size:0.96rem;">Prova Objetiva + Dissertativa no mesmo cronômetro</strong>
                <p style="font-size:0.83rem; color:var(--text-muted); margin-top:3px;">
                  Distribuição proporcional às disciplinas do edital, alternância livre entre Objetiva e Dissertativa durante o tempo, e correção opcional da redação por IA ao entregar.
                </p>
              </div>
              <div class="filter-grid" style="margin-bottom:14px;">
                <div>
                  <label class="field-label" for="sim-full-n">Questões da Objetiva</label>
                  <select id="sim-full-n" class="form-control">
                    <option value="${Math.min(editalTotalQ, realCount)}" selected>${Math.min(editalTotalQ, realCount)} questões (Padrão do Edital)</option>
                    <option value="${Math.min(60, realCount)}">60 questões (Meio concurso)</option>
                    <option value="${Math.min(30, realCount)}">30 questões (Treino reduzido)</option>
                  </select>
                </div>
                <div>
                  <label class="field-label" for="sim-full-dur">Tempo total (Obj + Disc)</label>
                  <select id="sim-full-dur" class="form-control">
                    <option value="${editalDurMin}" selected>${Math.floor(editalDurMin / 60)}h${String(editalDurMin % 60).padStart(2, "0")} (Tempo do Edital)</option>
                    <option value="240">4h00</option>
                    <option value="180">3h00</option>
                    <option value="120">2h00 (Treino compacto)</option>
                  </select>
                </div>
                <div>
                  <label class="field-label" for="sim-origin">Banco de questões</label>
                  <select id="sim-origin" class="form-control">
                    <option value="REAL" selected>Apenas questões reais (${realCount})</option>
                    <option value="ALL">Todas (${ALL_QUESTIONS.length})</option>
                  </select>
                </div>
              </div>
              <div style="margin-bottom:14px;">
                <label class="field-label" for="sim-full-theme">Tema da Prova Dissertativa</label>
                <select id="sim-full-theme" class="form-control">
                  ${themes.map(t => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.titulo)}</option>`).join("")}
                </select>
              </div>
              <button class="btn btn-primary" id="btn-start-full-exam" onclick="simStart('full')">Iniciar Concurso Completo</button>
            </div>
          ` : `
            <div class="card">
              <div class="filter-grid" style="margin-bottom:14px;">
                <div>
                  <label class="field-label" for="sim-n">Quantidade</label>
                  <select id="sim-n" class="form-control">
                    <option value="10">10 questões (30 min)</option>
                    <option value="20" selected>20 questões (60 min)</option>
                    <option value="30">30 questões (90 min)</option>
                    <option value="${editalTotalQ}">${editalTotalQ} questões — Padrão do Edital</option>
                  </select>
                </div>
                <div>
                  <label class="field-label" for="sim-origin">Banco</label>
                  <select id="sim-origin" class="form-control">
                    <option value="REAL" selected>Apenas questões reais (${realCount})</option>
                    <option value="ALL">Todas (${ALL_QUESTIONS.length})</option>
                  </select>
                </div>
              </div>
              <button class="btn btn-primary" onclick="simStart('quick')">Iniciar simulado</button>
            </div>
          `}

          ${hist ? `
            <div class="card">
              <h3 class="card-title" style="margin-bottom:10px;">Últimas provas realizadas</h3>
              <div class="lesson-table-wrapper">
                <table class="lesson-table">
                  <thead><tr><th>Data</th><th>Modo</th><th>Objetiva</th><th>Tempo</th></tr></thead>
                  <tbody>${hist}</tbody>
                </table>
              </div>
            </div>
          ` : ""}
        </div>
      `;
      return;
    }

    // PROVA FINALIZADA — BOLETIM COMPLETO
    if (SIM.fin) {
      const pct = Math.round((100 * SIM.hits) / Math.max(1, SIM.n));
      const isCE = SIM.qs.filter(q => Array.isArray(q.options) && q.options.length === 2).length > SIM.n / 2;
      const netScore = SIM.hits - SIM.wrongs;
      const secsUsed = Math.max(1, Math.round((Math.min(Date.now(), SIM.end) - SIM.start) / 1000));
      const rows = Object.keys(SIM.by).map(id => {
        const [h, tot, w] = SIM.by[id];
        return `<tr><td>${escapeHtml(subjName(id))}</td><td><strong>${h}/${tot}</strong></td><td style="color:var(--danger-text);">${w}</td></tr>`;
      }).join("");

      const discLines = SIM.discText.trim() ? SIM.discText.trim().split("\n").length : 0;
      const discWords = SIM.discText.trim() ? SIM.discText.trim().split(/\s+/).length : 0;
      const renderMd = window.AI_TUTOR ? window.AI_TUTOR.renderMarkdownSafe : (s => `<pre style="white-space:pre-wrap;">${escapeHtml(s)}</pre>`);

      const discResultHtml = SIM.mode === "full" ? `
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Prova Dissertativa — ${escapeHtml(SIM.discPrompt ? SIM.discPrompt.titulo : "Redação")}</h3>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${discLines} linhas · ${discWords} palavras (salvo nos seus rascunhos)</div>
            </div>
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              ${window.AI_TUTOR && window.AI_TUTOR.renderQuickModelSelect ? window.AI_TUTOR.renderQuickModelSelect() : ""}
              <button class="btn btn-primary btn-sm" id="sim-disc-ai-btn" onclick="simGradeDiscursiveWithAi()" ${SIM.discText.trim() ? "" : "disabled"}>Corrigir dissertativa com IA</button>
            </div>
          </div>
          <div id="sim-disc-ai-status" style="display:none; margin-bottom:10px;"></div>
          ${SIM.discAiReview ? `<div style="padding:14px; border-radius:var(--radius-sm); background:var(--bg-elevated); border:1px solid var(--border-strong); margin-bottom:12px;">${renderMd(SIM.discAiReview)}</div>` : ""}
          <div style="white-space:pre-wrap; font-size:0.9rem; color:var(--text-secondary); padding:12px; border-radius:var(--radius-sm); background:var(--bg-elevated); border:1px solid var(--border-color); max-height:260px; overflow-y:auto;">${SIM.discText.trim() ? escapeHtml(SIM.discText) : "Dissertativa entregue em branco."}</div>
        </div>
      ` : "";

      container.innerHTML = `
        <div class="focus-Stage">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Boletim da Prova — ${SIM.hits}/${SIM.n} (${pct}%)</h3>
                <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">
                  Acertos: ${SIM.hits} · Erros: ${SIM.wrongs} · Em branco: ${SIM.blanks}${isCE ? ` · Nota líquida (C−E): <strong>${netScore}</strong>` : ""} · Tempo: ${fmtTime(secsUsed * 1000)}
                </div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="simReset()">Nova prova</button>
            </div>
            <div class="lesson-table-wrapper">
              <table class="lesson-table">
                <thead><tr><th>Disciplina</th><th>Acertos</th><th>Erros</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
          ${discResultHtml}
          ${SIM.qs.map(q => miniCardHtml(q, "simfb")).join("")}
        </div>
      `;
      return;
    }

    // PROVA EM ANDAMENTO
    const answeredCount = Object.keys(SIM.ans).length;
    const discLinesNow = SIM.discText.trim() ? SIM.discText.trim().split("\n").length : 0;
    const discWordsNow = SIM.discText.trim() ? SIM.discText.trim().split(/\s+/).length : 0;

    const stickyBar = `
      <div style="position:sticky; top:calc(var(--topbar-h) + 8px); z-index:40; background:var(--bg-card); border:1px solid var(--border-strong); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
        <strong id="sim-timer" style="font-variant-numeric:tabular-nums;">Tempo: ${fmtTime(SIM.end - Date.now())}</strong>
        ${SIM.mode === "full" ? `
          <div class="segmented-tabs">
            <button class="seg-btn ${SIM.tab === "obj" ? "active" : ""}" id="sim-tab-obj-lbl" onclick="simSetTab('obj')">Objetiva (${answeredCount}/${SIM.n})</button>
            <button class="seg-btn ${SIM.tab === "disc" ? "active" : ""}" id="sim-tab-disc-lbl" onclick="simSetTab('disc')">Dissertativa (${discLinesNow}/${SIM.discMaxLines} linhas)</button>
          </div>
        ` : `<span id="sim-progress-count" style="font-size:0.84rem; color:var(--text-muted);">${answeredCount} de ${SIM.n} marcadas</span>`}
        <button class="btn btn-danger btn-sm" onclick="simFinish()">Entregar prova</button>
      </div>
    `;

    let bodyHtml = "";
    if (SIM.mode === "full" && SIM.tab === "disc") {
      const p = SIM.discPrompt || { titulo: "Prova Dissertativa", proposta: "" };
      bodyHtml = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
            <strong style="font-size:1rem;">${escapeHtml(p.titulo)}</strong>
            <span id="sim-disc-counter" style="font-size:0.8rem; color:var(--text-muted); font-variant-numeric:tabular-nums;">${discLinesNow} / ${SIM.discMaxLines} linhas · ${discWordsNow} palavras</span>
          </div>
          <p style="white-space:pre-line; font-size:0.88rem; color:var(--text-secondary); padding:12px; border-radius:var(--radius-sm); background:var(--bg-elevated); border:1px solid var(--border-color); margin-bottom:14px; line-height:1.6;">${escapeHtml(p.proposta || "")}</p>
          <textarea id="sim-disc-textarea" class="form-control" rows="16" style="width:100%; line-height:1.65; font-size:0.93rem;" placeholder="Escreva aqui sua redação (${SIM.discMinLines} a ${SIM.discMaxLines} linhas). Seu texto é mantido mesmo ao alternar para a Prova Objetiva..." oninput="simOnDiscInput(this.value)">${escapeHtml(SIM.discText)}</textarea>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <span style="font-size:0.78rem; color:var(--text-muted);">Dica: você pode voltar para a Objetiva a qualquer momento antes de entregar.</span>
            <button class="btn btn-outline btn-sm" onclick="simSetTab('obj')">← Voltar para Objetiva</button>
          </div>
        </div>
      `;
    } else {
      bodyHtml = SIM.qs.map(q => miniCardHtml(q, "sim")).join("");
      if (SIM.mode === "full") {
        bodyHtml += `
          <div style="display:flex; justify-content:flex-end; margin-top:12px;">
            <button class="btn btn-primary" onclick="simSetTab('disc')">Ir para a Prova Dissertativa →</button>
          </div>
        `;
      }
    }

    container.innerHTML = `<div class="focus-Stage">${stickyBar}${bodyHtml}</div>`;
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

        ${selected.espelho || (Array.isArray(selected.checklist) && selected.checklist.length) ? `
          <details class="guide-box">
            <summary>Ver espelho oficial nota máxima e critérios da banca</summary>
            <div class="guide-body">
              ${selected.espelho ? `<p style="white-space:pre-line; font-size:0.9rem; margin-bottom:12px;">${escapeHtml(selected.espelho)}</p>` : ""}
              ${Array.isArray(selected.checklist) && selected.checklist.length ? `
                <strong style="font-size:0.84rem; color:var(--accent-primary);">Critérios de correção:</strong>
                <ul class="lesson-list" style="margin-top:6px;">
                  ${selected.checklist.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
              ` : ""}
            </div>
          </details>
        ` : ""}
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
  // 7. FLASHCARDS DE REVISÃO ATIVA (UNIFICADO + AUTO-GERAÇÃO POR IA)
  // ==========================================================================
  let fcManualFormOpen = false;

  function normFcKey(str) {
    return String(str || "").toLowerCase().replace(/\s+/g, " ").trim().slice(0, 120);
  }

  function upsertCustomFlashcard(card) {
    ensure();
    if (!card || !card.frente || !card.verso) return false;
    const id = card.id || ("fc-custom-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6));
    const frenteKey = normFcKey(card.frente);
    const existingIdx = state.customFlashcards.findIndex(c => c.id === id || normFcKey(c.frente) === frenteKey);
    const normalized = {
      id,
      disciplina: String(card.disciplina || "Geral").trim(),
      frente: String(card.frente).trim(),
      verso: String(card.verso).trim(),
      source: card.source || "manual",
      sourceLabel: card.sourceLabel || (card.source === "ai_lesson" ? "Aula IA" : card.source === "ai_tip" ? "Dica IA" : "Manual"),
      lessonId: card.lessonId || "",
      questionId: card.questionId || "",
      createdAt: card.createdAt || new Date().toISOString()
    };
    if (existingIdx >= 0) {
      state.customFlashcards[existingIdx] = Object.assign({}, state.customFlashcards[existingIdx], normalized);
      return false;
    }
    state.customFlashcards.unshift(normalized);
    if (state.customFlashcards.length > 200) state.customFlashcards = state.customFlashcards.slice(0, 200);
    return true;
  }

  function createFlashcardFromTip(q, remObj) {
    if (!q || !remObj || (!remObj.coreConcept && !remObj.explanation)) return false;
    const disc = subjName(q.subjectId);
    const title = remObj.title || `${disc} — Ponto-chave`;
    const frente = `${title}\n\nQual é a regra-chave cobrada pela banca${q.banca ? " " + q.banca : ""}?`;
    const parts = [];
    if (remObj.coreConcept) parts.push(remObj.coreConcept);
    if (remObj.explanation && remObj.explanation !== remObj.coreConcept) parts.push(`Explicação: ${remObj.explanation}`);
    if (remObj.accessTrap) parts.push(`Pegadinha: ${remObj.accessTrap}`);
    if (remObj.mnemonic) parts.push(`Macete: ${remObj.mnemonic}`);
    return upsertCustomFlashcard({
      id: `fc-tip-${q.id}`,
      disciplina: disc,
      frente,
      verso: parts.join("\n\n"),
      source: "ai_tip",
      sourceLabel: "Dica IA",
      questionId: q.id
    });
  }

  function extractFlashcardsFromLessonMarkdown(markdown, scopeName, lessonId) {
    const md = String(markdown || "");
    const cards = [];
    const lines = md.split(/\r?\n/);

    // 1. Formato explícito: - **Frente:** ... | **Verso:** ...
    lines.forEach(line => {
      const m = line.match(/\*{0,2}Frente:?\*{0,2}\s*(.+?)\s*\|\s*\*{0,2}Verso:?\*{0,2}\s*(.+)$/i);
      if (m) {
        const f = m[1].replace(/^\*+|\*+$/g, "").trim();
        const v = m[2].replace(/^\*+|\*+$/g, "").trim();
        if (f.length >= 6 && v.length >= 6) {
          cards.push({ frente: f, verso: v });
        }
      }
    });

    // 2. Fallback: se a IA não seguiu o formato exato, extrai dos tópicos/checklist da aula
    if (!cards.length) {
      const headings = [];
      let curHead = "";
      let curBody = [];
      lines.forEach(line => {
        const hm = line.match(/^#{2,3}\s+(.+)/);
        if (hm) {
          if (curHead && curBody.length) headings.push({ head: curHead, body: curBody.join(" ").trim() });
          curHead = hm[1].replace(/[*#]/g, "").trim();
          curBody = [];
        } else if (curHead && line.trim() && !line.trim().startsWith("|")) {
          curBody.push(line.replace(/^[-*•\d.)]+\s*/, "").replace(/\*\*/g, "").trim());
        }
      });
      if (curHead && curBody.length) headings.push({ head: curHead, body: curBody.join(" ").trim() });

      headings
        .filter(h => !/^(miss[ãa]o|meus erros|flashcards)/i.test(h.head) && h.body.length >= 25)
        .slice(0, 3)
        .forEach(h => {
          cards.push({
            frente: `${h.head}\n\nQual é o ponto-chave que não pode errar na prova?`,
            verso: trimToSentence(h.body, 320)
          });
        });
    }

    return cards.slice(0, 5).map((c, idx) => ({
      id: `fc-ail-${lessonId || Date.now()}-${idx + 1}`,
      disciplina: scopeName || "Revisão Geral",
      frente: c.frente,
      verso: c.verso,
      source: "ai_lesson",
      sourceLabel: "Aula IA",
      lessonId: lessonId || ""
    }));
  }

  function createFlashcardsFromLesson(lessonObj, scopeName) {
    if (!lessonObj || !lessonObj.markdown) return 0;
    const extracted = extractFlashcardsFromLessonMarkdown(lessonObj.markdown, scopeName, lessonObj.id);
    let created = 0;
    extracted.forEach(card => {
      if (upsertCustomFlashcard(card)) created++;
    });
    return created;
  }

  function getActiveFlashcards() {
    ensure();
    const list = [];
    const seenIds = new Set();
    const seenFrentes = new Set();

    const pushUnique = (card) => {
      if (!card || !card.frente || !card.verso) return;
      const fk = normFcKey(card.frente);
      if (seenIds.has(card.id) || seenFrentes.has(fk)) return;
      seenIds.add(card.id);
      seenFrentes.add(fk);
      list.push(card);
    };

    // 1. Flashcards criados por Aulas IA, Dicas Cirúrgicas IA e Manuais (prioridade máxima)
    (state.customFlashcards || []).forEach(c => {
      pushUnique(Object.assign({
        source: "manual",
        sourceLabel: c.source === "ai_lesson" ? "Aula IA" : c.source === "ai_tip" ? "Dica IA" : "Manual"
      }, c));
    });

    // 2. Questões que o usuário ERROU (e que tenham dica/explicação útil)
    ALL_QUESTIONS.forEach(q => {
      const ans = state.answers[q.id];
      if (!ans || ans.correct) return;
      const rem = getEffectiveRemediation(q);
      if (rem && rem.coreConcept && !isGenericRemediation(rem)) {
        pushUnique({
          id: `fc-err-${q.id}`,
          disciplina: subjName(q.subjectId),
          frente: `${rem.title || subjName(q.subjectId)}\n\nVocê errou esta questão (${q.banca || "Banca"}). Qual é a regra correta?`,
          verso: `${rem.coreConcept}${rem.accessTrap ? "\n\nPegadinha: " + rem.accessTrap : ""}${rem.mnemonic ? "\n\nMacete: " + rem.mnemonic : ""}`,
          source: "error",
          sourceLabel: "Erro seu",
          questionId: q.id
        });
      }
    });

    // 3. Preset da trilha (ex.: DPDF) — agora somado, sem bloquear os demais
    const preset = (window.DISCURSIVE_AND_FLASHCARDS && Array.isArray(window.DISCURSIVE_AND_FLASHCARDS.flashcards))
      ? window.DISCURSIVE_AND_FLASHCARDS.flashcards
      : [];
    preset.forEach((c, i) => {
      pushUnique({
        id: c.id || `fc-preset-${i}`,
        disciplina: c.disciplina || "Base da Trilha",
        frente: c.frente,
        verso: c.verso,
        source: "preset",
        sourceLabel: "Base da Trilha"
      });
    });

    // 4. Micro-aulas das questões da trilha (não-genéricas)
    ALL_QUESTIONS.forEach(q => {
      const rem = getEffectiveRemediation(q);
      if (rem && rem.title && rem.coreConcept && !isGenericRemediation(rem)) {
        pushUnique({
          id: `fc-q-${q.id}`,
          disciplina: subjName(q.subjectId),
          frente: `${rem.title}\n\nQual é a regra-chave cobrada em prova?`,
          verso: `${rem.coreConcept}${rem.accessTrap ? "\n\nPegadinha: " + rem.accessTrap : ""}${rem.mnemonic ? "\n\nMacete: " + rem.mnemonic : ""}`,
          source: "bank",
          sourceLabel: "Base da Trilha",
          questionId: q.id
        });
      }
    });

    return list;
  }

  function getFcSchedule(card) {
    if (!card) return null;
    return state.fc[card.id] || null;
  }

  function isFcDue(card) {
    const f = getFcSchedule(card);
    return !!(f && f.due && Date.parse(f.due) <= Date.now());
  }

  function getFilteredFlashcards() {
    const all = getActiveFlashcards();
    const filter = state.fcFilter || "all";
    const subj = state.fcSubjectFilter || "ALL";
    return all.filter(c => {
      if (subj !== "ALL" && c.disciplina !== subj) return false;
      if (filter === "due") return isFcDue(c);
      if (filter === "ai") return c.source === "ai_lesson" || c.source === "ai_tip" || c.source === "manual";
      if (filter === "errors") return c.source === "error";
      return true;
    });
  }

  function renderFlashcardsView() {
    const container = document.getElementById("flashcards-content");
    if (!container) return;
    ensure();

    const allCards = getActiveFlashcards();
    const aiCount = allCards.filter(c => c.source === "ai_lesson" || c.source === "ai_tip" || c.source === "manual").length;
    const errCount = allCards.filter(c => c.source === "error").length;
    const dueCount = allCards.filter(isFcDue).length;
    const disciplines = Array.from(new Set(allCards.map(c => c.disciplina).filter(Boolean))).sort();
    const cards = getFilteredFlashcards();

    const manualFormHtml = fcManualFormOpen ? `
      <div class="card" style="margin-bottom:16px; border:1px solid var(--accent-primary);">
        <h3 style="font-size:0.95rem; margin-bottom:10px;">Criar novo flashcard</h3>
        <div class="filter-grid" style="margin-bottom:10px;">
          <div>
            <label class="field-label">Disciplina</label>
            <input id="fc-new-disc" class="form-control" type="text" placeholder="Ex.: Língua Portuguesa, LDB, Direito Adm." value="${escapeHtml(state.fcSubjectFilter !== "ALL" ? state.fcSubjectFilter : (window.EDITAL_DATA.disciplinas[0]?.nome || "Geral"))}" />
          </div>
        </div>
        <div style="margin-bottom:10px;">
          <label class="field-label">Frente (Pergunta ou Conceito)</label>
          <textarea id="fc-new-frente" class="form-control" rows="2" placeholder="Ex.: Qual o prazo de validade do concurso segundo a CF/88?"></textarea>
        </div>
        <div style="margin-bottom:12px;">
          <label class="field-label">Verso (Resposta, Pegadinha e Macete)</label>
          <textarea id="fc-new-verso" class="form-control" rows="3" placeholder="Ex.: Até 2 anos, prorrogável UMA vez por igual período (Art. 37, III)."></textarea>
        </div>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn btn-outline btn-sm" onclick="toggleManualFlashcardForm(false)">Cancelar</button>
          <button class="btn btn-primary btn-sm" onclick="saveManualFlashcard()">Salvar flashcard</button>
        </div>
      </div>
    ` : "";

    const filtersBarHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:14px;">
        <div class="segmented-tabs">
          <button class="seg-btn ${state.fcFilter === "all" ? "active" : ""}" onclick="setFcFilter('all')">Todos (${allCards.length})</button>
          <button class="seg-btn ${state.fcFilter === "due" ? "active" : ""}" onclick="setFcFilter('due')">Vencidos (${dueCount})</button>
          <button class="seg-btn ${state.fcFilter === "ai" ? "active" : ""}" onclick="setFcFilter('ai')">Aulas & Dicas IA (${aiCount})</button>
          <button class="seg-btn ${state.fcFilter === "errors" ? "active" : ""}" onclick="setFcFilter('errors')">Erros (${errCount})</button>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          ${disciplines.length > 1 ? `
            <select class="form-control" style="width:auto; min-width:170px; padding:6px 10px; font-size:0.82rem;" onchange="setFcSubjectFilter(this.value)">
              <option value="ALL" ${state.fcSubjectFilter === "ALL" ? "selected" : ""}>Todas as disciplinas</option>
              ${disciplines.map(d => `<option value="${escapeHtml(d)}" ${state.fcSubjectFilter === d ? "selected" : ""}>${escapeHtml(d)}</option>`).join("")}
            </select>
          ` : ""}
          <button class="btn btn-outline btn-sm" onclick="toggleManualFlashcardForm()">+ Novo flashcard</button>
        </div>
      </div>
    `;

    if (!cards.length) {
      container.innerHTML = `
        <div class="focus-Stage">
          <div class="section-head">
            <div>
              <h2>Flashcards de Revisão Ativa</h2>
              <p>Seus cartões de Aulas IA, Dicas Cirúrgicas, erros e base do edital.</p>
            </div>
          </div>
          ${filtersBarHtml}
          ${manualFormHtml}
          <div class="card" style="text-align:center; padding:28px;">
            <h3>${allCards.length ? "Nenhum flashcard neste filtro" : "Nenhum flashcard disponível nesta trilha ainda"}</h3>
            <p style="font-size:0.86rem; color:var(--text-secondary); margin:8px 0 14px;">
              ${allCards.length
                ? "Troque o filtro acima ou gere uma Aula/Dica Cirúrgica por IA para criar flashcards automáticos."
                : "Ao pedir uma <strong>Aula por IA</strong> ou <strong>Dica Cirúrgica</strong> em qualquer questão, flashcards de revisão são criados automaticamente aqui."}
            </p>
            <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
              ${allCards.length ? `<button class="btn btn-primary btn-sm" onclick="setFcFilter('all'); setFcSubjectFilter('ALL');">Ver todos (${allCards.length})</button>` : `<button class="btn btn-primary btn-sm" onclick="switchView('diagnostic')">Ir para Questões</button>`}
              <button class="btn btn-outline btn-sm" onclick="toggleManualFlashcardForm(true)">+ Criar flashcard manual</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const idx = Math.min(Math.max(0, state.flashcardIndex || 0), cards.length - 1);
    const card = cards[idx];
    const f = getFcSchedule(card);
    const isRemovable = card.source === "ai_lesson" || card.source === "ai_tip" || card.source === "manual";

    container.innerHTML = `
      <div class="focus-Stage">
        <div class="section-head">
          <div>
            <h2>Flashcards de Revisão Ativa</h2>
            <p>Cartão ${idx + 1} de ${cards.length} • ${dueCount} vencido(s) hoje • ${aiCount} gerado(s) por IA/Manual</p>
          </div>
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <span class="q-tag">${escapeHtml(card.sourceLabel || "Base")}</span>
            <span class="q-tag">${escapeHtml(card.disciplina)}</span>
          </div>
        </div>

        ${filtersBarHtml}
        ${manualFormHtml}

        <div class="flashcard-container">
          <div class="flashcard-box" onclick="flipFlashcard()">
            <div style="font-size:0.74rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--accent-primary); font-weight:700; margin-bottom:12px;">
              ${state.flashcardFlipped ? "Resposta oficial (toque para voltar)" : "Pergunta (toque para revelar)"}
            </div>
            <div style="font-size:1.06rem; font-weight:600; white-space:pre-line; max-width:560px;">
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
          ${isRemovable ? `<button class="btn btn-outline btn-sm" style="color:var(--danger-text);" onclick="deleteCustomFlashcard('${escapeJsStr(card.id)}')">Apagar</button>` : ""}
        </div>
        ${f ? `<p style="text-align:center; font-size:0.78rem; color:var(--text-muted); margin-top:10px;">Próxima revisão deste cartão: ${new Date(f.due).toLocaleDateString("pt-BR")}</p>` : ""}
      </div>
    `;
  }

  window.setFcFilter = function (f) {
    ensure();
    state.fcFilter = f || "all";
    state.flashcardIndex = 0;
    state.flashcardFlipped = false;
    saveState();
    renderFlashcardsView();
  };

  window.setFcSubjectFilter = function (subj) {
    ensure();
    state.fcSubjectFilter = subj || "ALL";
    state.flashcardIndex = 0;
    state.flashcardFlipped = false;
    saveState();
    renderFlashcardsView();
  };

  window.toggleManualFlashcardForm = function (force) {
    fcManualFormOpen = typeof force === "boolean" ? force : !fcManualFormOpen;
    renderFlashcardsView();
  };

  window.saveManualFlashcard = function () {
    const disc = (document.getElementById("fc-new-disc")?.value || "").trim() || "Geral";
    const frente = (document.getElementById("fc-new-frente")?.value || "").trim();
    const verso = (document.getElementById("fc-new-verso")?.value || "").trim();
    if (!frente || !verso) {
      if (typeof window.showToast === "function") window.showToast("Preencha a frente e o verso do flashcard.", "error");
      return;
    }
    upsertCustomFlashcard({ disciplina: disc, frente, verso, source: "manual", sourceLabel: "Manual" });
    fcManualFormOpen = false;
    state.fcFilter = "ai";
    state.flashcardIndex = 0;
    state.flashcardFlipped = false;
    saveState();
    if (typeof window.showToast === "function") window.showToast("Flashcard salvo no seu baralho!", "success");
    renderFlashcardsView();
  };

  window.deleteCustomFlashcard = function (cardId) {
    ensure();
    state.customFlashcards = state.customFlashcards.filter(c => c.id !== cardId);
    delete state.fc[cardId];
    state.flashcardIndex = 0;
    state.flashcardFlipped = false;
    saveState();
    if (typeof window.showToast === "function") window.showToast("Flashcard removido.", "info");
    renderFlashcardsView();
  };

  window.flipFlashcard = function () { state.flashcardFlipped = !state.flashcardFlipped; renderFlashcardsView(); };
  window.nextFlashcard = function () {
    const total = getFilteredFlashcards().length;
    if (!total) return;
    state.flashcardIndex = (state.flashcardIndex + 1) % total;
    state.flashcardFlipped = false;
    saveState();
    renderFlashcardsView();
  };
  window.prevFlashcard = function () {
    const total = getFilteredFlashcards().length;
    if (!total) return;
    state.flashcardIndex = (state.flashcardIndex - 1 + total) % total;
    state.flashcardFlipped = false;
    saveState();
    renderFlashcardsView();
  };
  window.fcMark = function (ok) {
    ensure();
    const cards = getFilteredFlashcards();
    if (!cards.length) return;
    const idx = Math.min(Math.max(0, state.flashcardIndex || 0), cards.length - 1);
    const card = cards[idx];
    const p = state.fc[card.id];
    const step = ok ? Math.min((p ? p.step : 0) + 1, STEPS.length - 1) : 0;
    state.fc[card.id] = { step, due: new Date(Date.now() + STEPS[step] * 864e5).toISOString() };
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
          <button class="btn btn-outline btn-sm" id="btn-update-edital" onclick="window.OnboardingWizard && OnboardingWizard.open(1, 'update')" title="Atualizar ou substituir o edital desta trilha sem perder seu progresso">
            Atualizar Edital (PDF / Texto)
          </button>
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
