(() => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const headerCta = document.querySelector('.header__cta');
  const body = document.body;

  if (!burger || !nav) return;

  const ensureOverlay = () => {
    let overlay = document.querySelector('.menu-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.innerHTML = `
      <div class="menu-overlay__panel" role="dialog" aria-modal="true" aria-label="Меню">
        <button class="menu-overlay__close" type="button" aria-label="Закрыть меню">×</button>
        <nav class="menu-overlay__nav" aria-label="Мобильное меню"></nav>
        <a class="menu-overlay__cta" href="#registration">РЕГИСТРАЦИЯ</a>
      </div>
    `;
    body.appendChild(overlay);
    return overlay;
  };

  const syncLinksToOverlay = (overlay) => {
    const overlayNav = overlay.querySelector('.menu-overlay__nav');
    if (!overlayNav) return;

    const links = [...nav.querySelectorAll('a')].map((a) => a.cloneNode(true));
    overlayNav.replaceChildren(...links);

    const cta = overlay.querySelector('.menu-overlay__cta');
    if (cta && headerCta && headerCta.getAttribute('href')) {
      cta.setAttribute('href', headerCta.getAttribute('href'));
    }

    overlayNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => closeMenu());
    });
    if (cta) cta.addEventListener('click', () => closeMenu());
  };

  let lastActiveEl = null;

  const openMenu = () => {
    const overlay = ensureOverlay();
    syncLinksToOverlay(overlay);

    lastActiveEl = document.activeElement;

    overlay.classList.add('is-open');
    body.classList.add('is-menu-open');
    burger.setAttribute('aria-expanded', 'true');

    const closeBtn = overlay.querySelector('.menu-overlay__close');
    (closeBtn || overlay).focus?.();
  };

  const closeMenu = () => {
    const overlay = document.querySelector('.menu-overlay');
    if (!overlay) return;

    overlay.classList.remove('is-open');
    body.classList.remove('is-menu-open');
    burger.setAttribute('aria-expanded', 'false');

    if (lastActiveEl && typeof lastActiveEl.focus === 'function') {
      lastActiveEl.focus();
    }
  };

  burger.addEventListener('click', () => {
    const overlay = document.querySelector('.menu-overlay');
    const isOpen = overlay?.classList.contains('is-open');
    if (isOpen) closeMenu();
    else openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const overlay = document.querySelector('.menu-overlay');
    if (overlay?.classList.contains('is-open')) closeMenu();
  });

  document.addEventListener('click', (e) => {
    const overlay = document.querySelector('.menu-overlay');
    if (!overlay?.classList.contains('is-open')) return;

    const panel = overlay.querySelector('.menu-overlay__panel');
    if (!panel) return;

    const clickedInsidePanel = panel.contains(e.target);
    const clickedBurger = burger.contains(e.target);

    if (!clickedInsidePanel && !clickedBurger) closeMenu();
  });

  body.addEventListener(
    'click',
    (e) => {
      const closeBtn = e.target.closest?.('.menu-overlay__close');
      if (closeBtn) closeMenu();
    },
    true
  );
})();

