// ============================================================================
// SINCRONIZAÇÃO EM NUVEM & AUTENTICAÇÃO (SUPABASE — 100% GRATUITO)
// ============================================================================
// Permite login por E-mail/Senha ou Magic Link para salvar e
// mesclar o progresso automaticamente entre celular e computador.
// Funciona em paralelo ao localStorage (fallback offline garantido).
// ============================================================================

(function () {
  "use strict";

  const SUPABASE_CONFIG_KEY = "ESTUDA_EDITAL_SUPABASE_CONFIG_V1";
  const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  const TRACKS_TABLE = "user_tracks";
  const TRACK_PROGRESS_TABLE = "user_track_progress";
  const LEGACY_TABLE = "user_progress";

  function resolveConfig() {
    let localCfg = {};
    try {
      const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (raw) localCfg = JSON.parse(raw) || {};
    } catch (_) {}
    const envCfg = (window.ESTUDA_SUPABASE_CONFIG && typeof window.ESTUDA_SUPABASE_CONFIG === "object")
      ? window.ESTUDA_SUPABASE_CONFIG
      : {};
    const url = String(localCfg.url || envCfg.url || "").trim().replace(/\/+$/, "");
    const key = String(localCfg.key || envCfg.key || "").trim();
    return {
      url,
      key,
      hasCustomLocal: !!(localCfg.url && localCfg.key)
    };
  }

  function saveLocalConfig(url, key) {
    try {
      if (!url && !key) {
        localStorage.removeItem(SUPABASE_CONFIG_KEY);
      } else {
        localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({
          url: String(url || "").trim().replace(/\/+$/, ""),
          key: String(key || "").trim()
        }));
      }
      client = null;
      currentUser = null;
    } catch (e) {
      console.error("Erro ao salvar config Supabase:", e);
    }
  }

  let client = null;
  let currentUser = null;
  let syncStatus = "local"; // "local" | "syncing" | "synced" | "error"
  let lastSyncAt = null;
  let lastError = null;
  let pushTimer = null;
  let initStarted = false;
  let useLegacyFallback = false;
  let hooks = {
    getState: null,
    applyMergedState: null,
    onStatusChange: null
  };

  function notify() {
    if (typeof hooks.onStatusChange === "function") {
      try {
        hooks.onStatusChange(getStatus());
      } catch (e) {
        console.error("CloudSync onStatusChange error:", e);
      }
    }
    updateAuthButtonUI();
  }

  function setStatus(status, errMsg) {
    syncStatus = status;
    lastError = errMsg || null;
    if (status === "synced") lastSyncAt = new Date().toISOString();
    notify();
  }

  function getStatus() {
    const cfg = resolveConfig();
    return {
      ready: !!client,
      configured: !!(cfg.url && cfg.key),
      supabaseUrl: cfg.url,
      user: currentUser,
      status: syncStatus,
      lastSyncAt,
      lastError
    };
  }

  function loadSdk() {
    if (window.supabase && typeof window.supabase.createClient === "function") {
      return Promise.resolve(window.supabase);
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return Promise.reject(new Error("Sem conexão com a internet."));
    }
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SUPABASE_CDN}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.supabase));
        existing.addEventListener("error", () => reject(new Error("Falha ao carregar SDK Supabase.")));
        return;
      }
      const s = document.createElement("script");
      s.src = SUPABASE_CDN;
      s.async = true;
      s.onload = () => {
        if (window.supabase && typeof window.supabase.createClient === "function") {
          resolve(window.supabase);
        } else {
          reject(new Error("SDK Supabase indisponível."));
        }
      };
      s.onerror = () => reject(new Error("Não foi possível carregar o Supabase (offline ou bloqueado)."));
      document.head.appendChild(s);
    });
  }

  async function ensureClient() {
    if (client) return client;
    const cfg = resolveConfig();
    if (!cfg.url || !cfg.key) {
      throw new Error("Supabase ainda não configurado. Informe a URL e a Publishable/Anon Key abaixo (ou nas variáveis de ambiente da Vercel).");
    }
    const sb = await loadSdk();
    client = sb.createClient(cfg.url, cfg.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return client;
  }

  function isMissingTableError(err) {
    const msg = String((err && (err.message || err.details || err.code)) || "");
    return msg.includes("does not exist") || msg.includes("42P01") || msg.includes("Could not find the table");
  }

  async function pushWorkspaceMultiTrack(ws) {
    const now = new Date().toISOString();
    const customTracks = (ws && ws.customTracks) || {};
    const trackStates = (ws && ws.trackStates) || {};

    const trackRows = Object.keys(customTracks).map(tid => ({
      user_id: currentUser.id,
      track_id: tid,
      track_data: customTracks[tid],
      updated_at: now
    }));
    if (trackRows.length) {
      const { error } = await client.from(TRACKS_TABLE).upsert(trackRows, { onConflict: "user_id,track_id" });
      if (error) throw error;
    }

    const progressRows = Object.keys(trackStates).map(tid => ({
      user_id: currentUser.id,
      track_id: tid,
      state: trackStates[tid],
      updated_at: now
    }));
    if (progressRows.length) {
      const { error } = await client.from(TRACK_PROGRESS_TABLE).upsert(progressRows, { onConflict: "user_id,track_id" });
      if (error) throw error;
    }
  }

  async function pullAndMerge() {
    if (!client || !currentUser) return;
    setStatus("syncing");
    try {
      const localWs = hooks.getState ? hooks.getState() : null;

      if (!useLegacyFallback) {
        const [tracksRes, progRes] = await Promise.all([
          client.from(TRACKS_TABLE).select("track_id, track_data").eq("user_id", currentUser.id),
          client.from(TRACK_PROGRESS_TABLE).select("track_id, state").eq("user_id", currentUser.id)
        ]);

        if (!tracksRes.error && !progRes.error) {
          const remoteWs = { customTracks: {}, trackStates: {} };
          (tracksRes.data || []).forEach(r => { if (r && r.track_id && r.track_data) remoteWs.customTracks[r.track_id] = r.track_data; });
          (progRes.data || []).forEach(r => { if (r && r.track_id && r.state) remoteWs.trackStates[r.track_id] = r.state; });

          const finalWs = typeof hooks.applyMergedState === "function" ? hooks.applyMergedState(remoteWs) : localWs;
          if (finalWs) await pushWorkspaceMultiTrack(finalWs);
          setStatus("synced");
          return;
        }

        if (isMissingTableError(tracksRes.error) || isMissingTableError(progRes.error)) {
          useLegacyFallback = true;
        } else {
          throw tracksRes.error || progRes.error;
        }
      }

      // Fallback para tabela única user_progress (compatibilidade imediata)
      const { data, error } = await client
        .from(LEGACY_TABLE)
        .select("state, updated_at")
        .eq("user_id", currentUser.id)
        .maybeSingle();
      if (error) throw error;

      let finalWs = localWs;
      if (data && data.state && typeof data.state === "object" && Object.keys(data.state).length > 0) {
        if (typeof hooks.applyMergedState === "function") {
          finalWs = hooks.applyMergedState(data.state);
        }
      }
      if (finalWs) {
        const { error: upErr } = await client
          .from(LEGACY_TABLE)
          .upsert(
            { user_id: currentUser.id, state: finalWs, updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          );
        if (upErr) throw upErr;
      }

      setStatus("synced");
    } catch (err) {
      console.error("CloudSync pullAndMerge error:", err);
      setStatus("error", formatSupabaseError(err));
    }
  }

  async function pushStateNow(wsObj) {
    if (!client || !currentUser || !wsObj) return;
    setStatus("syncing");
    try {
      if (!useLegacyFallback) {
        try {
          await pushWorkspaceMultiTrack(wsObj);
          setStatus("synced");
          return;
        } catch (err) {
          if (isMissingTableError(err)) {
            useLegacyFallback = true;
          } else {
            throw err;
          }
        }
      }

      const { error } = await client
        .from(LEGACY_TABLE)
        .upsert(
          { user_id: currentUser.id, state: wsObj, updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
      if (error) throw error;
      setStatus("synced");
    } catch (err) {
      console.error("CloudSync push error:", err);
      setStatus("error", formatSupabaseError(err));
    }
  }

  function schedulePush(stateObj) {
    if (!currentUser) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      pushStateNow(stateObj);
    }, 1500);
  }

  function formatSupabaseError(err) {
    const msg = (err && (err.message || err.error_description)) || String(err || "Erro desconhecido");
    if (msg.includes("relation") || msg.includes("Could not find the table")) {
      return `Tabelas Supabase ainda não criadas (execute supabase/schema.sql no SQL Editor).`;
    }
    if (msg.includes("Invalid login credentials")) {
      return "E-mail ou senha incorretos. Se você já entrou antes por Link Mágico ou esqueceu a senha, use 'Esqueci minha senha' ou 'Link mágico'.";
    }
    if (msg.includes("Email not confirmed")) {
      return "Confirme seu e-mail pelo link enviado antes de entrar (verifique também o spam).";
    }
    if (msg.includes("User already registered")) {
      return "Este e-mail já está cadastrado. Clique em Entrar ou use 'Esqueci minha senha'.";
    }
    if (msg.toLowerCase().includes("rate limit")) {
      return "Limite temporário de envio de e-mails atingido. Aguarde alguns minutos e tente novamente.";
    }
    if (msg.includes("Password should be at least")) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }
    return msg;
  }

  async function init(userHooks) {
    if (userHooks) hooks = Object.assign(hooks, userHooks);
    if (initStarted) return;
    initStarted = true;

    try {
      const sb = await ensureClient();
      const { data } = await sb.auth.getSession();
      currentUser = data && data.session ? data.session.user : null;

      sb.auth.onAuthStateChange((event, session) => {
        const nextUser = session ? session.user : null;
        const changedUser = (nextUser && nextUser.id) !== (currentUser && currentUser.id);
        currentUser = nextUser;
        if (event === "PASSWORD_RECOVERY") {
          openResetPasswordModal();
          return;
        }
        if (!currentUser) {
          clearTimeout(pushTimer);
          setStatus("local");
        } else if (event === "SIGNED_IN" || changedUser) {
          pullAndMerge();
        } else {
          notify();
        }
      });

      if (currentUser) {
        await pullAndMerge();
      } else {
        setStatus("local");
      }
    } catch (err) {
      // Modo offline ou sem SDK: segue 100% funcional no localStorage
      setStatus("local", null);
    }
  }

  async function signInWithPassword(email, password) {
    const sb = await ensureClient();
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(formatSupabaseError(error));
    return data;
  }

  async function signUp(email, password) {
    const sb = await ensureClient();
    const { data, error } = await sb.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });
    if (error) throw new Error(formatSupabaseError(error));
    return data;
  }

  async function signInWithMagicLink(email) {
    const sb = await ensureClient();
    const { data, error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + window.location.pathname }
    });
    if (error) throw new Error(formatSupabaseError(error));
    return data;
  }

  async function resetPassword(email) {
    const sb = await ensureClient();
    const { data, error } = await sb.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + window.location.pathname
    });
    if (error) throw new Error(formatSupabaseError(error));
    return data;
  }

  async function updatePassword(newPassword) {
    const sb = await ensureClient();
    const { data, error } = await sb.auth.updateUser({ password: newPassword });
    if (error) throw new Error(formatSupabaseError(error));
    return data;
  }

  function openResetPasswordModal() {
    const existing = document.getElementById("cloud-auth-modal");
    if (existing) existing.remove();
    const overlay = document.createElement("div");
    overlay.id = "cloud-auth-modal";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(15,23,42,0.72);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;";
    overlay.innerHTML = `
      <div style="background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-strong);border-radius:14px;max-width:400px;width:100%;padding:22px;box-shadow:var(--shadow);">
        <h3 style="font-size:1.05rem;font-weight:800;margin-bottom:8px;">Definir nova senha</h3>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:12px;">
          Digite abaixo a nova senha para sua conta (mínimo 6 caracteres).
        </p>
        <input id="cm-new-pass" type="password" class="form-control" placeholder="Nova senha (mín. 6 caracteres)" autocomplete="new-password" />
        <div id="cm-reset-msg" style="display:none;font-size:0.82rem;padding:9px 11px;border-radius:8px;margin-top:10px;"></div>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn btn-primary" style="flex:1;" id="cm-save-new-pass">Salvar senha</button>
          <button class="btn btn-outline" id="cm-cancel-new-pass">Cancelar</button>
        </div>
      </div>
    `;
    const msg = overlay.querySelector("#cm-reset-msg");
    const passEl = overlay.querySelector("#cm-new-pass");
    overlay.querySelector("#cm-cancel-new-pass").onclick = () => overlay.remove();
    overlay.querySelector("#cm-save-new-pass").onclick = async () => {
      if (passEl.value.length < 6) {
        msg.style.display = "block";
        msg.style.background = "var(--danger-bg)";
        msg.style.color = "var(--danger-text)";
        msg.textContent = "A senha deve ter pelo menos 6 caracteres.";
        return;
      }
      try {
        await updatePassword(passEl.value);
        msg.style.display = "block";
        msg.style.background = "var(--success-bg)";
        msg.style.color = "var(--success-text)";
        msg.textContent = "Senha atualizada com sucesso! Você já está conectado.";
        setTimeout(() => overlay.remove(), 1200);
      } catch (e) {
        msg.style.display = "block";
        msg.style.background = "var(--danger-bg)";
        msg.style.color = "var(--danger-text)";
        msg.textContent = e.message;
      }
    };
    document.body.appendChild(overlay);
    setTimeout(() => passEl.focus(), 50);
  }

  async function signInWithGoogle() {
    const sb = await ensureClient();
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    if (error) throw new Error(formatSupabaseError(error));
    return data;
  }

  async function signOut() {
    clearTimeout(pushTimer);
    if (client) {
      await client.auth.signOut();
    }
    currentUser = null;
    setStatus("local");
  }

  async function syncNow() {
    await ensureClient();
    if (!currentUser) throw new Error("Faça login primeiro para sincronizar.");
    await pullAndMerge();
  }

  function updateAuthButtonUI() {
    const topBtn = document.getElementById("topbar-cloud-btn");
    if (topBtn) {
      if (currentUser) {
        const shortName = (currentUser.email || "Conta").split("@")[0].slice(0, 14);
        const dotColor = syncStatus === "synced" ? "#10b981" : syncStatus === "syncing" ? "#f59e0b" : "#ef4444";
        topBtn.innerHTML = `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${dotColor};margin-right:6px;"></span>${escapeHtml(shortName)}`;
        topBtn.title = `Conectado: ${currentUser.email} (${syncStatus})`;
      } else {
        topBtn.innerHTML = "Nuvem / Entrar";
        topBtn.title = "Fazer login para salvar progresso na nuvem";
      }
    }
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openAuthModal() {
    const existing = document.getElementById("cloud-auth-modal");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "cloud-auth-modal";
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(2,6,23,0.72);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;";

    if (currentUser) {
      overlay.innerHTML = `
        <div style="background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-strong);border-radius:14px;max-width:420px;width:100%;padding:22px;box-shadow:var(--shadow);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <h3 style="font-size:1.05rem;font-weight:800;">Conta na Nuvem (Supabase)</h3>
            <button class="btn btn-outline btn-sm" id="cm-close">Fechar</button>
          </div>
          <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:12px;">
            Conectado como <strong>${escapeHtml(currentUser.email)}</strong>.<br>
            Status: <strong>${syncStatus === "synced" ? "Sincronizado" : syncStatus === "syncing" ? "Sincronizando..." : syncStatus === "error" ? "Erro ao sincronizar" : "Local"}</strong>
            ${lastSyncAt ? `<br><span style="font-size:0.78rem;color:var(--text-muted);">Última sincronização: ${new Date(lastSyncAt).toLocaleString("pt-BR")}</span>` : ""}
          </p>
          ${lastError ? `<div style="background:var(--danger-bg);color:var(--danger-text);padding:10px;border-radius:8px;font-size:0.82rem;margin-bottom:12px;">${escapeHtml(lastError)}</div>` : ""}
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" id="cm-sync">Sincronizar agora</button>
            <button class="btn btn-outline btn-sm" style="color:var(--danger-text);" id="cm-logout">Sair da conta</button>
          </div>
        </div>
      `;
      overlay.querySelector("#cm-close").onclick = () => overlay.remove();
      overlay.querySelector("#cm-sync").onclick = async () => {
        const btn = overlay.querySelector("#cm-sync");
        btn.disabled = true;
        btn.textContent = "Sincronizando...";
        await syncNow().catch(() => {});
        openAuthModal();
      };
      overlay.querySelector("#cm-logout").onclick = async () => {
        await signOut();
        overlay.remove();
      };
      overlay.addEventListener("click", ev => { if (ev.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);
      return;
    }

    const cfg = resolveConfig();
    const isConfigured = !!(cfg.url && cfg.key);

    overlay.innerHTML = `
      <div style="background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-strong);border-radius:14px;max-width:440px;width:100%;padding:22px;box-shadow:var(--shadow);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="font-size:1.08rem;font-weight:800;">Salvar Progresso na Nuvem</h3>
          <button class="btn btn-outline btn-sm" id="cm-close">Fechar</button>
        </div>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:12px;">
          Entre para sincronizar suas respostas, erros, simulados e aulas entre celular e computador. Sem login, tudo continua salvo localmente.
        </p>

        <div style="display:flex;flex-direction:column;gap:10px;">
          <div>
            <label class="field-label" for="cm-email">E-mail</label>
            <input id="cm-email" type="email" class="form-control" placeholder="seuemail@exemplo.com" autocomplete="email" />
          </div>
          <div>
            <label class="field-label" for="cm-pass">Senha (mín. 6 caracteres)</label>
            <input id="cm-pass" type="password" class="form-control" placeholder="••••••••" autocomplete="current-password" />
          </div>
          <div id="cm-msg" style="display:none;font-size:0.82rem;padding:9px 11px;border-radius:8px;"></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-primary" style="flex:1;" id="cm-login">Entrar</button>
            <button class="btn btn-outline" style="flex:1;" id="cm-signup">Criar conta</button>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" style="flex:1;" id="cm-magic">Enviar link mágico</button>
            <button class="btn btn-outline btn-sm" style="flex:1;" id="cm-forgot">Esqueci minha senha</button>
          </div>

          <details ${isConfigured ? "" : "open"} style="margin-top:6px;border-top:1px solid var(--border-color);padding-top:10px;">
            <summary style="cursor:pointer;font-size:0.78rem;color:var(--text-muted);font-weight:600;">
              ${isConfigured ? `Projeto Supabase ativo (${escapeHtml(cfg.url.replace("https://", ""))})` : "Configurar Supabase (URL + Key)"}
            </summary>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
              <div>
                <label class="field-label" for="cm-sb-url" style="font-size:0.74rem;">Supabase URL</label>
                <input id="cm-sb-url" class="form-control" value="${escapeHtml(cfg.url)}" placeholder="https://xxxx.supabase.co" />
              </div>
              <div>
                <label class="field-label" for="cm-sb-key" style="font-size:0.74rem;">Publishable / Anon Key</label>
                <input id="cm-sb-key" class="form-control" value="${escapeHtml(cfg.key)}" placeholder="sb_publishable_... ou eyJ..." />
              </div>
              <div style="display:flex;gap:8px;">
                <button class="btn btn-outline btn-sm" id="cm-save-sb" style="flex:1;">Salvar neste navegador</button>
                ${cfg.hasCustomLocal ? `<button class="btn btn-outline btn-sm" id="cm-clear-sb" style="color:var(--danger-text);">Limpar</button>` : ""}
              </div>
            </div>
          </details>
        </div>
      </div>
    `;

    const msgBox = overlay.querySelector("#cm-msg");
    const emailEl = overlay.querySelector("#cm-email");
    const passEl = overlay.querySelector("#cm-pass");

    function showMsg(text, isErr) {
      msgBox.style.display = "block";
      msgBox.style.background = isErr ? "var(--danger-bg)" : "var(--success-bg)";
      msgBox.style.color = isErr ? "var(--danger-text)" : "var(--success-text)";
      msgBox.textContent = text;
    }

    overlay.querySelector("#cm-close").onclick = () => overlay.remove();
    overlay.addEventListener("click", ev => { if (ev.target === overlay) overlay.remove(); });

    overlay.querySelector("#cm-save-sb").onclick = async () => {
      const u = overlay.querySelector("#cm-sb-url").value.trim();
      const k = overlay.querySelector("#cm-sb-key").value.trim();
      if (!u || !k) return showMsg("Informe a Supabase URL e a Publishable/Anon Key.", true);
      saveLocalConfig(u, k);
      showMsg("Configuração do Supabase salva! Você já pode entrar acima.", false);
    };
    const clearBtn = overlay.querySelector("#cm-clear-sb");
    if (clearBtn) {
      clearBtn.onclick = () => {
        saveLocalConfig("", "");
        openAuthModal();
      };
    }

    overlay.querySelector("#cm-login").onclick = async () => {
      if (!emailEl.value.trim() || !passEl.value) return showMsg("Preencha e-mail e senha.", true);
      try {
        showMsg("Entrando...", false);
        await signInWithPassword(emailEl.value, passEl.value);
        overlay.remove();
      } catch (e) {
        showMsg(e.message, true);
      }
    };

    overlay.querySelector("#cm-signup").onclick = async () => {
      if (!emailEl.value.trim() || passEl.value.length < 6) {
        return showMsg("Informe um e-mail válido e senha com pelo menos 6 caracteres.", true);
      }
      try {
        showMsg("Criando conta...", false);
        const res = await signUp(emailEl.value, passEl.value);
        if (res && res.session) {
          overlay.remove();
        } else if (res && res.user && Array.isArray(res.user.identities) && res.user.identities.length === 0) {
          showMsg("Este e-mail já possui conta cadastrada! Use 'Entrar' com sua senha, 'Enviar link mágico' ou 'Esqueci minha senha' para definir uma nova senha.", true);
        } else {
          showMsg("Conta criada! Abra seu e-mail e clique no link de confirmação antes de entrar (verifique também a caixa de spam).", false);
        }
      } catch (e) {
        showMsg(e.message, true);
      }
    };

    overlay.querySelector("#cm-magic").onclick = async () => {
      if (!emailEl.value.trim()) return showMsg("Digite seu e-mail acima para receber o link.", true);
      try {
        showMsg("Enviando link...", false);
        await signInWithMagicLink(emailEl.value);
        showMsg("Link enviado! Abra seu e-mail e clique no link para entrar automaticamente.", false);
      } catch (e) {
        showMsg(e.message, true);
      }
    };

    overlay.querySelector("#cm-forgot").onclick = async () => {
      if (!emailEl.value.trim()) return showMsg("Digite seu e-mail acima para redefinir a senha.", true);
      try {
        showMsg("Enviando e-mail de redefinição...", false);
        await resetPassword(emailEl.value);
        showMsg("E-mail enviado! Abra o link recebido para definir sua nova senha (verifique também o spam).", false);
      } catch (e) {
        showMsg(e.message, true);
      }
    };

    document.body.appendChild(overlay);
    setTimeout(() => emailEl.focus(), 50);
  }

  window.CloudSync = {
    init,
    schedulePush,
    syncNow,
    signInWithPassword,
    signUp,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
    getStatus,
    saveLocalConfig,
    openAuthModal
  };
})();
