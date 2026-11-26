// ============================================================================
// PWA INSTALLER — Estuda Edital
// Registra Service Worker, captura beforeinstallprompt (Android/Chrome/Edge)
// e oferece instruções claras para iOS (Safari) ou navegadores sem prompt nativo.
// ============================================================================
(function () {
  let deferredPrompt = null;

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
  }

  function updateInstallButtons() {
    const installed = isStandalone();
    document.querySelectorAll("[data-pwa-install-btn]").forEach((btn) => {
      btn.style.display = installed ? "none" : "";
    });
  }

  if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    updateInstallButtons();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    updateInstallButtons();
  });

  function openInstructionsModal() {
    const existing = document.getElementById("pwa-install-modal");
    if (existing) existing.remove();

    const ios = isIOS();
    const stepsHtml = ios
      ? `
        <ol style="margin:10px 0 0 18px; padding:0; display:flex; flex-direction:column; gap:8px; font-size:0.88rem; color:var(--text-secondary);">
          <li>Abra este site no <strong>Safari</strong> (no iPhone/iPad).</li>
          <li>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima, na barra inferior).</li>
          <li>Role para baixo e toque em <strong>Adicionar à Tela de Início</strong>.</li>
          <li>Confirme tocando em <strong>Adicionar</strong> — o ícone do Estuda Edital aparecerá como um aplicativo.</li>
        </ol>
      `
      : `
        <ol style="margin:10px 0 0 18px; padding:0; display:flex; flex-direction:column; gap:8px; font-size:0.88rem; color:var(--text-secondary);">
          <li>No <strong>Chrome / Edge (Android)</strong>, toque no menu <strong>⋮</strong> (três pontinhos no canto superior direito).</li>
          <li>Toque em <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</li>
          <li>Confirme em <strong>Instalar</strong> — o Estuda Edital abrirá em tela cheia como um app nativo.</li>
        </ol>
        <p style="margin-top:10px; font-size:0.78rem; color:var(--text-muted);">
          No iPhone/iPad (Safari): toque em <strong>Compartilhar</strong> &rarr; <strong>Adicionar à Tela de Início</strong>.
        </p>
      `;

    const overlay = document.createElement("div");
    overlay.id = "pwa-install-modal";
    overlay.style.cssText =
      "position:fixed;inset:0;background:rgba(2,6,23,0.72);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;";
    overlay.innerHTML = `
      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;max-width:420px;width:100%;padding:20px;box-shadow:0 20px 50px rgba(0,0,0,0.45);">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <img src="icons/icon-192.png" alt="Estuda Edital" style="width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;" onerror="this.style.display='none'" />
          <div style="flex:1;">
            <h3 style="margin:0;font-size:1.05rem;">Instalar Estuda Edital</h3>
            <div style="font-size:0.78rem;color:var(--text-muted);">Use em tela cheia como aplicativo no celular</div>
          </div>
          <button type="button" id="pwa-close-x" class="icon-btn" aria-label="Fechar">✕</button>
        </div>
        ${stepsHtml}
        <div style="display:flex;justify-content:flex-end;margin-top:16px;">
          <button type="button" id="pwa-close-btn" class="btn btn-primary btn-sm">Entendi</button>
        </div>
      </div>
    `;
    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.querySelector("#pwa-close-x").onclick = close;
    overlay.querySelector("#pwa-close-btn").onclick = close;
    document.body.appendChild(overlay);
  }

  async function promptInstall() {
    if (isStandalone()) return;
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          deferredPrompt = null;
          updateInstallButtons();
        }
        return;
      } catch (_) {
        // Fallback to manual instructions
      }
    }
    openInstructionsModal();
  }

  document.addEventListener("DOMContentLoaded", updateInstallButtons);

  window.PWAInstall = {
    promptInstall,
    isStandalone
  };
})();
