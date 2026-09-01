(() => {
  const script = document.currentScript;
  if (!script) return;

  const validStatuses = new Set(['operational', 'degraded', 'offline']);
  const validThemes = new Set(['light', 'dark']);
  const requestedStatus = (script.dataset.status || '').toLowerCase();
  const requestedTheme = (script.dataset.theme || '').toLowerCase();
  const status = validStatuses.has(requestedStatus) ? requestedStatus : 'operational';
  const theme = validThemes.has(requestedTheme) ? requestedTheme : 'light';
  const label = script.dataset.label || 'Service status';
  const descriptions = {
    operational: 'All systems operational',
    degraded: 'Degraded performance',
    offline: 'Service unavailable'
  };

  const host = document.createElement('div');
  host.dataset.testWidget = 'status';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host { display: inline-block; max-width: 100%; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      * { box-sizing: border-box; }
      .card {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
        align-items: center;
        min-width: min(280px, 100%);
        padding: 13px 15px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--background);
        color: var(--text);
        box-shadow: 0 8px 22px rgb(15 23 42 / 8%);
      }
      .light { --background: #fff; --border: #dbe2ee; --text: #172033; --muted: #64748b; }
      .dark { --background: #172033; --border: #334155; --text: #f8fafc; --muted: #cbd5e1; }
      .dot { width: 11px; height: 11px; border-radius: 999px; background: var(--status); box-shadow: 0 0 0 4px color-mix(in srgb, var(--status) 18%, transparent); }
      .operational { --status: #16a34a; }
      .degraded { --status: #d97706; }
      .offline { --status: #dc2626; }
      strong, span { display: block; }
      strong { font-size: 14px; line-height: 1.3; }
      span { margin-top: 2px; color: var(--muted); font-size: 12px; line-height: 1.35; }
    </style>
    <section class="card ${theme} ${status}" role="status" aria-label="${escapeHtml(label)}: ${descriptions[status]}">
      <i class="dot" aria-hidden="true"></i>
      <div><strong>${escapeHtml(label)}</strong><span>${descriptions[status]}</span></div>
    </section>
  `;

  script.insertAdjacentElement('afterend', host);

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }
})();
