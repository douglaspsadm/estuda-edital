// ============================================================================
// WIZARD GUIADO (4 PASSOS PARA LEIGOS) + TELA DE IMPORTAÇÃO DE PROVAS/EDITAL
// ============================================================================

(function () {
  "use strict";

  const WIZ = {
    open: false,
    step: 1, // 1: IA Key | 2: Edital | 3: Questões | 4: Pronto
    mode: "custom", // "custom" | "preset"
    selectedPresetId: "base_comum_concursos",
    pdfPages: null,
    pdfFileName: "",
    pageRange: "",
    rawEditalText: "",
    metaConcurso: "",
    metaCargo: "",
    metaBanca: "",
    metaDataProva: "",
    draftEdital: null,
    selectedPacks: [],
    packMapping: {},
    createdTrackId: null,
    busy: false,
    statusMsg: "",
    statusType: "info" // "info" | "success" | "error"
  };

  // Estado da tela "Importar Provas"
  const IMP = {
    examText: "",
    gabaritoText: "",
    banca: "",
    year: new Date().getFullYear(),
    orgao: "",
    filterByEdital: true,
    busy: false,
    progressMsg: "",
    progressPct: 0,
    lastExtractedCount: 0
  };

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureModalRoot() {
    let el = document.getElementById("estuda-wizard-overlay");
    if (!el) {
      el = document.createElement("div");
      el.id = "estuda-wizard-overlay";
      el.className = "wizard-overlay";
      document.body.appendChild(el);
    }
    return el;
  }

  function closeWizard() {
    WIZ.open = false;
    const el = document.getElementById("estuda-wizard-overlay");
    if (el) el.remove();
    if (window.TracksManager) window.TracksManager.markOnboardingCompleted();
  }

  function openWizard(startStep) {
    WIZ.open = true;
    WIZ.step = startStep || (window.AI_TUTOR && window.AI_TUTOR.isConfigured() ? 2 : 1);
    WIZ.statusMsg = "";
    WIZ.busy = false;
    renderWizard();
  }

  function setWizStatus(msg, type) {
    WIZ.statusMsg = msg || "";
    WIZ.statusType = type || "info";
    const box = document.getElementById("wiz-status-box");
    if (box) {
      box.style.display = msg ? "block" : "none";
      box.className = `wiz-status wiz-status-${WIZ.statusType}`;
      box.textContent = msg;
    }
  }

  function computeAutoPacksForDraft() {
    if (!WIZ.draftEdital || !window.SHARED_BANK) return;
    const matches = window.SHARED_BANK.matchPacksToEdital(WIZ.draftEdital);
    WIZ.selectedPacks = matches.map(m => m.packId);
    WIZ.packMapping = {};
    matches.forEach(m => {
      WIZ.packMapping[m.packId] = m.targetSubjectId;
    });
  }

  function renderStepIndicator() {
    const steps = [
      { n: 1, label: "1. Chave IA" },
      { n: 2, label: "2. Seu Edital" },
      { n: 3, label: "3. Questões" },
      { n: 4, label: "4. Estudar" }
    ];
    return `
      <div class="wiz-steps">
        ${steps.map(s => `
          <div class="wiz-step ${WIZ.step === s.n ? "active" : (WIZ.step > s.n ? "done" : "")}">
            <span class="wiz-step-dot">${WIZ.step > s.n ? "✓" : s.n}</span>
            <span class="wiz-step-label">${s.label}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderStep1Html() {
    const cfg = window.AI_TUTOR ? window.AI_TUTOR.loadConfig() : { provider: "gemini", apiKey: "", model: "" };
    const isReady = !!(cfg.apiKey && cfg.model);

    return `
      <div class="wiz-body">
        <h3 class="wiz-title">Passo 1: Conecte sua chave gratuita de IA (opcional)</h3>
        <p class="wiz-desc">
          A plataforma tem <strong>custo zero de servidor</strong>: a IA roda direto do seu navegador usando sua própria chave (BYOK) para ler editais, extrair provas e gerar aulas cirúrgicas em cima dos seus erros.
        </p>

        <div class="wiz-guide-box">
          <strong>Como pegar sua chave gratuita do Google Gemini em 30 segundos:</strong>
          <ol>
            <li>Abra o <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio (aistudio.google.com/apikey)</a> e entre com sua conta Google.</li>
            <li>Clique em <strong>Create API key</strong> e copie a chave gerada.</li>
            <li>Cole abaixo e clique em <strong>Testar Chave</strong>. Ela fica salva apenas no seu navegador.</li>
          </ol>
        </div>

        <div class="filter-grid" style="margin-top:14px;">
          <div>
            <label class="field-label" for="wiz-ai-provider">Provedor de IA</label>
            <select id="wiz-ai-provider" class="form-control">
              <option value="gemini" ${cfg.provider === "gemini" ? "selected" : ""}>Google Gemini (Grátis)</option>
              <option value="openai" ${cfg.provider === "openai" ? "selected" : ""}>OpenAI (GPT)</option>
            </select>
          </div>
          <div style="grid-column: span 2;">
            <label class="field-label" for="wiz-ai-key">Sua API Key</label>
            <input type="password" id="wiz-ai-key" class="form-control" value="${esc(cfg.apiKey)}" placeholder="Cole sua chave aqui (ex: AIza...)" />
          </div>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; align-items:center;">
          <button class="btn btn-primary" onclick="window.OnboardingWizard.testAiKey()" ${WIZ.busy ? "disabled" : ""}>
            Testar Chave &amp; Carregar Modelos
          </button>
          ${isReady ? `<span class="status-badge status-mastered">Conectado: ${esc(cfg.model)}</span>` : ""}
        </div>

        <div id="wiz-status-box" class="wiz-status wiz-status-${WIZ.statusType}" style="display:${WIZ.statusMsg ? "block" : "none"}; margin-top:12px;">
          ${esc(WIZ.statusMsg)}
        </div>
      </div>

      <div class="wiz-footer">
        <button class="btn btn-outline" onclick="window.OnboardingWizard.goToStep(2)">
          ${isReady ? "Avançar →" : "Pular por agora (usar sem IA) →"}
        </button>
        ${isReady ? `<button class="btn btn-primary" onclick="window.OnboardingWizard.goToStep(2)">Continuar para o Edital →</button>` : ""}
      </div>
    `;
  }

  function renderStep2Html() {
    const builtins = window.TracksManager ? window.TracksManager.listTracks().filter(t => t.builtin) : [];
    const hasAi = window.AI_TUTOR && window.AI_TUTOR.isConfigured();

    let draftPreviewHtml = "";
    if (WIZ.draftEdital && Array.isArray(WIZ.draftEdital.disciplinas)) {
      const m = WIZ.draftEdital.metadata || {};
      draftPreviewHtml = `
        <div class="wiz-preview-box">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
            <strong>Prévia do Edital Estruturado (${WIZ.draftEdital.disciplinas.length} disciplinas)</strong>
            <button class="btn btn-outline btn-sm" onclick="window.OnboardingWizard.addManualDiscipline()">+ Adicionar Disciplina</button>
          </div>
          <div class="filter-grid" style="margin-bottom:10px;">
            <div>
              <label class="field-label">Nome do Concurso</label>
              <input class="form-control" value="${esc(m.concurso || "")}" onchange="window.OnboardingWizard.updateDraftMeta('concurso', this.value)" />
            </div>
            <div>
              <label class="field-label">Cargo / Área</label>
              <input class="form-control" value="${esc(m.cargo || "")}" onchange="window.OnboardingWizard.updateDraftMeta('cargo', this.value)" />
            </div>
            <div>
              <label class="field-label">Banca</label>
              <input class="form-control" value="${esc(m.banca || "")}" onchange="window.OnboardingWizard.updateDraftMeta('banca', this.value)" />
            </div>
            <div>
              <label class="field-label">Data da Prova</label>
              <input type="date" class="form-control" value="${esc((m.provas && m.provas.dataProva) || "")}" onchange="window.OnboardingWizard.updateDraftMeta('dataProva', this.value)" />
            </div>
          </div>
          <div class="wiz-disc-list">
            ${WIZ.draftEdital.disciplinas.map((d, i) => `
              <div class="wiz-disc-item">
                <div>
                  <strong>${esc(d.nome)}</strong>
                  <span class="badge-mini">${d.categoria === "especificos" ? "Específicos" : "Básicos"}</span>
                  <span style="font-size:0.78rem; color:var(--text-muted);">${(d.topicos || []).length} tópico(s) • Peso ${d.peso || 1}</span>
                </div>
                <button class="btn btn-outline btn-sm" style="color:var(--danger-text);" onclick="window.OnboardingWizard.removeDraftDiscipline(${i})">Remover</button>
              </div>
            `).join("")}
          </div>
        </div>
      `;
    }

    return `
      <div class="wiz-body">
        <h3 class="wiz-title">Passo 2: Escolha uma Trilha Pronta ou crie a partir do seu Edital</h3>
        <div class="wiz-mode-tabs">
          <button class="btn ${WIZ.mode === "custom" ? "btn-primary" : "btn-outline"} btn-sm" onclick="window.OnboardingWizard.setMode('custom')">
            Subir / Colar Meu Edital
          </button>
          <button class="btn ${WIZ.mode === "preset" ? "btn-primary" : "btn-outline"} btn-sm" onclick="window.OnboardingWizard.setMode('preset')">
            Escolher Trilha Pronta
          </button>
        </div>

        ${WIZ.mode === "preset" ? `
          <div class="wiz-preset-grid" style="margin-top:14px;">
            ${builtins.map(t => {
              const qCount = window.TracksManager.getQuestionsForTrack(t.id).length;
              const selected = WIZ.selectedPresetId === t.id;
              return `
                <div class="wiz-preset-card ${selected ? "selected" : ""}" onclick="window.OnboardingWizard.selectPreset('${esc(t.id)}')">
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <strong>${esc(t.shortName)}</strong>
                    <span class="status-badge status-mastered">${qCount} questões reais</span>
                  </div>
                  <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${esc(t.subtitle)}</div>
                  <p style="font-size:0.83rem; color:var(--text-secondary); margin-top:8px;">${esc(t.description)}</p>
                </div>
              `;
            }).join("")}
          </div>
        ` : `
          <div style="margin-top:14px;">
            <div class="filter-grid" style="margin-bottom:10px;">
              <div>
                <label class="field-label">Concurso (opcional)</label>
                <input id="wiz-meta-concurso" class="form-control" value="${esc(WIZ.metaConcurso)}" placeholder="Ex: TSE Unificado, Receita, PM-DF" onchange="window.OnboardingWizard.setField('metaConcurso', this.value)" />
              </div>
              <div>
                <label class="field-label">Cargo / Área (ajuda a IA filtrar)</label>
                <input id="wiz-meta-cargo" class="form-control" value="${esc(WIZ.metaCargo)}" placeholder="Ex: Analista Administrativo" onchange="window.OnboardingWizard.setField('metaCargo', this.value)" />
              </div>
              <div>
                <label class="field-label">Banca (opcional)</label>
                <input id="wiz-meta-banca" class="form-control" value="${esc(WIZ.metaBanca)}" placeholder="Ex: CEBRASPE, FGV, FCC" onchange="window.OnboardingWizard.setField('metaBanca', this.value)" />
              </div>
              <div>
                <label class="field-label">Data da Prova (opcional)</label>
                <input type="date" id="wiz-meta-data" class="form-control" value="${esc(WIZ.metaDataProva)}" onchange="window.OnboardingWizard.setField('metaDataProva', this.value)" />
              </div>
            </div>

            <div class="wiz-upload-row">
              <div style="flex:1; min-width:220px;">
                <label class="field-label">1. Subir PDF do Edital (leitura 100% no navegador)</label>
                <input type="file" id="wiz-edital-pdf" accept=".pdf" class="form-control" onchange="window.OnboardingWizard.onEditalPdfSelected(event)" />
                ${WIZ.pdfPages ? `<div style="font-size:0.78rem; color:var(--success-text); margin-top:4px;">PDF carregado: ${esc(WIZ.pdfFileName)} (${WIZ.pdfPages.length} páginas)</div>` : ""}
              </div>
              <div style="width:200px;">
                <label class="field-label">Páginas (opcional)</label>
                <input id="wiz-page-range" class="form-control" value="${esc(WIZ.pageRange)}" placeholder="Ex: 18-26 (auto se vazio)" onchange="window.OnboardingWizard.setField('pageRange', this.value)" />
              </div>
            </div>

            <div style="margin-top:10px;">
              <label class="field-label">2. Ou cole o Conteúdo Programático em texto</label>
              <textarea id="wiz-edital-text" class="form-control" rows="5" placeholder="Ex:\nLÍNGUA PORTUGUESA:\n1 Compreensão e interpretação de textos.\n2 Ortografia oficial...\n\nNOÇÕES DE INFORMÁTICA:\n1 Sistemas operacionais..." oninput="window.OnboardingWizard.setField('rawEditalText', this.value)">${esc(WIZ.rawEditalText)}</textarea>
            </div>

            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
              <button class="btn btn-primary" onclick="window.OnboardingWizard.parseEdital(true)" ${WIZ.busy ? "disabled" : ""}>
                ${hasAi ? "Estruturar Edital com IA" : "Estruturar com IA (requer chave)"}
              </button>
              <button class="btn btn-outline" onclick="window.OnboardingWizard.parseEdital(false)" ${WIZ.busy ? "disabled" : ""}>
                Estruturar Rápido (sem IA / local)
              </button>
            </div>

            ${draftPreviewHtml}
          </div>
        `}

        <div id="wiz-status-box" class="wiz-status wiz-status-${WIZ.statusType}" style="display:${WIZ.statusMsg ? "block" : "none"}; margin-top:12px;">
          ${esc(WIZ.statusMsg)}
        </div>
      </div>

      <div class="wiz-footer">
        <button class="btn btn-outline" onclick="window.OnboardingWizard.goToStep(1)">← Voltar</button>
        ${WIZ.mode === "preset"
          ? `<button class="btn btn-primary" onclick="window.OnboardingWizard.activateSelectedPreset()">Usar Trilha Pronta →</button>`
          : `<button class="btn btn-primary" onclick="window.OnboardingWizard.goToStep(3)" ${WIZ.draftEdital ? "" : "disabled"}>Avançar para Questões →</button>`
        }
      </div>
    `;
  }

  function renderStep3Html() {
    const packs = window.SHARED_BANK ? window.SHARED_BANK.listPacks() : [];
    const autoMatches = (WIZ.draftEdital && window.SHARED_BANK)
      ? window.SHARED_BANK.matchPacksToEdital(WIZ.draftEdital)
      : [];
    const matchByPack = new Map(autoMatches.map(m => [m.packId, m]));
    const disciplinas = (WIZ.draftEdital && WIZ.draftEdital.disciplinas) || [];

    const totalSharedSelected = packs
      .filter(p => WIZ.selectedPacks.includes(p.id))
      .reduce((acc, p) => acc + p.questionCount, 0);

    return `
      <div class="wiz-body">
        <h3 class="wiz-title">Passo 3: Reaproveite Questões Reais da Base Compartilhada</h3>
        <p class="wiz-desc">
          Já selecionamos automaticamente os pacotes da nossa base validada (805 questões reais) que combinam com o seu edital. Você pode ajustar quais ativar e em qual disciplina do seu edital cada pacote entra.
        </p>

        <div class="wiz-pack-list">
          ${packs.map(p => {
            const checked = WIZ.selectedPacks.includes(p.id);
            const match = matchByPack.get(p.id);
            const currentTarget = WIZ.packMapping[p.id] || (match ? match.targetSubjectId : (disciplinas[0] ? disciplinas[0].id : ""));
            return `
              <div class="wiz-pack-item ${checked ? "selected" : ""}">
                <label class="wiz-pack-check">
                  <input type="checkbox" ${checked ? "checked" : ""} onchange="window.OnboardingWizard.togglePack('${esc(p.id)}', this.checked)" />
                  <div>
                    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                      <strong>${esc(p.nome)}</strong>
                      <span class="badge-mini">${p.questionCount} questões reais</span>
                      ${match ? `<span class="status-badge status-mastered">Combina com seu edital</span>` : ""}
                    </div>
                    <div style="font-size:0.79rem; color:var(--text-muted); margin-top:2px;">${esc(p.descricao)}</div>
                  </div>
                </label>
                ${checked && disciplinas.length ? `
                  <div style="margin-top:8px; padding-left:26px;">
                    <label class="field-label" style="font-size:0.75rem;">Vincular à disciplina do seu edital:</label>
                    <select class="form-control" style="max-width:340px;" onchange="window.OnboardingWizard.setPackTarget('${esc(p.id)}', this.value)">
                      ${disciplinas.map(d => `<option value="${esc(d.id)}" ${currentTarget === d.id ? "selected" : ""}>${esc(d.nome)}</option>`).join("")}
                    </select>
                  </div>
                ` : ""}
              </div>
            `;
          }).join("")}
        </div>

        <div style="margin-top:12px; font-size:0.84rem; color:var(--text-secondary);">
          Total selecionado da Base Comum: <strong>${totalSharedSelected} questões reais</strong>.
          Para disciplinas específicas do seu concurso, você poderá subir PDFs de provas + gabaritos ou JSON logo no menu <strong>Importar Provas</strong>.
        </div>
      </div>

      <div class="wiz-footer">
        <button class="btn btn-outline" onclick="window.OnboardingWizard.goToStep(2)">← Voltar</button>
        <button class="btn btn-primary" onclick="window.OnboardingWizard.finishCustomTrack()">Criar Minha Trilha →</button>
      </div>
    `;
  }

  function renderStep4Html() {
    const track = window.TracksManager ? window.TracksManager.getActiveTrack() : null;
    const qCount = track ? window.TracksManager.getQuestionsForTrack(track.id).length : 0;
    const dCount = track && track.edital && track.edital.disciplinas ? track.edital.disciplinas.length : 0;

    return `
      <div class="wiz-body" style="text-align:center; padding:12px 6px;">
        <div class="wiz-success-icon">✓</div>
        <h3 class="wiz-title" style="margin-top:10px;">Trilha pronta para estudar!</h3>
        <p class="wiz-desc" style="max-width:520px; margin:8px auto 18px;">
          <strong>${esc(track ? track.shortName : "Seu Concurso")}</strong> está configurado com
          <strong>${dCount} disciplina(s)</strong> e <strong>${qCount} questão(ões) real(is)</strong> prontas para praticar.
        </p>

        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="window.OnboardingWizard.closeAndGo('diagnostic')">
            Começar a Resolver Questões
          </button>
          <button class="btn btn-outline" onclick="window.OnboardingWizard.closeAndGo('import')">
            Subir PDF de Prova / Gabarito
          </button>
          <button class="btn btn-outline" onclick="window.OnboardingWizard.closeAndGo('dashboard')">
            Ir para o Painel Inicial
          </button>
        </div>
      </div>
    `;
  }

  function renderWizard() {
    if (!WIZ.open) return;
    const root = ensureModalRoot();
    let stepHtml = "";
    if (WIZ.step === 1) stepHtml = renderStep1Html();
    else if (WIZ.step === 2) stepHtml = renderStep2Html();
    else if (WIZ.step === 3) stepHtml = renderStep3Html();
    else stepHtml = renderStep4Html();

    root.innerHTML = `
      <div class="wizard-modal" role="dialog" aria-modal="true" aria-label="Assistente de Configuração de Concurso">
        <div class="wiz-header">
          <div>
            <strong style="font-size:1.05rem;">Assistente Estuda Edital</strong>
            <div style="font-size:0.78rem; color:var(--text-muted);">Configure qualquer concurso em minutos</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.OnboardingWizard.close()">Fechar</button>
        </div>
        ${renderStepIndicator()}
        ${stepHtml}
      </div>
    `;
  }

  // ============================================================================
  // VIEW DEDICADA: IMPORTAR PROVAS, GABARITOS E GERENCIAR BASE COMUM
  // ============================================================================
  function renderImportView() {
    const container = document.getElementById("import-content");
    if (!container || !window.TracksManager) return;

    const track = window.TracksManager.getActiveTrack();
    const isCustom = !track.builtin;
    const packs = window.SHARED_BANK ? window.SHARED_BANK.listPacks() : [];
    const disciplinas = (track.edital && track.edital.disciplinas) || [];
    const hasAi = window.AI_TUTOR && window.AI_TUTOR.isConfigured();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Importar Provas, Gabaritos &amp; Base Comum</h2>
          <p>Trilha ativa: <strong>${esc(track.shortName)}</strong> • Adicione questões reais da sua banca por PDF, texto ou JSON.</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="window.OnboardingWizard.open(2)">+ Novo Concurso (Wizard)</button>
          <button class="btn btn-outline btn-sm" onclick="triggerImportQuestionsJson()">Importar Questões (.json)</button>
        </div>
      </div>

      ${!hasAi ? `
        <div class="card" style="border-color:var(--warning-border, #f59e0b); margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
            <div>
              <strong>Chave de IA não configurada</strong>
              <div style="font-size:0.84rem; color:var(--text-secondary); margin-top:2px;">
                Para extrair e comentar questões automaticamente de PDFs de provas, conecte sua chave gratuita do Google Gemini.
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.OnboardingWizard.open(1)">Configurar Chave IA Grátis</button>
          </div>
        </div>
      ` : ""}

      <div class="card" style="margin-bottom:16px;">
        <h3 style="margin-bottom:6px; font-size:1rem;">1. Extrair Questões de PDF de Prova + Gabarito (com IA)</h3>
        <p style="font-size:0.84rem; color:var(--text-secondary); margin-bottom:12px;">
          O PDF é lido 100% no seu navegador (via <code>pdf.js</code>) e processado em lotes pequenos (5–6 questões por vez) para não estourar tokens. As questões são filtradas pelo seu edital e já entram comentadas.
        </p>

        <div class="filter-grid" style="margin-bottom:12px;">
          <div>
            <label class="field-label">Banca da Prova</label>
            <input class="form-control" value="${esc(IMP.banca || (track.edital.metadata && track.edital.metadata.banca) || "")}" oninput="window.OnboardingWizard.setImpField('banca', this.value)" placeholder="Ex: FGV, CEBRASPE, FCC" />
          </div>
          <div>
            <label class="field-label">Ano</label>
            <input type="number" class="form-control" value="${esc(IMP.year)}" oninput="window.OnboardingWizard.setImpField('year', this.value)" />
          </div>
          <div>
            <label class="field-label">Órgão / Prova</label>
            <input class="form-control" value="${esc(IMP.orgao)}" oninput="window.OnboardingWizard.setImpField('orgao', this.value)" placeholder="Ex: TJ-SP, TRF-1, Petrobras" />
          </div>
        </div>

        <div class="filter-grid" style="margin-bottom:12px;">
          <div>
            <label class="field-label">Subir PDF da Prova</label>
            <input type="file" accept=".pdf" class="form-control" onchange="window.OnboardingWizard.onExamPdfSelected(event, 'exam')" />
          </div>
          <div>
            <label class="field-label">Subir PDF do Gabarito (opcional)</label>
            <input type="file" accept=".pdf" class="form-control" onchange="window.OnboardingWizard.onExamPdfSelected(event, 'gabarito')" />
          </div>
        </div>

        <div class="filter-grid" style="margin-bottom:12px;">
          <div>
            <label class="field-label">Texto da Prova (preenchido pelo PDF ou cole aqui)</label>
            <textarea id="imp-exam-text" class="form-control" rows="6" placeholder="Cole as questões da prova aqui ou suba o PDF acima..." oninput="window.OnboardingWizard.setImpField('examText', this.value)">${esc(IMP.examText)}</textarea>
          </div>
          <div>
            <label class="field-label">Texto do Gabarito Oficial (opcional)</label>
            <textarea id="imp-gab-text" class="form-control" rows="6" placeholder="Ex: 1-C, 2-A, 3-E, 4-B..." oninput="window.OnboardingWizard.setImpField('gabaritoText', this.value)">${esc(IMP.gabaritoText)}</textarea>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
          <label style="display:flex; align-items:center; gap:8px; font-size:0.84rem; cursor:pointer;">
            <input type="checkbox" ${IMP.filterByEdital ? "checked" : ""} onchange="window.OnboardingWizard.setImpField('filterByEdital', this.checked)" />
            Filtrar automaticamente apenas questões que caem no meu edital
          </label>
          <button class="btn btn-primary" onclick="window.OnboardingWizard.runExamExtraction()" ${IMP.busy ? "disabled" : ""}>
            ${IMP.busy ? "Processando..." : "Extrair &amp; Adicionar Questões à Trilha"}
          </button>
        </div>

        ${IMP.progressMsg ? `
          <div style="margin-top:12px;">
            <div style="font-size:0.83rem; color:var(--text-secondary); margin-bottom:4px;">${esc(IMP.progressMsg)}</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${IMP.progressPct}%;"></div></div>
          </div>
        ` : ""}
      </div>

      ${isCustom ? `
        <div class="card">
          <h3 style="margin-bottom:6px; font-size:1rem;">2. Pacotes da Base Compartilhada nesta Trilha</h3>
          <p style="font-size:0.84rem; color:var(--text-secondary); margin-bottom:12px;">
            Ative ou desative pacotes de questões reais universais (Português, Informática, LAI/LGPD, Lei 14.133 etc.) na trilha <strong>${esc(track.shortName)}</strong>.
          </p>
          <div class="wiz-pack-list">
            ${packs.map(p => {
              const checked = (track.enabledSharedPacks || []).includes(p.id);
              const target = (track.packMapping && track.packMapping[p.id]) || (disciplinas[0] ? disciplinas[0].id : "");
              return `
                <div class="wiz-pack-item ${checked ? "selected" : ""}">
                  <label class="wiz-pack-check">
                    <input type="checkbox" ${checked ? "checked" : ""} onchange="window.OnboardingWizard.toggleActiveTrackPack('${esc(p.id)}', this.checked)" />
                    <div>
                      <strong>${esc(p.nome)}</strong> <span class="badge-mini">${p.questionCount}q</span>
                      <div style="font-size:0.78rem; color:var(--text-muted);">${esc(p.descricao)}</div>
                    </div>
                  </label>
                  ${checked && disciplinas.length ? `
                    <div style="margin-top:6px; padding-left:26px;">
                      <select class="form-control" style="max-width:320px;" onchange="window.OnboardingWizard.setActiveTrackPackTarget('${esc(p.id)}', this.value)">
                        ${disciplinas.map(d => `<option value="${esc(d.id)}" ${target === d.id ? "selected" : ""}>${esc(d.nome)}</option>`).join("")}
                      </select>
                    </div>
                  ` : ""}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      ` : `
        <div class="card">
          <h3 style="margin-bottom:6px; font-size:1rem;">2. Trilha Pronta Ativa</h3>
          <p style="font-size:0.84rem; color:var(--text-secondary);">
            Você está usando a trilha pronta <strong>${esc(track.shortName)}</strong>. Todas as questões que você importar acima serão adicionadas a ela. Se quiser personalizar disciplinas do seu próprio edital, clique em <strong>+ Novo Concurso (Wizard)</strong>.
          </p>
        </div>
      `}
    `;
  }

  window.OnboardingWizard = {
    open: openWizard,
    close: closeWizard,
    renderImportView,

    goToStep(n) {
      WIZ.step = n;
      WIZ.statusMsg = "";
      if (n === 3 && WIZ.draftEdital && !WIZ.selectedPacks.length) {
        computeAutoPacksForDraft();
      }
      renderWizard();
    },

    setMode(mode) {
      WIZ.mode = mode;
      WIZ.statusMsg = "";
      renderWizard();
    },

    selectPreset(id) {
      WIZ.selectedPresetId = id;
      renderWizard();
    },

    setField(key, val) {
      WIZ[key] = val;
    },

    setImpField(key, val) {
      IMP[key] = val;
    },

    async testAiKey() {
      const prov = document.getElementById("wiz-ai-provider")?.value || "gemini";
      const key = (document.getElementById("wiz-ai-key")?.value || "").trim();
      if (!key) {
        setWizStatus("Cole sua API Key primeiro.", "error");
        return;
      }
      WIZ.busy = true;
      setWizStatus("Testando chave e buscando modelos de texto disponíveis...", "info");
      try {
        const res = await window.AI_TUTOR.discoverModelsDirect(prov, key);
        WIZ.busy = false;
        WIZ.statusMsg = `Chave validada! ${res.models.length} modelos encontrados. Ativo: ${res.activeModel}`;
        WIZ.statusType = "success";
        renderWizard();
      } catch (err) {
        WIZ.busy = false;
        setWizStatus("Erro ao validar chave: " + err.message, "error");
      }
    },

    async onEditalPdfSelected(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      WIZ.busy = true;
      setWizStatus("Carregando leitor de PDF...", "info");
      try {
        const result = await window.PdfImporter.extractPdfPages(file, msg => setWizStatus(msg, "info"));
        WIZ.pdfPages = result.pages;
        WIZ.pdfFileName = result.fileName;
        WIZ.busy = false;
        WIZ.statusMsg = `PDF lido com sucesso (${result.numPages} páginas). Clique em "Estruturar Edital com IA" ou informe o intervalo de páginas do conteúdo programático.`;
        WIZ.statusType = "success";
        renderWizard();
      } catch (err) {
        WIZ.busy = false;
        setWizStatus("Erro ao ler PDF: " + err.message, "error");
      }
    },

    async parseEdital(useAi) {
      let text = (WIZ.rawEditalText || "").trim();
      if (!text && WIZ.pdfPages) {
        text = window.PdfImporter.smartFilterEditalPages(WIZ.pdfPages, WIZ.pageRange);
      }
      if (!text) {
        setWizStatus("Suba o PDF do edital ou cole o conteúdo programático antes de continuar.", "error");
        return;
      }

      const hints = {
        concurso: WIZ.metaConcurso,
        cargo: WIZ.metaCargo,
        banca: WIZ.metaBanca,
        dataProva: WIZ.metaDataProva
      };

      WIZ.busy = true;
      setWizStatus(useAi ? "Estruturando edital com IA..." : "Estruturando edital localmente...", "info");
      try {
        const edital = useAi
          ? await window.PdfImporter.structureEditalWithAi(text, hints, msg => setWizStatus(msg, "info"))
          : window.PdfImporter.structureEditalHeuristic(text, hints);

        WIZ.draftEdital = edital;
        computeAutoPacksForDraft();
        WIZ.busy = false;
        WIZ.statusMsg = `Edital estruturado com ${edital.disciplinas.length} disciplina(s)! Revise abaixo e clique em Avançar.`;
        WIZ.statusType = "success";
        renderWizard();
      } catch (err) {
        WIZ.busy = false;
        setWizStatus("Erro: " + err.message, "error");
      }
    },

    updateDraftMeta(field, val) {
      if (!WIZ.draftEdital) return;
      if (field === "dataProva") {
        WIZ.draftEdital.metadata.provas = WIZ.draftEdital.metadata.provas || {};
        WIZ.draftEdital.metadata.provas.dataProva = val;
      } else {
        WIZ.draftEdital.metadata[field] = val;
      }
    },

    removeDraftDiscipline(idx) {
      if (!WIZ.draftEdital || !Array.isArray(WIZ.draftEdital.disciplinas)) return;
      WIZ.draftEdital.disciplinas.splice(idx, 1);
      computeAutoPacksForDraft();
      renderWizard();
    },

    addManualDiscipline() {
      const nome = prompt("Nome da disciplina (ex: Direito Constitucional):");
      if (!nome || !nome.trim()) return;
      const isEsp = confirm("Esta disciplina é de Conhecimentos Específicos? (OK = Específicos, Cancelar = Básicos)");
      if (!WIZ.draftEdital) {
        WIZ.draftEdital = window.TracksManager.normalizeEdital({ metadata: { concurso: WIZ.metaConcurso || "Meu Concurso" }, disciplinas: [] });
      }
      const id = `${isEsp ? "esp" : "bas"}_man_${Date.now()}`;
      WIZ.draftEdital.disciplinas.push({
        id,
        codigo: `${isEsp ? "ESP" : "BAS"}-${WIZ.draftEdital.disciplinas.length + 1}`,
        nome: nome.trim(),
        categoria: isEsp ? "especificos" : "basicos",
        questoesProva: 10,
        peso: isEsp ? 2 : 1,
        pontosProva: isEsp ? 20 : 10,
        prioridade: isEsp ? "Alta" : "Média",
        cor: window.TracksManager.DISCIPLINE_COLORS[WIZ.draftEdital.disciplinas.length % window.TracksManager.DISCIPLINE_COLORS.length],
        descricao: "",
        topicos: [{ id: `${id}_t1`, numero: "1", titulo: "Conteúdo Geral", subitens: "", resumoChave: "" }]
      });
      computeAutoPacksForDraft();
      renderWizard();
    },

    togglePack(packId, checked) {
      if (checked) {
        if (!WIZ.selectedPacks.includes(packId)) WIZ.selectedPacks.push(packId);
        if (!WIZ.packMapping[packId] && WIZ.draftEdital && WIZ.draftEdital.disciplinas[0]) {
          WIZ.packMapping[packId] = WIZ.draftEdital.disciplinas[0].id;
        }
      } else {
        WIZ.selectedPacks = WIZ.selectedPacks.filter(id => id !== packId);
      }
      renderWizard();
    },

    setPackTarget(packId, subjectId) {
      WIZ.packMapping[packId] = subjectId;
    },

    activateSelectedPreset() {
      if (typeof window.switchTrack === "function") {
        window.switchTrack(WIZ.selectedPresetId);
      } else if (window.TracksManager) {
        window.TracksManager.setActiveTrack(WIZ.selectedPresetId);
      }
      window.TracksManager.markOnboardingCompleted();
      WIZ.step = 4;
      renderWizard();
    },

    finishCustomTrack() {
      if (!WIZ.draftEdital) return;
      const created = window.TracksManager.saveCustomTrack({
        edital: WIZ.draftEdital,
        enabledSharedPacks: WIZ.selectedPacks.slice(),
        packMapping: Object.assign({}, WIZ.packMapping)
      });
      WIZ.createdTrackId = created.id;
      if (typeof window.switchTrack === "function") {
        window.switchTrack(created.id);
      }
      WIZ.step = 4;
      renderWizard();
    },

    closeAndGo(viewId) {
      closeWizard();
      if (typeof window.switchView === "function") {
        window.switchView(viewId || "dashboard");
      }
    },

    async onExamPdfSelected(event, target) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      IMP.busy = true;
      IMP.progressMsg = `Lendo PDF (${file.name})...`;
      IMP.progressPct = 15;
      renderImportView();
      try {
        const res = await window.PdfImporter.extractPdfPages(file, (msg, pct) => {
          IMP.progressMsg = msg;
          IMP.progressPct = pct;
          renderImportView();
        });
        if (target === "gabarito") {
          IMP.gabaritoText = res.fullText;
        } else {
          IMP.examText = res.fullText;
        }
        IMP.busy = false;
        IMP.progressMsg = `PDF lido (${res.numPages} páginas). Pronto para extrair!`;
        IMP.progressPct = 100;
        renderImportView();
      } catch (err) {
        IMP.busy = false;
        IMP.progressMsg = "Erro ao ler PDF: " + err.message;
        IMP.progressPct = 0;
        renderImportView();
      }
    },

    async runExamExtraction() {
      const text = (IMP.examText || "").trim();
      if (!text) {
        IMP.progressMsg = "Suba o PDF da prova ou cole o texto das questões primeiro.";
        renderImportView();
        return;
      }
      const track = window.TracksManager.getActiveTrack();
      IMP.busy = true;
      IMP.progressMsg = "Iniciando extração em lotes...";
      IMP.progressPct = 5;
      renderImportView();

      try {
        const extracted = await window.PdfImporter.extractQuestionsFromExamWithAi(
          text,
          IMP.gabaritoText,
          track.edital,
          {
            banca: IMP.banca || (track.edital.metadata && track.edital.metadata.banca),
            year: IMP.year,
            orgao: IMP.orgao || (track.edital.metadata && track.edital.metadata.concurso),
            filterByEdital: IMP.filterByEdital
          },
          (msg, pct) => {
            IMP.progressMsg = msg;
            IMP.progressPct = pct;
            renderImportView();
          }
        );

        IMP.busy = false;
        IMP.lastExtractedCount = extracted.length;
        if (!extracted.length) {
          IMP.progressMsg = "Nenhuma questão válida compatível com o edital foi encontrada neste texto.";
          renderImportView();
          return;
        }

        if (typeof window.appendCustomQuestions === "function") {
          window.appendCustomQuestions(extracted);
        }
        IMP.examText = "";
        IMP.gabaritoText = "";
        IMP.progressMsg = `Sucesso! ${extracted.length} questão(ões) adicionada(s) à trilha ${track.shortName}.`;
        IMP.progressPct = 100;
        renderImportView();
      } catch (err) {
        IMP.busy = false;
        IMP.progressMsg = "Erro na extração: " + err.message;
        IMP.progressPct = 0;
        renderImportView();
      }
    },

    toggleActiveTrackPack(packId, checked) {
      const track = window.TracksManager.getActiveTrack();
      if (track.builtin) return;
      const enabled = (track.enabledSharedPacks || []).slice();
      const mapping = Object.assign({}, track.packMapping || {});
      if (checked) {
        if (!enabled.includes(packId)) enabled.push(packId);
        if (!mapping[packId] && track.edital.disciplinas[0]) {
          mapping[packId] = track.edital.disciplinas[0].id;
        }
      } else {
        const idx = enabled.indexOf(packId);
        if (idx !== -1) enabled.splice(idx, 1);
      }
      window.TracksManager.updateTrackSharedPacks(track.id, enabled, mapping);
      if (typeof window.reloadActiveTrack === "function") window.reloadActiveTrack();
      renderImportView();
    },

    setActiveTrackPackTarget(packId, subjectId) {
      const track = window.TracksManager.getActiveTrack();
      if (track.builtin) return;
      const mapping = Object.assign({}, track.packMapping || {});
      mapping[packId] = subjectId;
      window.TracksManager.updateTrackSharedPacks(track.id, track.enabledSharedPacks || [], mapping);
      if (typeof window.reloadActiveTrack === "function") window.reloadActiveTrack();
    }
  };
})();
