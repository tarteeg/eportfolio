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
