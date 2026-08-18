const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.mobile-menu');

const setNav = () => nav.classList.toggle('solid', window.scrollY > 40);
setNav();
window.addEventListener('scroll', setNav);

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }));
}

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const count = el => {
  const target = parseInt(el.dataset.n, 10);
  const suffix = el.dataset.suffix || '';
  const dur = 1700;
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      count(e.target);
      co.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-n]').forEach(el => co.observe(el));

document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!open) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

const lb = document.querySelector('.lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  const figs = Array.from(document.querySelectorAll('.gallery figure'));
  let i = 0;
  const open = n => {
    i = n;
    lbImg.src = figs[n].querySelector('img').src;
    lb.classList.add('open');
    document.body.classList.add('no-scroll');
  };
  const close = () => {
    lb.classList.remove('open');
    document.body.classList.remove('no-scroll');
  };
  const step = d => {
    i = (i + d + figs.length) % figs.length;
    lbImg.src = figs[i].querySelector('img').src;
  };
  figs.forEach((f, n) => f.addEventListener('click', () => open(n)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
  lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); step(1); });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
}

document.querySelectorAll('.field input, .field textarea').forEach(input => {
  const field = input.closest('.field');
  input.addEventListener('focus', () => field.classList.add('focus'));
  input.addEventListener('blur', () => field.classList.remove('focus'));
});

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    document.querySelector('.form-done').classList.add('show');
  });
}
