/* ===== LinkOne LP scripts ===== */
(() => {
  'use strict';

  // ---------- Language toggle (JP / EN) ----------
  const LANG_KEY = 'linkone:lang';
  const setLang = (lang) => {
    if (lang !== 'jp' && lang !== 'en') return;
    document.body.dataset.lang = lang;
    document.documentElement.lang = lang === 'jp' ? 'ja' : 'en';
    document.querySelectorAll('[data-lang-set]').forEach(btn => {
      const active = btn.dataset.langSet === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch {}
  };
  const initialLang = (() => {
    try { return localStorage.getItem(LANG_KEY) || 'jp'; } catch { return 'jp'; }
  })();
  setLang(initialLang);
  document.querySelectorAll('[data-lang-set]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.langSet));
  });

  // ---------- Mobile nav toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    siteNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => siteNav.classList.remove('is-open'));
    });
  }

  // ---------- Slideshow (Events) ----------
  (() => {
    const root = document.querySelector('[data-slideshow]');
    if (!root) return;
    const track = root.querySelector('[data-slides]');
    const slides = Array.from(track.children);
    const prevBtn = root.querySelector('[data-prev]');
    const nextBtn = root.querySelector('[data-next]');
    const dotsEl = root.querySelector('[data-dots]');
    let idx = 0;
    let timer = null;
    const INTERVAL = 6000;

    // build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `スライド ${i + 1}`);
      dot.addEventListener('click', () => go(i, true));
      dotsEl.appendChild(dot);
    });

    function go(n, manual = false) {
      idx = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dotsEl.querySelectorAll('.slide-dot').forEach((d, i) => d.classList.toggle('is-active', i === idx));
      if (manual) restartTimer();
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    function startTimer() { timer = setInterval(next, INTERVAL); }
    function restartTimer() { clearInterval(timer); startTimer(); }

    nextBtn.addEventListener('click', () => go(idx + 1, true));
    prevBtn.addEventListener('click', () => go(idx - 1, true));

    // pause on hover
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', startTimer);

    // swipe support
    let startX = null;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
      startX = null;
      restartTimer();
    });

    startTimer();
  })();

  // ---------- Origins World Map (dots + modal + editor) ----------
  (() => {
    const root = document.querySelector('[data-world-map]');
    if (!root) return;

    const dotsEl  = root.querySelector('[data-origin-dots]');
    const noteEl  = root.querySelector('[data-map-note]');
    const toolbar = document.querySelector('[data-edit-toolbar]');
    const editForm = document.querySelector('[data-edit-form]');
    const modal   = document.querySelector('[data-origin-modal]');

    const STORAGE = 'linkone:origin-dots-v2';
    // Drop any pre-v2 cache (which contained Colombia)
    try { localStorage.removeItem('linkone:origin-dots'); } catch {}
    const DEFAULTS = [
      { id: 'costarica', x: 21,   y: 44, color: '#2DA890', label: 'Costa Rica', bottomLayer: false,
        title: 'コスタリカ — PuraVida',
        description: 'PuraVida は、コスタリカのスペシャルティコーヒー生豆を専門的に取り扱う商社です。マイクロミルや単一農園の限定ロットを直接取引でお届けします。',
        linkUrl: '#origins', imageUrl: '' },
      { id: 'panama',    x: 25.5, y: 47, color: '#E94E2D', label: 'Panama',     bottomLayer: false,
        title: 'パナマ — Brisa and Tierra',
        description: 'Brisa and Tierra は、パナマ専門の輸入商社。ボケテ・ボルカン地区を中心に、希少なゲイシャや高地ロットを扱います。',
        linkUrl: '#origins', imageUrl: '' },
      { id: 'brazil',    x: 36,   y: 60, color: '#8AC53F', label: 'Brazil',     bottomLayer: false,
        title: 'ブラジル — Mirai Seeds',
        description: 'Mirai Seeds は、グアリロバ農園(セラード地区)オフィシャルパートナー。多彩な品種と精製方法のシグネチャーロットをご提供します。',
        linkUrl: '#origins', imageUrl: '' },
      { id: 'taiwan',    x: 83.5, y: 37, color: '#F4B836', label: 'Taiwan',     bottomLayer: false,
        title: '台湾 — ORIOWL',
        description: 'ORIOWL 株式会社は台湾珈琲専門商社。阿里山・卓武山などの高地産小ロットを、フレッシュな状態で輸入しています。',
        linkUrl: '#origins', imageUrl: '' },
      { id: 'indonesia', x: 81,   y: 53, color: '#2DA890', label: 'Indonesia',  bottomLayer: false,
        title: 'インドネシア — Rational Idea',
        description: 'Rational Idea は Asosiasi Kopi Indonesia 日本総代理店。スマトラ・ジャワなど多島の個性豊かな生豆を取り扱います。',
        linkUrl: '#origins', imageUrl: '' },
    ];

    // Edit mode requires BOTH:
    //   (a) the toolbar markup is present in the DOM — only WP admins receive
    //       it (rendered server-side via current_user_can()), and
    //   (b) the visitor explicitly opted in with ?edit=1.
    // A non-admin appending ?edit=1 hits (a) === false and stays in read-only.
    const editMode = !!toolbar && new URLSearchParams(location.search).has('edit');
    let dots = loadDots();
    let editingId = null;
    let addMode = false;
    let dragId = null;

    function uid() { return 'dot_' + Math.random().toString(36).slice(2, 9); }
    function loadDots() {
      // Public viewers always see DEFAULTS — never inherit a previous editor's
      // localStorage state (which used to leak stale dots across sessions).
      if (!editMode) return structuredClone(DEFAULTS);
      try {
        const raw = localStorage.getItem(STORAGE);
        if (!raw) return structuredClone(DEFAULTS);
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length ? parsed : structuredClone(DEFAULTS);
      } catch { return structuredClone(DEFAULTS); }
    }
    function saveDots() {
      if (!editMode) return;
      localStorage.setItem(STORAGE, JSON.stringify(dots));
    }
    function findDot(id) { return dots.find(d => d.id === id); }
    function escHtml(s) {
      return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function render() {
      dotsEl.innerHTML = '';
      dots.forEach(d => {
        const li = document.createElement('li');
        li.className = 'origin-dot' + (d.bottomLayer ? ' origin-dot--ref' : '');
        li.style.cssText = `--x:${d.x}%;--y:${d.y}%;--c:${d.color || '#E94E2D'};`;
        li.dataset.id = d.id;
        const a = document.createElement('a');
        a.href = '#';
        a.setAttribute('aria-label', d.label || d.title || 'origin');
        a.innerHTML = `<span class="origin-pulse" aria-hidden="true"></span>` +
                      `<span class="origin-label">${escHtml(d.label || '')}` +
                      `${d.bottomLayer ? ' <small>準備中</small>' : ''}</span>`;
        li.appendChild(a);
        dotsEl.appendChild(li);
      });
    }

    function openModal(d) {
      if (!modal) return;
      modal.querySelector('[data-modal-title]').textContent = d.title || d.label || '';
      modal.querySelector('[data-modal-desc]').textContent = d.description || '';
      const img = modal.querySelector('[data-modal-image]');
      if (d.imageUrl) { img.src = d.imageUrl; img.alt = d.title || d.label || ''; img.hidden = false; }
      else { img.removeAttribute('src'); img.hidden = true; }
      const link = modal.querySelector('[data-modal-link]');
      if (d.linkUrl) { link.href = d.linkUrl; link.hidden = false; }
      else { link.hidden = true; }
      modal.hidden = false;
      modal.querySelector('.origin-modal__close')?.focus();
    }
    function closeModal() { if (modal) modal.hidden = true; }

    function openEditForm(d) {
      if (!editForm) return;
      editingId = d.id;
      editForm.hidden = false;
      editForm.querySelector('[name="label"]').value       = d.label || '';
      editForm.querySelector('[name="title"]').value       = d.title || '';
      editForm.querySelector('[name="description"]').value = d.description || '';
      editForm.querySelector('[name="linkUrl"]').value     = d.linkUrl || '';
      editForm.querySelector('[name="imageUrl"]').value    = d.imageUrl || '';
      editForm.querySelector('[name="color"]').value       = d.color || '#E94E2D';
      editForm.querySelector('[name="bottomLayer"]').checked = !!d.bottomLayer;
      editForm.querySelector('[name="x"]').value = d.x;
      editForm.querySelector('[name="y"]').value = d.y;
    }
    function closeEditForm() { editingId = null; if (editForm) editForm.hidden = true; }

    // Click on dot: edit form (edit mode) or modal (normal)
    dotsEl.addEventListener('click', e => {
      const li = e.target.closest('.origin-dot');
      if (!li) return;
      e.preventDefault();
      const d = findDot(li.dataset.id);
      if (!d) return;
      if (editMode) openEditForm(d);
      else openModal(d);
    });

    // Add mode: click on map to create new dot
    root.addEventListener('click', e => {
      if (!editMode || !addMode) return;
      if (e.target.closest('.origin-dot')) return;
      const rect = root.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const newDot = {
        id: uid(),
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        color: '#E94E2D',
        label: 'New Origin',
        bottomLayer: false,
        title: '新しい産地',
        description: '',
        linkUrl: '',
        imageUrl: ''
      };
      dots.push(newDot);
      saveDots();
      render();
      addMode = false;
      document.body.classList.remove('is-add-mode');
      toolbar?.querySelector('[data-add]')?.classList.remove('is-active');
      openEditForm(newDot);
    });

    // Drag dots in edit mode (pointer events: works for mouse + touch)
    dotsEl.addEventListener('pointerdown', e => {
      if (!editMode) return;
      const li = e.target.closest('.origin-dot');
      if (!li) return;
      e.preventDefault();
      dragId = li.dataset.id;
      li.classList.add('is-dragging');
      li.setPointerCapture?.(e.pointerId);
    });
    document.addEventListener('pointermove', e => {
      if (!dragId) return;
      const rect = root.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      const d = findDot(dragId);
      if (!d) return;
      d.x = Math.round(x * 10) / 10;
      d.y = Math.round(y * 10) / 10;
      const li = dotsEl.querySelector(`[data-id="${dragId}"]`);
      if (li) li.style.cssText = `--x:${d.x}%;--y:${d.y}%;--c:${d.color};`;
      if (editingId === dragId && editForm && !editForm.hidden) {
        editForm.querySelector('[name="x"]').value = d.x;
        editForm.querySelector('[name="y"]').value = d.y;
      }
    });
    document.addEventListener('pointerup', () => {
      if (!dragId) return;
      const li = dotsEl.querySelector(`[data-id="${dragId}"]`);
      li?.classList.remove('is-dragging');
      saveDots();
      dragId = null;
    });

    // Edit form: live update
    editForm?.addEventListener('input', () => {
      if (!editingId) return;
      const d = findDot(editingId);
      if (!d) return;
      d.label       = editForm.querySelector('[name="label"]').value;
      d.title       = editForm.querySelector('[name="title"]').value;
      d.description = editForm.querySelector('[name="description"]').value;
      d.linkUrl     = editForm.querySelector('[name="linkUrl"]').value;
      d.imageUrl    = editForm.querySelector('[name="imageUrl"]').value;
      d.color       = editForm.querySelector('[name="color"]').value;
      d.bottomLayer = editForm.querySelector('[name="bottomLayer"]').checked;
      d.x = Math.max(0, Math.min(100, parseFloat(editForm.querySelector('[name="x"]').value) || 0));
      d.y = Math.max(0, Math.min(100, parseFloat(editForm.querySelector('[name="y"]').value) || 0));
      saveDots();
      render();
    });
    editForm?.querySelector('[data-close]')?.addEventListener('click', closeEditForm);
    editForm?.querySelector('[data-delete]')?.addEventListener('click', () => {
      if (!editingId) return;
      if (!confirm('このドットを削除しますか?')) return;
      dots = dots.filter(d => d.id !== editingId);
      saveDots(); render(); closeEditForm();
    });

    // Toolbar actions
    toolbar?.querySelector('[data-add]')?.addEventListener('click', e => {
      addMode = !addMode;
      document.body.classList.toggle('is-add-mode', addMode);
      e.currentTarget.classList.toggle('is-active', addMode);
    });
    toolbar?.querySelector('[data-export]')?.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(dots, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'linkone-origins.json';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });
    toolbar?.querySelector('[data-import]')?.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result);
            if (!Array.isArray(parsed)) throw new Error('JSONは配列形式でなければなりません');
            dots = parsed.map(d => ({ ...d, id: d.id || uid() }));
            saveDots(); render();
            alert('インポートが完了しました。');
          } catch (err) {
            alert('JSONの読み込みに失敗しました: ' + err.message);
          }
        };
        reader.readAsText(file);
      };
      input.click();
    });
    toolbar?.querySelector('[data-reset]')?.addEventListener('click', () => {
      if (!confirm('全てのドットをデフォルトに戻します(localStorageの編集内容は破棄されます)。よろしいですか?')) return;
      dots = structuredClone(DEFAULTS);
      saveDots(); render(); closeEditForm();
    });

    // Modal close
    modal?.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (modal && !modal.hidden) closeModal();
      else if (editForm && !editForm.hidden) closeEditForm();
    });

    // Apply edit-mode UI state
    if (editMode) {
      document.body.classList.add('is-edit-mode');
      toolbar?.removeAttribute('hidden');
      toolbar?.classList.add('is-active');
      if (noteEl) noteEl.textContent = '編集モード — ドラッグで移動 / クリックで内容編集 / 「ドット追加」で新規作成';
    }

    render();
  })();

  // ---------- Sample Request (mailto-based + admin panel) ----------
  (() => {
    const cfg = window.LINKONE_SAMPLE_CONFIG;
    if (!cfg) return;

    const STORAGE_EMAILS = 'linkone:sample-emails-v1';
    const isJP = () => (document.body.dataset.lang || 'jp') === 'jp';
    const msgEl = document.querySelector('[data-msg]');
    const showMsg = (text, type) => {
      if (!msgEl) return;
      msgEl.textContent = text;
      msgEl.classList.remove('is-success', 'is-error');
      msgEl.classList.add(type === 'error' ? 'is-error' : 'is-success');
      msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      clearTimeout(showMsg._t);
      showMsg._t = setTimeout(() => msgEl.classList.remove('is-success', 'is-error'), 8000);
    };

    // Merge config defaults with admin overrides from localStorage
    function loadCompanies() {
      let overrides = {};
      try {
        overrides = JSON.parse(localStorage.getItem(STORAGE_EMAILS) || '{}') || {};
      } catch { overrides = {}; }
      return cfg.companies.map(c => ({
        ...c,
        email: (overrides[c.id] != null ? overrides[c.id] : c.email) || ''
      }));
    }
    function saveOverrides(map) {
      localStorage.setItem(STORAGE_EMAILS, JSON.stringify(map));
    }
    function clearOverrides() {
      localStorage.removeItem(STORAGE_EMAILS);
    }

    // ----- Render checkbox grid for origins -----
    const grid = document.querySelector('[data-sample-origins]');
    function renderOrigins() {
      if (!grid) return;
      const companies = loadCompanies();
      grid.innerHTML = companies.map(c => {
        const country = `<strong>${c.flagEmoji ? c.flagEmoji + ' ' : ''}<span data-jp>${escHtml(c.country_jp)}</span><span data-en>${escHtml(c.country_en)}</span></strong>`;
        const sub = c.comingSoon
          ? `<small><span data-jp>準備中 — 近日公開</span><span data-en>Coming soon</span></small>`
          : `<small>${escHtml(c.company || '')}</small>`;
        const disabled = c.comingSoon || !c.email ? 'disabled' : '';
        const note = c.comingSoon
          ? ''
          : (!c.email ? `<span class="sample-pick__warn"><span data-jp>送信先未設定</span><span data-en>Email not set</span></span>` : '');
        return `<label class="sample-pick${disabled ? ' is-disabled' : ''}" data-id="${c.id}">
          <input type="checkbox" name="origins" value="${c.id}" ${disabled} />
          <span class="sample-pick__body">
            ${country}
            ${sub}
            ${note}
          </span>
        </label>`;
      }).join('');
    }
    function escHtml(s) {
      return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    // ----- Submit handler: build mailto: link -----
    const form = document.querySelector('[data-form="sample-request"]');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const ids = fd.getAll('origins');
      if (!ids.length) {
        showMsg(isJP() ? '依頼する加盟各社を1つ以上選択してください。' : 'Please select at least one member.', 'error');
        return;
      }
      const required = ['name', 'company', 'phone', 'email', 'postal', 'address'];
      for (const k of required) {
        if (!String(fd.get(k) || '').trim()) {
          showMsg(isJP() ? '必須項目を全てご記入ください。' : 'Please fill in all required fields.', 'error');
          return;
        }
      }
      if (!fd.get('agree')) {
        showMsg(isJP() ? '個人情報の取扱いに同意の上、送信してください。' : 'Please agree to the privacy policy.', 'error');
        return;
      }
      const companies = loadCompanies();
      const selected = ids.map(id => companies.find(c => c.id === id)).filter(Boolean);
      const recipients = selected.map(c => c.email).filter(Boolean);
      if (recipients.length === 0) {
        showMsg(isJP()
          ? '選択された加盟各社のメールアドレスが未設定です。サイト管理者へお問い合わせください。'
          : 'No destination email set for the selected members. Please contact the site admin.', 'error');
        return;
      }

      const subject = `[LinkOne] サンプル依頼 / ${fd.get('company')} 様`;
      const lines = [
        'LinkOne 加盟各社 御中',
        '',
        '下記のとおり、サンプルを依頼させていただきます。',
        '',
        '──────────────────────────',
        `■ ご依頼先: ${selected.map(c => `${c.country_jp} / ${c.company || '(TBD)'}`).join(', ')}`,
        '──────────────────────────',
        '',
        '【ご依頼者様情報】',
        `氏名      : ${fd.get('name')}`,
        `会社・屋号: ${fd.get('company')}`,
        `電話番号  : ${fd.get('phone')}`,
        `メール    : ${fd.get('email')}`,
        `郵便番号  : ${fd.get('postal')}`,
        `住所      : ${fd.get('address')}`,
        '',
        '【備考】',
        String(fd.get('note') || '(なし)'),
        '',
        '──────────────────────────',
        '本メールは LinkOne サイトのサンプル依頼フォームから送信されています。',
        'LinkOne 事務局 (contact@miraiseeds.com) は BCC にて受信しています。',
      ];
      const body = lines.join('\r\n');

      const params = new URLSearchParams();
      params.set('subject', subject);
      params.set('body', body);
      if (cfg.bcc) params.set('bcc', cfg.bcc);
      // RFC 6068: comma-separated `to` list, percent-encoded.
      const to = recipients.map(encodeURIComponent).join(',');
      const href = `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`;

      // Open the user's mail client.
      window.location.href = href;
      showMsg(isJP()
        ? 'メールアプリを起動しました。内容をご確認の上、送信してください。'
        : 'Your email client has opened. Please review and send.', 'success');
    });

    // ----- Admin panel (?admin=1) -----
    const adminEl = document.querySelector('[data-sample-admin]');
    const adminForm = document.querySelector('[data-sample-admin-form]');
    const isAdmin = new URLSearchParams(location.search).has('admin');
    function renderAdmin() {
      if (!adminEl || !adminForm) return;
      const companies = loadCompanies();
      adminForm.innerHTML = companies.map(c => `
        <label class="sample-admin__row">
          <span class="sample-admin__label">${c.flagEmoji || ''} ${escHtml(c.country_jp)} / ${escHtml(c.company || '(TBD)')}${c.comingSoon ? ' <em>(準備中)</em>' : ''}</span>
          <input type="email" name="${c.id}" value="${escHtml(c.email || '')}" placeholder="example@example.com" />
        </label>
      `).join('');
    }
    if (isAdmin && adminEl) {
      adminEl.removeAttribute('hidden');
      renderAdmin();
      adminForm?.addEventListener('input', () => {
        const fd = new FormData(adminForm);
        const map = {};
        for (const c of cfg.companies) {
          const v = String(fd.get(c.id) || '').trim();
          if (v) map[c.id] = v;
        }
        saveOverrides(map);
        renderOrigins();
      });
      document.querySelector('[data-admin-export]')?.addEventListener('click', () => {
        const companies = loadCompanies();
        const out = {
          bcc: cfg.bcc,
          companies: companies.map(c => ({
            id: c.id, country_jp: c.country_jp, country_en: c.country_en,
            company: c.company, comingSoon: !!c.comingSoon, email: c.email
          }))
        };
        const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'linkone-sample-config.json';
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      });
      document.querySelector('[data-admin-reset]')?.addEventListener('click', () => {
        if (!confirm('編集内容を破棄して初期値(sample-config.js)に戻します。よろしいですか?')) return;
        clearOverrides();
        renderAdmin();
        renderOrigins();
      });
    }

    renderOrigins();
  })();
})();
