document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------
     Header: scrolled state
  --------------------------------------------- */
  const header = document.getElementById('header');
  const toggleHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive: true });

  /* ---------------------------------------------
     Mobile nav toggle
  --------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  const closeMobileNav = () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------------------------------------------
     Smooth scroll for in-page nav links
     (CSS scroll-behavior handles the motion;
      JS closes the mobile menu and manages focus)
  --------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      closeMobileNav();

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // move focus for accessibility once the scroll settles
      window.setTimeout(() => {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 600);
    });
  });

  /* ---------------------------------------------
     Active nav link highlighting on scroll
  --------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------------------------------------------
     Scroll-reveal animations
  --------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------------
     Menu category tabs
  --------------------------------------------- */
  const tabs = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      panels.forEach((panel) => {
        const isMatch = panel.id === `panel-${targetId}`;
        panel.classList.toggle('is-active', isMatch);
        panel.hidden = !isMatch;

        if (isMatch) {
          panel.querySelectorAll('[data-reveal]').forEach((el) => {
            el.classList.add('is-visible');
          });
        }
      });
    });
  });

  /* ---------------------------------------------
     Back-to-top button
  --------------------------------------------- */
  const toTop = document.getElementById('to-top');

  const toggleToTop = () => {
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  toggleToTop();
  window.addEventListener('scroll', toggleToTop, { passive: true });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
