const root = document.documentElement;

// Thème : préférence mémorisée, sinon celle du système
try {
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
  else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
} catch (_) {}

document.getElementById('theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (_) {}
});

// Apparition au scroll
const items = document.querySelectorAll('section h2, .card, .project, .job, .edu article, .skills > div, .interests > div, .stats');
items.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.1 });
items.forEach(el => io.observe(el));

// Sections : marque de début, lien actif dans la navigation, progression
const navLinks = [...document.querySelectorAll('.nav nav a')];
const sections = [...document.querySelectorAll('main > section')];
const sectionIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); sectionIO.unobserve(e.target); } });
}, { threshold: 0.05 });
sections.forEach(s => sectionIO.observe(s));

// Section courante : la dernière dont le haut a passé 40 % de la fenêtre (la dernière en bas de page)
let currentId = null;
const updateActive = () => {
  const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
  let current = atBottom ? sections[sections.length - 1] : sections[0];
  if (!atBottom) sections.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * 0.4) current = s; });
  if (current.id === currentId) return;
  currentId = current.id;
  const link = navLinks.find(a => a.getAttribute('href') === '#' + current.id);
  // Sections sans lien (formation, centres d'intérêt) : on garde le lien précédent
  if (link || current.classList.contains('hero')) navLinks.forEach(a => a.classList.toggle('active', a === link));
};

const bar = document.createElement('div');
bar.className = 'progress';
bar.setAttribute('aria-hidden', 'true');
document.body.appendChild(bar);
const updateBar = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ')';
};
addEventListener('scroll', () => { updateBar(); updateActive(); }, { passive: true });
addEventListener('resize', updateActive);
updateBar();
updateActive();

// Cartes de projets dépliables
document.querySelectorAll('.project .toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project');
    const open = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.textContent = open ? btn.dataset.less : btn.dataset.more;
  });
});

// Filtres de projets
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project[data-tags]');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    const tag = btn.dataset.filter;
    filters.forEach(b => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    cards.forEach(card => {
      const show = tag === 'all' || card.dataset.tags.split(' ').includes(tag);
      card.hidden = !show;
      if (show) { card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop'); }
    });
  });
});

// Frise du parcours
const tlItems = document.querySelectorAll('.tl-item');
tlItems.forEach(item => {
  const btn = item.querySelector('.tl-card');
  btn.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});
const tlFilters = document.querySelectorAll('.tl-filter');
tlFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    const t = btn.dataset.tl;
    tlFilters.forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', b === btn);
    });
    tlItems.forEach(item => {
      // l'objectif (stage visé) reste toujours affiché
      item.hidden = !(t === 'all' || item.dataset.type === t || item.dataset.type === 'objectif');
    });
  });
});
