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
