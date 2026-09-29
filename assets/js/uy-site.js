(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-navigation');
  if (!toggle || !nav) return;

  const outside = [document.querySelector('main'), document.querySelector('footer'), document.querySelector('.uy-whatsapp-float')].filter(Boolean);
  const mobile = window.matchMedia('(max-width: 1024px)');
  const links = [...nav.querySelectorAll('a')];
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function setOutsideInert(value) {
    outside.forEach(element => { element.inert = value; });
  }

  function closeMenu(restoreFocus = false) {
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    setOutsideInert(false);
    if (restoreFocus) toggle.focus();
  }

  function openMenu() {
    nav.classList.add('is-open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    setOutsideInert(true);
    links[0].focus();
  }

  toggle.addEventListener('click', () => (isOpen() ? closeMenu(true) : openMenu()));

  links.forEach(link => link.addEventListener('click', () => {
    const wasOpen = isOpen();
    closeMenu();
    const samePage = link.pathname === window.location.pathname && link.hash;
    const target = samePage ? document.querySelector(link.hash) : null;
    if (wasOpen && target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }));

  document.addEventListener('click', event => {
    if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu(true);
  });

  document.addEventListener('keydown', event => {
    if (!isOpen()) return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const controls = [...links, toggle];
      const index = controls.indexOf(document.activeElement);
      event.preventDefault();
      controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
    }
  });

  mobile.addEventListener('change', () => {
    const focusWillBeHidden = nav.contains(document.activeElement) || document.activeElement === toggle;
    closeMenu();
    if (focusWillBeHidden) document.querySelector('.header .brand').focus();
  });
})();
