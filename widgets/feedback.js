(() => {
  const script = document.currentScript;
  if (!script) return;

  const validThemes = new Set(['light', 'dark']);
  const requestedTheme = (script.dataset.theme || '').toLowerCase();
  const theme = validThemes.has(requestedTheme) ? requestedTheme : 'light';
  const question = script.dataset.question || 'Was this page helpful?';

  const host = document.createElement('div');
  host.dataset.testWidget = 'feedback';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host { display: block; max-width: 420px; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      * { box-sizing: border-box; }
      .card { padding: 18px; border: 1px solid var(--border); border-radius: 14px; background: var(--background); color: var(--text); }
      .light { --background: #fff; --border: #dbe2ee; --text: #172033; --muted: #64748b; --button: #f1f5f9; --hover: #e2e8f0; }
      .dark { --background: #172033; --border: #334155; --text: #f8fafc; --muted: #cbd5e1; --button: #334155; --hover: #475569; }
      p { margin: 0; font-size: 15px; font-weight: 700; line-height: 1.4; }
      .actions { display: flex; gap: 8px; margin-top: 12px; }
      button { border: 1px solid var(--border); border-radius: 9px; padding: 8px 13px; background: var(--button); color: var(--text); font: inherit; font-weight: 700; cursor: pointer; }
      button:hover { background: var(--hover); }
      button:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }
      .thanks { color: var(--muted); font-weight: 600; }
    </style>
    <section class="card ${theme}" aria-live="polite">
      <p>${escapeHtml(question)}</p>
      <div class="actions">
        <button type="button" data-value="yes" aria-label="Yes, this was helpful">Yes</button>
        <button type="button" data-value="no" aria-label="No, this was not helpful">No</button>
      </div>
    </section>
  `;

  root.querySelector('.actions').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;

    const value = button.dataset.value;
    root.querySelector('.card').innerHTML = '<p class="thanks">Thanks for your feedback.</p>';
    host.dispatchEvent(new CustomEvent('test-widget:feedback', {
      bubbles: true,
      detail: { value }
    }));
  });

  script.insertAdjacentElement('afterend', host);

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }
})();
