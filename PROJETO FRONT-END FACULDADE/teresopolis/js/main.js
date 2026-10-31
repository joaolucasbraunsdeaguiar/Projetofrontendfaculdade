/* Comportamentos compartilhados por todas as páginas públicas */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});

/** Mostra um toast simples no canto da tela (usado no painel ADM). */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function difficultyChipClass(difficulty) {
  const d = difficulty.toLowerCase();
  if (d.includes('fácil')) return 'is-easy';
  if (d.includes('moder')) return 'is-mod';
  return 'is-hard';
}

function statusChipClass(status) {
  return status === 'aberta' ? 'status-aberta' : 'status-manutencao';
}

function statusLabel(status) {
  return status === 'aberta' ? 'Aberta' : 'Em manutenção';
}
