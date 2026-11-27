// ============================================================================
// TUTOR IA AO VIVO (BYOK — Bring Your Own Key)
// Suporta Google Gemini/Gemma e OpenAI direto do navegador, com busca paginada
// de modelos de texto, barra compacta retrátil e renderização segura de Markdown.
// ============================================================================

(function () {
  const AI_CONFIG_KEY = "ESTUDA_EDITAL_AI_CONFIG_V1";
  const LEGACY_AI_CONFIG_KEY = "DPDF_TI_AI_CONFIG_V1";

  const DEFAULT_GEMINI_MODEL = "gemini-4-hydrogen";

  function loadAiConfig() {
    try {
      const raw = localStorage.getItem(AI_CONFIG_KEY) || localStorage.getItem(LEGACY_AI_CONFIG_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const cfg = Object.assign(
        {
          provider: "gemini", // "gemini" | "openai"
          apiKey: "",
          model: DEFAULT_GEMINI_MODEL,
          models: [] // [{ id, label }]
        },
        parsed
      );
      if (cfg.provider === "gemini") {
        if (Array.isArray(cfg.models)) {
          cfg.models = cfg.models.filter(m => m && m.id && !/-latest$/i.test(m.id));
        }
        if (!cfg.model || /-latest$/i.test(cfg.model)) {
          cfg.model = DEFAULT_GEMINI_MODEL;
        }
      }
      return cfg;
    } catch (e) {
      return { provider: "gemini", apiKey: "", model: DEFAULT_GEMINI_MODEL, models: [] };
    }
  }

  function saveAiConfig(cfg) {
    try {
      localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(cfg));
    } catch (e) {
      console.error("Erro ao salvar configuração de IA:", e);
    }
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Renderizador seguro de Markdown -> HTML (suporta títulos, listas, código e tabelas)
  function renderMarkdownSafe(md) {
    const codeBlocks = [];
    let text = String(md || "").replace(/\r\n/g, "\n");

    text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function (_, lang, code) {
      const idx = codeBlocks.length;
      codeBlocks.push(
        '<pre style="background:var(--bg-elevated);border:1px solid var(--border-color);border-radius:8px;padding:12px;overflow-x:auto;margin:10px 0;font-size:0.83rem;"><code>' +
          escapeHtml(code.trimEnd()) +
          "</code></pre>"
      );
      return `@@CODEBLOCK_${idx}@@`;
    });

    const lines = escapeHtml(text).split("\n");
    const html = [];
    let inUl = false;
    let inOl = false;
    let tableRows = [];

    function formatInline(s) {
      return s
        .replace(/`([^`]+)`/g, '<code style="background:var(--bg-elevated);padding:2px 5px;border-radius:4px;font-size:0.85em;">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    }

    function flushTable() {
      if (!tableRows.length) return;
      if (tableRows.length >= 2) {
        const parseRow = r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
        const headers = parseRow(tableRows[0]);
        const isSep = /^[\s|:-]+$/.test(tableRows[1]);
        const bodyStart = isSep ? 2 : 1;
        let t = '<div class="lesson-table-wrapper"><table class="lesson-table"><thead><tr>';
        headers.forEach(h => { t += "<th>" + formatInline(h) + "</th>"; });
        t += "</tr></thead><tbody>";
        for (let i = bodyStart; i < tableRows.length; i++) {
          const cols = parseRow(tableRows[i]);
          t += "<tr>" + cols.map(c => "<td>" + formatInline(c) + "</td>").join("") + "</tr>";
        }
        t += "</tbody></table></div>";
        html.push(t);
      } else {
        tableRows.forEach(r => html.push("<p>" + formatInline(r) + "</p>"));
      }
      tableRows = [];
    }

    function closeLists() {
      if (inUl) { html.push("</ul>"); inUl = false; }
      if (inOl) { html.push("</ol>"); inOl = false; }
      flushTable();
    }

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        closeLists();
        continue;
      }
      if (line.startsWith("|") && line.endsWith("|") && line.includes("|")) {
        if (inUl) { html.push("</ul>"); inUl = false; }
        if (inOl) { html.push("</ol>"); inOl = false; }
        tableRows.push(line);
        continue;
      }
      flushTable();

      const cbMatch = line.match(/^@@CODEBLOCK_(\d+)@@$/);
      if (cbMatch) {
        closeLists();
        html.push(codeBlocks[Number(cbMatch[1])]);
        continue;
      }
      if (line.startsWith("#### ")) {
        closeLists();
        html.push('<h5 style="color:var(--text-primary);margin:14px 0 6px;font-size:0.95rem;">' + formatInline(line.slice(5)) + "</h5>");
      } else if (line.startsWith("### ")) {
        closeLists();
        html.push('<h4 style="color:var(--accent-primary);margin:16px 0 8px;font-size:1.02rem;">' + formatInline(line.slice(4)) + "</h4>");
      } else if (line.startsWith("## ")) {
        closeLists();
        html.push('<h3 style="color:var(--text-primary);margin:18px 0 10px;border-bottom:1px solid var(--border-color);padding-bottom:6px;font-size:1.12rem;">' + formatInline(line.slice(3)) + "</h3>");
      } else if (line.startsWith("# ")) {
        closeLists();
        html.push('<h2 style="color:var(--accent-primary);margin:18px 0 10px;font-size:1.22rem;">' + formatInline(line.slice(2)) + "</h2>");
      } else if (/^[-*]\s+/.test(line)) {
        if (inOl) { html.push("</ol>"); inOl = false; }
        if (!inUl) { html.push('<ul class="lesson-list" style="margin:8px 0 10px 18px;">'); inUl = true; }
        html.push("<li>" + formatInline(line.replace(/^[-*]\s+/, "")) + "</li>");
      } else if (/^\d+\.\s+/.test(line)) {
        if (inUl) { html.push("</ul>"); inUl = false; }
        if (!inOl) { html.push('<ol style="margin:8px 0 10px 20px;">'); inOl = true; }
        html.push('<li style="margin-bottom:4px;">' + formatInline(line.replace(/^\d+\.\s+/, "")) + "</li>");
      } else if (/^---+$/.test(line)) {
        closeLists();
        html.push('<hr style="border:none;border-top:1px solid var(--border-color);margin:14px 0;" />');
      } else {
        closeLists();
        html.push('<p style="margin:8px 0;line-height:1.65;font-size:0.92rem;">' + formatInline(line) + "</p>");
      }
    }
    closeLists();
    return html.join("\n");
  }

  // Busca modelos disponíveis dinamicamente (com paginação completa na API Gemini)
  async function fetchAvailableModels(provider, apiKey) {
    const key = (apiKey || "").trim();
    if (!key) throw new Error("Informe sua API Key antes de buscar os modelos.");

    if (provider === "gemini") {
      let allModels = [];
      let pageToken = "";
      for (let page = 0; page < 4; page++) {
        const url =
          "https://generativelanguage.googleapis.com/v1beta/models?pageSize=100" +
          (pageToken ? "&pageToken=" + encodeURIComponent(pageToken) : "") +
          "&key=" + encodeURIComponent(key);
        const res = await fetch(url);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error((data.error && data.error.message) || `Erro HTTP ${res.status} ao listar modelos Gemini.`);
        }
        allModels = allModels.concat(data.models || []);
        if (!data.nextPageToken) break;
        pageToken = data.nextPageToken;
      }

      const NON_TEXT_RE = /(banana|image|imagen|veo|lyria|tts|audio|speech|video|robotics|computer-use|deep-research|embedding|aqa|live|realtime|transcribe|whisper|moderation|customtools|dialog|native-audio|omni)/i;

      function parseVersion(id) {
        const m = id.match(/^(?:gemini|gemma)-(\d+)(?:\.(\d+))?/i);
        if (!m) return null;
        return Number(m[1]) * 100 + (m[2] ? Number(m[2]) : 0);
      }

      function parseParamsB(id) {
        const m = id.match(/(\d+(?:\.\d+)?)b/i);
        return m ? Number(m[1]) : 0;
      }

      const rawTextModels = allModels
        .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"))
        .map(m => {
          const id = (m.name || "").replace(/^models\//, "");
          const display = m.displayName ? `${m.displayName} (${id})` : id;
          return { id, label: display };
        })
        .filter(m => /^(gemini|gemma)-/i.test(m.id))
        .filter(m => !NON_TEXT_RE.test(m.id) && !NON_TEXT_RE.test(m.label));

      const geminiVersions = rawTextModels
        .filter(m => /^gemini-/i.test(m.id))
        .map(m => parseVersion(m.id))
        .filter(v => v !== null);
      const maxGeminiMajor = geminiVersions.length ? Math.floor(Math.max(...geminiVersions) / 100) : 0;

      const gemmaVersions = rawTextModels
        .filter(m => /^gemma-/i.test(m.id))
        .map(m => parseVersion(m.id))
        .filter(v => v !== null);
      const maxGemmaMajor = gemmaVersions.length ? Math.floor(Math.max(...gemmaVersions) / 100) : 0;

      const list = rawTextModels
        .filter(m => {
          const id = m.id.toLowerCase();
          if (/-latest$/i.test(id)) return false;
          if (/^gemini-4-hydrogen/i.test(id)) return true;
          const v = parseVersion(id);
          if (v === null) return false;
          if (/^gemini-/i.test(id)) {
            if (maxGeminiMajor >= 4) return v >= maxGeminiMajor * 100 || v >= 308;
            return v >= maxGeminiMajor * 100 - 50;
          }
          if (/^gemma-/i.test(id)) {
            return Math.floor(v / 100) >= maxGemmaMajor;
          }
          return false;
        })
        .map(m => {
          const isDefault = m.id.toLowerCase() === DEFAULT_GEMINI_MODEL;
          return {
            id: m.id,
            label: isDefault ? `★ ${m.label}` : m.label
          };
        })
        .sort((a, b) => {
          const score = id => {
            const lower = id.toLowerCase();
            if (lower === DEFAULT_GEMINI_MODEL) return 10000;
            if (lower.startsWith("gemini-4-hydrogen")) return 9950;
            const v = parseVersion(lower) || 0;
            if (/^gemini-/i.test(lower)) {
              let s = 5000 + v;
              if (lower.includes("preview") || lower.includes("exp")) s -= 10;
              return s;
            }
            if (/^gemma-/i.test(lower)) {
              return 2000 + v + parseParamsB(lower);
            }
            return 0;
          };
          return score(b.id) - score(a.id) || a.id.localeCompare(b.id);
        });

      if (!list.length) {
        throw new Error("Nenhum modelo Gemini ou Gemma de geração de texto foi retornado para esta chave.");
      }
      return list;
    }

    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: "Bearer " + key }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data.error && data.error.message) || `Erro HTTP ${res.status} ao listar modelos OpenAI.`);
      }
      const list = (data.data || [])
        .map(m => m.id)
        .filter(id => /^(gpt-|o1|o3|o4|chatgpt-)/i.test(id) && !/audio|realtime|transcribe|tts|whisper|embedding|moderation|image/i.test(id))
        .sort((a, b) => b.localeCompare(a))
        .map(id => ({ id, label: id }));

      if (!list.length) {
        throw new Error("Nenhum modelo de chat OpenAI foi retornado para esta chave.");
      }
      return list;
    }

    throw new Error("Provedor não suportado: " + provider);
  }

  async function generateLessonWithAi(promptText, cfg, opts) {
    const options = opts || {};
    const key = (cfg.apiKey || "").trim();
    const model = (cfg.model || "").trim();
    if (!key) throw new Error("Configure sua API Key primeiro.");
    if (!model) throw new Error("Clique em 'Buscar Modelos' e selecione um modelo.");

    const temperature = typeof options.temperature === "number" ? options.temperature : 0.4;
    const maxOutputTokens = Number(options.maxOutputTokens) || 8192;

    if (cfg.provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
      const generationConfig = { temperature, maxOutputTokens };
      if (options.jsonMode) {
        generationConfig.responseMimeType = "application/json";
      }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          generationConfig
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data.error && data.error.message) || `Erro HTTP ${res.status} ao consultar o Gemini.`);
      }
      const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      const text = parts ? parts.map(p => p.text || "").join("\n").trim() : "";
      if (!text) throw new Error("O modelo retornou uma resposta vazia.");
      return text;
    }

    if (cfg.provider === "openai") {
      const payload = {
        model,
        messages: [{ role: "user", content: promptText }]
      };
      if (!/^o\d/i.test(model)) {
        payload.temperature = temperature;
      }
      if (options.jsonMode && !/^o\d/i.test(model)) {
        payload.response_format = { type: "json_object" };
      }
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data.error && data.error.message) || `Erro HTTP ${res.status} ao consultar a OpenAI.`);
      }
      const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!text) throw new Error("O modelo retornou uma resposta vazia.");
      return text.trim();
    }

    throw new Error("Provedor não suportado.");
  }

  function extractJsonFromText(rawText) {
    const cleaned = String(rawText || "")
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (_) {
      // Tenta localizar primeiro bloco JSON válido ({...} ou [...])
      const firstBrace = cleaned.indexOf("{");
      const firstBracket = cleaned.indexOf("[");
      let start = -1;
      let endChar = "}";
      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        start = firstBrace;
        endChar = "}";
      } else if (firstBracket !== -1) {
        start = firstBracket;
        endChar = "]";
      }
      if (start === -1) throw new Error("A resposta da IA não contém JSON válido.");
      const end = cleaned.lastIndexOf(endChar);
      if (end <= start) throw new Error("JSON retornado pela IA está incompleto.");
      const slice = cleaned.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");
      return JSON.parse(slice);
    }
  }

  function renderQuickModelSelectHtml(extraStyle) {
    const cfg = loadAiConfig();
    if (!cfg.apiKey) return "";
    const models = Array.isArray(cfg.models) ? cfg.models.slice() : [];
    if (cfg.model && !models.some(m => m.id === cfg.model)) {
      models.unshift({ id: cfg.model, label: cfg.model });
    }
    const opts = models.map(m =>
      `<option value="${escapeHtml(m.id)}" ${cfg.model === m.id ? "selected" : ""}>${escapeHtml(m.label || m.id)}</option>`
    ).join("");
    return `
      <select class="form-control ai-quick-model" style="width:auto; max-width:210px; padding:5px 10px; font-size:0.78rem; height:32px; ${extraStyle || ""}" aria-label="Selecionar modelo de IA" title="Trocar modelo de IA caso esteja sobrecarregado" onchange="window.AI_TUTOR.onQuickModelChange(this.value)">
        ${opts}
        <option value="__REFRESH__">↻ Atualizar lista de modelos...</option>
      </select>
    `;
  }

  // Renderiza barra enxuta: se já configurada, esconde os inputs num painel retrátil discreto!
  function renderAiConfigCardHtml(contextId, filterSubjectId, forceExpanded) {
    const cfg = loadAiConfig();
    const hasKey = !!cfg.apiKey;
    const isReady = hasKey && !!cfg.model;
    const openAttr = (!isReady || forceExpanded) ? "open" : "";

    const modelOptions = cfg.models && cfg.models.length
      ? cfg.models.map(m => `<option value="${escapeHtml(m.id)}" ${cfg.model === m.id ? "selected" : ""}>${escapeHtml(m.label)}</option>`).join("")
      : `<option value="">Insira a Key e clique em "Buscar Modelos"</option>`;

    return `
      <div class="card" id="ai-tutor-card-${contextId}" style="padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
          <div style="min-width:200px; flex:1;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <strong style="font-size:0.95rem;">Tutor IA Sob Medida</strong>
              ${!isReady ? `<span class="status-badge status-untested">Chave não configurada</span>` : ""}
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
              Gera uma aula focada apenas nas questões que você errou.
            </div>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            ${isReady ? renderQuickModelSelectHtml() : ""}
            <button class="btn btn-primary btn-sm" id="ai-gen-btn-${contextId}" onclick="window.AI_TUTOR.generateAndSaveLesson('${contextId}', '${filterSubjectId || "ALL"}')">
              Gerar Aula dos Meus Erros
            </button>
          </div>
        </div>

        <div id="ai-status-${contextId}" style="font-size:0.81rem; color:var(--text-secondary); margin-top:6px;"></div>

        <details ${openAttr} style="margin-top:10px; border-top:1px solid var(--border-color); padding-top:10px;">
          <summary style="cursor:pointer; font-size:0.8rem; color:var(--text-muted); font-weight:600; user-select:none;">
            Configurar API Key e Modelo (${cfg.models ? cfg.models.length : 0} disponíveis)
          </summary>
          <div class="filter-grid" style="margin-top:10px;">
            <div>
              <label class="field-label" for="ai-provider-${contextId}">Provedor</label>
              <select id="ai-provider-${contextId}" class="form-control" onchange="window.AI_TUTOR.onProviderChange('${contextId}', this.value)">
                <option value="gemini" ${cfg.provider === "gemini" ? "selected" : ""}>Google Gemini / Gemma</option>
                <option value="openai" ${cfg.provider === "openai" ? "selected" : ""}>OpenAI</option>
              </select>
            </div>
            <div>
              <label class="field-label" for="ai-key-${contextId}">API Key (salva só no navegador)</label>
              <input type="password" id="ai-key-${contextId}" class="form-control" value="${escapeHtml(cfg.apiKey)}" placeholder="Cole sua API Key..." onchange="window.AI_TUTOR.onKeyChange('${contextId}', this.value)" />
            </div>
            <div>
              <label class="field-label" for="ai-model-${contextId}">Modelo de Texto</label>
              <select id="ai-model-${contextId}" class="form-control" onchange="window.AI_TUTOR.onModelChange(this.value)">
                ${modelOptions}
              </select>
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">
            <button class="btn btn-outline btn-sm" onclick="window.AI_TUTOR.discoverModels('${contextId}')">Buscar Modelos</button>
            ${hasKey ? `<button class="btn btn-outline btn-sm" style="color:var(--danger-text);" onclick="window.AI_TUTOR.clearKey('${contextId}')">Remover Chave</button>` : ""}
          </div>
        </details>
      </div>
    `;
  }

  window.AI_TUTOR = {
    loadConfig: loadAiConfig,
    saveConfig: saveAiConfig,
    isConfigured() {
      const cfg = loadAiConfig();
      return !!(cfg.apiKey && cfg.apiKey.trim());
    },
    renderMarkdownSafe,
    renderConfigCard: renderAiConfigCardHtml,
    renderQuickModelSelect: renderQuickModelSelectHtml,
    extractJsonFromText,

    async onQuickModelChange(val) {
      if (val === "__REFRESH__") {
        const cfg = loadAiConfig();
        if (!cfg.apiKey) return;
        if (typeof window.showToast === "function") window.showToast("Buscando modelos disponíveis...", "info");
        try {
          const models = await fetchAvailableModels(cfg.provider, cfg.apiKey);
          cfg.models = models;
          if (!cfg.model || !models.some(m => m.id === cfg.model)) cfg.model = models[0].id;
          saveAiConfig(cfg);
          if (typeof window.showToast === "function") window.showToast(`${models.length} modelos carregados.`, "success");
          if (typeof window.refreshActiveView === "function") window.refreshActiveView();
        } catch (err) {
          if (typeof window.showToast === "function") window.showToast("Erro ao buscar modelos: " + (err && err.message ? err.message : String(err)), "error");
        }
        return;
      }
      this.onModelChange(val);
      if (typeof window.showToast === "function") window.showToast("Modelo alterado: " + val, "success");
    },

    async discoverModelsDirect(provider, apiKey) {
      const models = await fetchAvailableModels(provider, apiKey);
      const cfg = loadAiConfig();
      cfg.provider = provider;
      cfg.apiKey = (apiKey || "").trim();
      cfg.models = models;
      if (!cfg.model || !models.some(m => m.id === cfg.model)) {
        cfg.model = models[0].id;
      }
      saveAiConfig(cfg);
      return { models, activeModel: cfg.model };
    },

    async askRaw(promptText, opts) {
      const cfg = loadAiConfig();
      if (!cfg.apiKey) throw new Error("Configure sua API Key de IA primeiro (Google Gemini ou OpenAI).");
      if (!cfg.model) {
        const models = await fetchAvailableModels(cfg.provider, cfg.apiKey);
        cfg.models = models;
        cfg.model = models[0].id;
        saveAiConfig(cfg);
      }
      return generateLessonWithAi(promptText, cfg, opts);
    },

    async askJson(promptText, opts) {
      const raw = await this.askRaw(promptText, Object.assign({ temperature: 0.2, jsonMode: true }, opts || {}));
      return extractJsonFromText(raw);
    },

    onProviderChange(contextId, provider) {
      const cfg = loadAiConfig();
      cfg.provider = provider;
      cfg.models = [];
      cfg.model = "";
      saveAiConfig(cfg);
      const sel = document.getElementById("ai-model-" + contextId);
      if (sel) sel.innerHTML = '<option value="">Clique em "Buscar Modelos"</option>';
      const status = document.getElementById("ai-status-" + contextId);
      if (status) status.textContent = "Provedor alterado. Clique em Buscar Modelos.";
    },

    onKeyChange(contextId, value) {
      const cfg = loadAiConfig();
      cfg.apiKey = (value || "").trim();
      saveAiConfig(cfg);
    },

    onModelChange(modelId) {
      const cfg = loadAiConfig();
      cfg.model = modelId;
      saveAiConfig(cfg);
      if (typeof window.refreshActiveView === "function") window.refreshActiveView();
    },

    clearKey() {
      if (!confirm("Remover sua API Key salva neste navegador?")) return;
      saveAiConfig({ provider: "gemini", apiKey: "", model: "", models: [] });
      if (typeof window.refreshActiveView === "function") window.refreshActiveView();
    },

    async discoverModels(contextId) {
      const status = document.getElementById("ai-status-" + contextId);
      const provEl = document.getElementById("ai-provider-" + contextId);
      const keyEl = document.getElementById("ai-key-" + contextId);
      const modelEl = document.getElementById("ai-model-" + contextId);

      const provider = provEl ? provEl.value : "gemini";
      const apiKey = keyEl ? keyEl.value.trim() : "";

      if (!apiKey) {
        if (status) status.textContent = "Cole sua API Key primeiro.";
        return;
      }

      if (status) status.textContent = "Consultando modelos de texto disponíveis...";
      try {
        const models = await fetchAvailableModels(provider, apiKey);
        const cfg = loadAiConfig();
        cfg.provider = provider;
        cfg.apiKey = apiKey;
        cfg.models = models;
        if (!cfg.model || !models.some(m => m.id === cfg.model)) {
          cfg.model = models[0].id;
        }
        saveAiConfig(cfg);

        if (modelEl) {
          modelEl.innerHTML = models
            .map(m => `<option value="${escapeHtml(m.id)}" ${cfg.model === m.id ? "selected" : ""}>${escapeHtml(m.label)}</option>`)
            .join("");
        }
        if (status) status.textContent = `${models.length} modelos prontos. Ativo: ${cfg.model}`;
      } catch (err) {
        if (status) status.textContent = "Erro: " + err.message;
      }
    },

    async generateAndSaveLesson(contextId, filterSubjectId) {
      const status = document.getElementById("ai-status-" + contextId);
      const btn = document.getElementById("ai-gen-btn-" + contextId);
      const provEl = document.getElementById("ai-provider-" + contextId);
      const keyEl = document.getElementById("ai-key-" + contextId);
      const modelEl = document.getElementById("ai-model-" + contextId);

      const cfg = loadAiConfig();
      if (provEl) cfg.provider = provEl.value;
      if (keyEl) cfg.apiKey = keyEl.value.trim();
      if (modelEl && modelEl.value) cfg.model = modelEl.value;
      saveAiConfig(cfg);

      if (typeof window.getPersonalizedLessonPrompt !== "function") {
        if (status) status.textContent = "Motor de erros não carregado.";
        return;
      }

      const promptText = window.getPersonalizedLessonPrompt(filterSubjectId);
      if (!promptText) {
        if (status) status.textContent = "Nenhum erro novo sem aula neste filtro! Se quiser gerar novamente dos erros antigos, marque 'Incluir erros que já tiveram aula'.";
        return;
      }

      if (!cfg.apiKey) {
        if (status) status.textContent = "Abra 'Configurar API Key e Modelo' abaixo e cole sua chave.";
        return;
      }

      if (!cfg.model) {
        if (status) status.textContent = "Buscando modelos automaticamente...";
        try {
          const models = await fetchAvailableModels(cfg.provider, cfg.apiKey);
          cfg.models = models;
          cfg.model = models[0].id;
          saveAiConfig(cfg);
        } catch (err) {
          if (status) status.textContent = "Erro: " + err.message;
          return;
        }
      }

      const origBtnText = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="ai-spinner" aria-hidden="true"></span> Gerando aula...`;
      }
      const startedAt = Date.now();
      const renderProgress = () => {
        const secs = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));
        if (status) {
          status.innerHTML = `<div class="ai-loading-banner"><span class="ai-spinner" aria-hidden="true"></span><span>Gerando aula personalizada com <strong>${escapeHtml(cfg.model)}</strong>…</span><span class="ai-elapsed">${secs}s</span></div>`;
        }
      };
      renderProgress();
      const timerId = setInterval(renderProgress, 1000);

      try {
        const markdown = await generateLessonWithAi(promptText, cfg);
        clearInterval(timerId);
        const lessonId = "AIL-" + Date.now();
        let fcCreated = 0;
        if (typeof window.saveGeneratedAiLesson === "function") {
          const res = window.saveGeneratedAiLesson({
            id: lessonId,
            createdAt: new Date().toISOString(),
            subjectFilter: filterSubjectId || "ALL",
            provider: cfg.provider,
            model: cfg.model,
            markdown
          });
          if (res && typeof res.createdFlashcards === "number") fcCreated = res.createdFlashcards;
        }
        if (typeof window.showToast === "function") {
          const fcMsg = fcCreated > 0 ? ` + ${fcCreated} flashcard(s) criado(s) para revisão!` : "!";
          window.showToast(`Aula gerada e salva${fcMsg}`, "success");
        }
        setTimeout(() => {
          const el = document.querySelector(`[data-ai-lesson-id="${lessonId}"]`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      } catch (err) {
        clearInterval(timerId);
        const msg = err && err.message ? err.message : String(err);
        if (status) {
          status.innerHTML = `<div class="ai-loading-banner" style="border-color:var(--danger); color:var(--danger-text);">Erro ao gerar aula: ${escapeHtml(msg)}</div>`;
        }
        if (typeof window.showToast === "function") {
          window.showToast("Erro ao gerar aula: " + msg, "error");
        }
      } finally {
        clearInterval(timerId);
        if (btn) {
          btn.disabled = false;
          btn.textContent = origBtnText || "Gerar Aula dos Meus Erros";
        }
      }
    }
  };
})();
