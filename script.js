/* ===== LinkOne LP scripts ===== */
(() => {
  'use strict';

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

    const STORAGE = 'linkone:origin-dots';
    const DEFAULTS = [
      { id: 'colombia',  x: 30,   y: 50, color: '#F4B836', label: 'Colombia',   bottomLayer: true,
        title: 'コロンビア', description: '対応準備中。お問い合わせは Sample Request よりご連絡ください。',
        linkUrl: '#sample', imageUrl: '' },
      { id: 'costarica', x: 21,   y: 44, color: '#2DA890', label: 'Costa Rica', bottomLayer: false,
        title: 'コスタリカ', description: 'PuraVida — コスタリカ専門商社が扱う産地です。',
        linkUrl: '#members', imageUrl: '' },
      { id: 'panama',    x: 25.5, y: 47, color: '#E94E2D', label: 'Panama',     bottomLayer: false,
        title: 'パナマ', description: 'Brisa and Tierra — パナマ専門商社が扱う産地です。',
        linkUrl: '#members', imageUrl: '' },
      { id: 'brazil',    x: 36,   y: 60, color: '#8AC53F', label: 'Brazil',     bottomLayer: false,
        title: 'ブラジル', description: 'Mirai Seeds — グアリロバ農園オフィシャルパートナーが扱う産地です。',
        linkUrl: '#members', imageUrl: '' },
      { id: 'taiwan',    x: 83.5, y: 37, color: '#F4B836', label: 'Taiwan',     bottomLayer: false,
        title: '台湾', description: 'ORIOWL 株式会社 — 台湾珈琲専門商社が扱う産地です。',
        linkUrl: '#members', imageUrl: '' },
      { id: 'indonesia', x: 81,   y: 53, color: '#2DA890', label: 'Indonesia',  bottomLayer: false,
        title: 'インドネシア', description: 'Rational Idea — Asosiasi Kopi Indonesia 日本総代理店が扱う産地です。',
        linkUrl: '#members', imageUrl: '' },
    ];

    const editMode = new URLSearchParams(location.search).has('edit');
    let dots = loadDots();
    let editingId = null;
    let addMode = false;
    let dragId = null;

    function uid() { return 'dot_' + Math.random().toString(36).slice(2, 9); }
    function loadDots() {
      try {
        const raw = localStorage.getItem(STORAGE);
        if (!raw) return structuredClone(DEFAULTS);
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length ? parsed : structuredClone(DEFAULTS);
      } catch { return structuredClone(DEFAULTS); }
    }
    function saveDots() { localStorage.setItem(STORAGE, JSON.stringify(dots)); }
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

  // ---------- Auth tabs ----------
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.toggle('is-active', t === tab));
      const target = tab.dataset.tab;
      forms.forEach(f => f.classList.toggle('is-active', f.dataset.form === target));
    });
  });

  // ---------- "User registration" demo (localStorage) ----------
  const STORAGE_USERS = 'linkone:users';
  const STORAGE_SESSION = 'linkone:session';
  const STORAGE_REQUESTS = 'linkone:sample-requests';

  const loadUsers = () => JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
  const saveUsers = u => localStorage.setItem(STORAGE_USERS, JSON.stringify(u));
  const loadSession = () => JSON.parse(localStorage.getItem(STORAGE_SESSION) || 'null');
  const saveSession = s => localStorage.setItem(STORAGE_SESSION, JSON.stringify(s));
  const clearSession = () => localStorage.removeItem(STORAGE_SESSION);

  const msgEl = document.querySelector('[data-msg]');
  const samplePanel = document.querySelector('[data-sample-panel]');
  const userNameEl = document.querySelector('[data-user-name]');
  const userCompanyEl = document.querySelector('[data-user-company]');

  function showMsg(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.classList.remove('is-success', 'is-error');
    msgEl.classList.add(type === 'error' ? 'is-error' : 'is-success');
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    clearTimeout(showMsg._t);
    showMsg._t = setTimeout(() => msgEl.classList.remove('is-success','is-error'), 6000);
  }

  function reflectSession() {
    const session = loadSession();
    const tabsEl = document.querySelector('.auth-tabs');
    if (session) {
      tabsEl?.setAttribute('hidden', '');
      forms.forEach(f => f.classList.remove('is-active'));
      samplePanel.removeAttribute('hidden');
      userNameEl.textContent = session.name;
      userCompanyEl.textContent = session.company;
    } else {
      tabsEl?.removeAttribute('hidden');
      samplePanel.setAttribute('hidden', '');
    }
  }

  // Register
  const registerForm = document.querySelector('[data-form="register"]');
  registerForm?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(registerForm).entries());
    if (data.password !== data.passwordConfirm) {
      showMsg('パスワードが一致しません。', 'error');
      return;
    }
    const users = loadUsers();
    if (users.some(u => u.email === data.email)) {
      showMsg('このメールアドレスは既に登録されています。', 'error');
      return;
    }
    // NOTE: This is a demo. In production, hash passwords on a server. Never store plaintext.
    const user = {
      name: data.name,
      company: data.company,
      address: data.address,
      phone: data.phone,
      email: data.email,
      password: data.password, // demo only
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    saveUsers(users);
    saveSession({ email: user.email, name: user.name, company: user.company });
    registerForm.reset();
    showMsg('登録が完了しました。続けてサンプル依頼へお進みください。', 'success');
    reflectSession();
  });

  // Login
  const loginForm = document.querySelector('[data-form="login"]');
  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    const user = loadUsers().find(u => u.email === data.email && u.password === data.password);
    if (!user) {
      showMsg('メールアドレスまたはパスワードが違います。', 'error');
      return;
    }
    saveSession({ email: user.email, name: user.name, company: user.company });
    loginForm.reset();
    showMsg(`${user.name} さん、ログインしました。`, 'success');
    reflectSession();
  });

  // Logout
  document.querySelector('[data-logout]')?.addEventListener('click', () => {
    clearSession();
    showMsg('ログアウトしました。', 'success');
    reflectSession();
  });

  // Sample request
  const sampleForm = document.querySelector('[data-form="sample"]');
  sampleForm?.addEventListener('submit', e => {
    e.preventDefault();
    const session = loadSession();
    if (!session) { showMsg('ログインが必要です。', 'error'); return; }
    const fd = new FormData(sampleForm);
    const origins = fd.getAll('origins');
    if (origins.length === 0) { showMsg('依頼するサンプルを1つ以上選択してください。', 'error'); return; }
    const note = fd.get('note') || '';
    const reqs = JSON.parse(localStorage.getItem(STORAGE_REQUESTS) || '[]');
    reqs.push({
      user: session,
      origins,
      note,
      requestedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_REQUESTS, JSON.stringify(reqs));
    sampleForm.reset();
    showMsg('サンプル依頼を受け付けました。担当者よりご連絡いたします。', 'success');
  });

  reflectSession();
})();
