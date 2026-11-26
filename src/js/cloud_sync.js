// ============================================================================
// SINCRONIZAÇÃO EM NUVEM & AUTENTICAÇÃO (SUPABASE — 100% GRATUITO)
// ============================================================================
// Permite login por E-mail/Senha, Magic Link ou Google OAuth para salvar e
// mesclar o progresso automaticamente entre celular e computador.
// Funciona em paralelo ao localStorage (fallback offline garantido).
// ============================================================================

(function () {
  "use strict";

  const SUPABASE_URL = "https://qcxukkvksgfhldftunbr.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_vHNCG0XErlBiXq6XyvM3BA_Ft08Av3b";
  const SUPABASE_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  const TABLE_NAME = "user_progress";

  let client = null;
  let currentUser = null;
  let syncStatus = "local"; // "local" | "syncing" | "synced" | "error"
  let lastSyncAt = null;
  let lastError = null;
  let pushTimer = null;
  let initStarted = false;
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
    return {
      ready: !!client,
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
    const sb = await loadSdk();
    client = sb.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return client;
  }

  async function pullAndMerge() {
    if (!client || !currentUser) return;
    setStatus("syncing");
    try {
      const { data, error } = await client
        .from(TABLE_NAME)
        .select("state, updated_at")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (error) throw error;

      const localState = hooks.getState ? hooks.getState() : null;

      if (data && data.state && typeof data.state === "object" && Object.keys(data.state).length > 0) {
        let finalState = data.state;
        if (typeof hooks.applyMergedState === "function") {
          finalState = hooks.applyMergedState(data.state);
        }
        // Envia o estado mesclado de volta se houver progresso local adicional
        if (localState) {
          const { error: upErr } = await client
            .from(TABLE_NAME)
            .upsert(
              {
                user_id: currentUser.id,
                state: finalState,
                updated_at: new Date().toISOString()
              },
              { onConflict: "user_id" }
            );
          if (upErr) throw upErr;
        }
      } else if (localState) {
        // Primeiro login neste usuário: envia progresso local atual para a nuvem
        const { error: upErr } = await client
          .from(TABLE_NAME)
          .upsert(
            {
              user_id: currentUser.id,
              state: localState,
              updated_at: new Date().toISOString()
            },
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

  async function pushStateNow(stateObj) {
    if (!client || !currentUser || !stateObj) return;
    setStatus("syncing");
    try {
      const { error } = await client
        .from(TABLE_NAME)
        .upsert(
          {
            user_id: currentUser.id,
            state: stateObj,
            updated_at: new Date().toISOString()
          },
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
    if (msg.includes("relation") && msg.includes(TABLE_NAME)) {
      return `Tabela "${TABLE_NAME}" ainda não foi criada no Supabase (veja o SQL na tela de Dados & Backup).`;
    }
    if (msg.includes("Invalid login credentials")) {
      return "E-mail ou senha incorretos.";
    }
    if (msg.includes("Email not confirmed")) {
      return "Confirme seu e-mail pelo link enviado antes de entrar.";
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

    overlay.innerHTML = `
      <div style="background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-strong);border-radius:14px;max-width:430px;width:100%;padding:22px;box-shadow:var(--shadow);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="font-size:1.08rem;font-weight:800;">Salvar Progresso na Nuvem</h3>
          <button class="btn btn-outline btn-sm" id="cm-close">Fechar</button>
        </div>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:14px;">
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
          <button class="btn btn-outline btn-sm" id="cm-magic">Enviar link mágico por e-mail (sem senha)</button>
          <button class="btn btn-outline btn-sm" id="cm-google">Entrar com Google</button>
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
        } else {
          showMsg("Conta criada! Verifique seu e-mail para confirmar o cadastro e depois clique em Entrar.", false);
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

    overlay.querySelector("#cm-google").onclick = async () => {
      try {
        await signInWithGoogle();
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
    openAuthModal
  };
})();
