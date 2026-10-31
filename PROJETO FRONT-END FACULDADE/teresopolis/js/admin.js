/* Painel administrativo — protótipo funcional (MVP)
   Toda a persistência é simulada via localStorage (ver js/data.js). */

requireAuth();

const content = document.getElementById('admin-content');
const navLinks = document.querySelectorAll('.admin-nav a[data-view]');
const overlay = document.getElementById('modal-overlay');
const modalCard = document.getElementById('modal-card');

document.getElementById('logout-btn').addEventListener('click', () => {
  logout();
  window.location.href = 'index.html';
});

overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

function openModal(html) {
  modalCard.innerHTML = html;
  overlay.classList.add('is-visible');
}
function closeModal() {
  overlay.classList.remove('is-visible');
  modalCard.innerHTML = '';
}

function setActiveNav(view) {
  navLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.view === view));
}

function router() {
  const view = location.hash.replace('#', '') || 'dashboard';
  setActiveNav(view);
  const renderers = {
    dashboard: renderDashboard,
    parques: renderParksView,
    horarios: renderHoursView,
    eventos: renderEventsView,
    midia: renderMediaView,
    usuarios: renderUsersView,
    configuracoes: renderSettingsView,
  };
  (renderers[view] || renderDashboard)();
}
window.addEventListener('hashchange', router);

/* ==================== DASHBOARD ==================== */

function renderDashboard() {
  const parks = getParks();
  const totalEvents = parks.reduce((sum, p) => sum + p.events.length, 0);
  const hoursConfigured = parks.length * 2; // dias úteis + fim de semana, por parque

  content.innerHTML = `
    <h1>Dashboard</h1>
    <p class="lede">Gerencie as informações dos parques.</p>

    <div class="stat-grid">
      <div class="stat-card tone-a"><div class="num">${parks.length}</div><div class="label">Parques Cadastrados</div></div>
      <div class="stat-card tone-b"><div class="num">${totalEvents}</div><div class="label">Eventos Ativos</div></div>
      <div class="stat-card tone-c"><div class="num">${hoursConfigured}</div><div class="label">Horários Configurados</div></div>
    </div>

    <div class="admin-table-head" style="padding-inline:0; border:none;"><h3>Ações Rápidas</h3></div>
    <div class="quick-grid">
      <a class="quick-action" href="#parques">
        <span class="icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 20l6-16 4 10 3-6 5 12"/></svg></span>
        <span>Gerenciar Parques</span>
      </a>
      <a class="quick-action" href="#horarios">
        <span class="icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg></span>
        <span>Gerenciar Horários</span>
      </a>
      <a class="quick-action" href="#eventos">
        <span class="icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
        <span>Gerenciar Eventos</span>
      </a>
      <a class="quick-action" href="#eventos" id="qa-add-event">
        <span class="icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
        <span>Adicionar Evento</span>
      </a>
    </div>
  `;

  document.getElementById('qa-add-event').addEventListener('click', () => {
    setTimeout(openAddEventModal, 0);
  });
}

/* ==================== PARQUES ==================== */

function renderParksView() {
  const parks = getParks();
  content.innerHTML = `
    <h1>Parques</h1>
    <p class="lede">Atualize o status e as informações públicas de cada parque.</p>
    <div class="admin-table-card">
      <table class="admin-table">
        <thead><tr><th>Parque</th><th>Status</th><th>Descrição curta</th><th>Ações</th></tr></thead>
        <tbody>
          ${parks.map((p) => `
            <tr>
              <td><strong>${p.shortName}</strong></td>
              <td>
                <div class="status-toggle" data-id="${p.id}">
                  <button data-status="aberto" class="${p.status === 'aberto' ? 'is-active is-open' : ''}">Aberto</button>
                  <button data-status="fechado" class="${p.status === 'fechado' ? 'is-active is-closed' : ''}">Fechado</button>
                </div>
              </td>
              <td style="max-width:320px; color:var(--ink-500);">${p.short}</td>
              <td>
                <div class="row-actions">
                  <button class="icon-btn" title="Editar" data-edit="${p.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
                  <a class="icon-btn" title="Ver página" href="parque.html?id=${p.id}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;

  content.querySelectorAll('.status-toggle button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.parentElement.dataset.id;
      updatePark(id, { status: btn.dataset.status });
      showToast('Status do parque atualizado.');
      renderParksView();
    });
  });

  content.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => openEditParkModal(btn.dataset.edit));
  });
}

function openEditParkModal(id) {
  const park = getParkById(id);
  openModal(`
    <h3>Editar ${park.shortName}</h3>
    <form id="edit-park-form">
      <div class="field">
        <label for="ep-short">Descrição curta (aparece nos cards)</label>
        <textarea id="ep-short">${park.short}</textarea>
      </div>
      <div class="field">
        <label for="ep-status">Status</label>
        <select id="ep-status">
          <option value="aberto" ${park.status === 'aberto' ? 'selected' : ''}>Aberto</option>
          <option value="fechado" ${park.status === 'fechado' ? 'selected' : ''}>Fechado</option>
        </select>
      </div>
      <div class="field">
        <label for="ep-note">Aviso (exibido em vermelho quando fechado)</label>
        <textarea id="ep-note" placeholder="Ex: Fechado para manutenção das trilhas.">${park.statusNote || ''}</textarea>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline btn-block" id="ep-cancel">Cancelar</button>
        <button type="submit" class="btn btn-primary btn-block">Salvar alterações</button>
      </div>
    </form>
  `);
  document.getElementById('ep-cancel').addEventListener('click', closeModal);
  document.getElementById('edit-park-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updatePark(id, {
      short: document.getElementById('ep-short').value.trim(),
      status: document.getElementById('ep-status').value,
      statusNote: document.getElementById('ep-note').value.trim(),
    });
    closeModal();
    showToast('Parque atualizado com sucesso.');
    renderParksView();
  });
}

/* ==================== HORÁRIOS ==================== */

function renderHoursView() {
  const parks = getParks();
  content.innerHTML = `
    <h1>Horários</h1>
    <p class="lede">Defina os horários de funcionamento de cada parque.</p>
    <div style="display:flex; flex-direction:column; gap:16px;">
      ${parks.map((p) => `
        <div class="admin-card" data-hours-id="${p.id}">
          <h3 style="font-family:var(--font-body); font-size:1rem; margin-bottom:16px;">${p.shortName}</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div class="field mt-0">
              <label>Segunda a sexta</label>
              <input type="text" class="h-weekdays" value="${p.hours.weekdays}">
            </div>
            <div class="field mt-0">
              <label>Sábados, domingos e feriados</label>
              <input type="text" class="h-weekend" value="${p.hours.weekend}">
            </div>
          </div>
          <div class="field">
            <label>Observação</label>
            <input type="text" class="h-note" value="${p.hours.note}">
          </div>
          <button class="btn btn-primary btn-sm h-save">Salvar horário</button>
        </div>
      `).join('')}
    </div>
  `;

  content.querySelectorAll('[data-hours-id]').forEach((card) => {
    card.querySelector('.h-save').addEventListener('click', () => {
      const id = card.dataset.hoursId;
      updatePark(id, {
        hours: {
          weekdays: card.querySelector('.h-weekdays').value.trim(),
          weekend: card.querySelector('.h-weekend').value.trim(),
          note: card.querySelector('.h-note').value.trim(),
        },
      });
      showToast('Horário salvo.');
    });
  });
}

/* ==================== EVENTOS ==================== */

function renderEventsView() {
  const parks = getParks();
  const rows = parks.flatMap((p) => p.events.map((ev, idx) => ({ ...ev, parkId: p.id, parkName: p.shortName, idx })));
  rows.sort((a, b) => a.date.localeCompare(b.date));

  content.innerHTML = `
    <h1>Eventos</h1>
    <p class="lede">Cadastre e gerencie os eventos de cada parque.</p>
    <div class="admin-table-card">
      <div class="admin-table-head">
        <h3>Todos os eventos</h3>
        <button class="btn btn-primary btn-sm" id="btn-add-event">+ Adicionar Evento</button>
      </div>
      ${rows.length ? `
      <table class="admin-table">
        <thead><tr><th>Evento</th><th>Parque</th><th>Data</th><th>Horário</th><th>Ações</th></tr></thead>
        <tbody>
          ${rows.map((ev) => `
            <tr>
              <td><strong>${ev.title}</strong></td>
              <td>${ev.parkName}</td>
              <td>${formatDate(ev.date)}</td>
              <td>${ev.time}</td>
              <td>
                <div class="row-actions">
                  <button class="icon-btn danger" title="Remover" data-remove-park="${ev.parkId}" data-remove-idx="${ev.idx}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>` : '<p class="empty-note">Nenhum evento cadastrado ainda.</p>'}
    </div>
  `;

  document.getElementById('btn-add-event').addEventListener('click', openAddEventModal);
  content.querySelectorAll('[data-remove-park]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeEvent(btn.dataset.removePark, Number(btn.dataset.removeIdx));
      showToast('Evento removido.');
      renderEventsView();
    });
  });
}

function openAddEventModal() {
  const parks = getParks();
  openModal(`
    <h3>Adicionar evento</h3>
    <form id="add-event-form">
      <div class="field">
        <label for="ae-park">Parque</label>
        <select id="ae-park">${parks.map((p) => `<option value="${p.id}">${p.shortName}</option>`).join('')}</select>
      </div>
      <div class="field">
        <label for="ae-title">Nome do evento</label>
        <input type="text" id="ae-title" required placeholder="Ex: Trilha Guiada">
      </div>
      <div class="field">
        <label for="ae-date">Data</label>
        <input type="date" id="ae-date" required>
      </div>
      <div class="field">
        <label for="ae-time">Horário</label>
        <input type="text" id="ae-time" required placeholder="Ex: 08h">
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline btn-block" id="ae-cancel">Cancelar</button>
        <button type="submit" class="btn btn-primary btn-block">Adicionar</button>
      </div>
    </form>
  `);
  document.getElementById('ae-cancel').addEventListener('click', closeModal);
  document.getElementById('add-event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    addEvent(document.getElementById('ae-park').value, {
      title: document.getElementById('ae-title').value.trim(),
      date: document.getElementById('ae-date').value,
      time: document.getElementById('ae-time').value.trim(),
    });
    closeModal();
    showToast('Evento adicionado.');
    location.hash = '#eventos';
    renderEventsView();
  });
}

/* ==================== MÍDIA ==================== */

function renderMediaView() {
  const parks = getParks();
  content.innerHTML = `
    <h1>Mídia</h1>
    <p class="lede">Fotos exibidas na galeria de cada parque. Upload de novas imagens chega em uma próxima atualização.</p>
    ${parks.map((p) => `
      <div class="admin-card" style="margin-bottom:16px;">
        <h3 style="font-family:var(--font-body); font-size:1rem; margin-bottom:14px;">${p.shortName}</h3>
        <div class="gallery-grid">${p.gallery.map((src) => `<img src="${src}" alt="">`).join('')}</div>
      </div>
    `).join('')}
  `;
}

/* ==================== USUÁRIOS ==================== */

function renderUsersView() {
  content.innerHTML = `
    <h1>Usuários</h1>
    <p class="lede">Colaboradores com acesso ao painel administrativo.</p>
    <div class="admin-table-card">
      <table class="admin-table">
        <thead><tr><th>Usuário</th><th>Função</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td><strong>admin</strong></td><td>Administrador geral</td><td><span class="chip status-aberta">Ativo</span></td></tr>
        </tbody>
      </table>
    </div>
    <p class="form-note" style="margin-top:14px;">O convite de novos colaboradores estará disponível em uma próxima atualização.</p>
  `;
}

/* ==================== CONFIGURAÇÕES ==================== */

function renderSettingsView() {
  content.innerHTML = `
    <h1>Configurações</h1>
    <p class="lede">Preferências gerais do painel administrativo.</p>
    <div class="admin-card" style="max-width:480px;">
      <h3 style="font-family:var(--font-body); font-size:1rem; margin-bottom:6px;">Dados de demonstração</h3>
      <p style="color:var(--ink-500); font-size:0.9rem; margin-bottom:16px;">Este é um protótipo (MVP): todas as alterações ficam salvas apenas neste navegador, via localStorage.</p>
      <button class="btn btn-outline" id="btn-reset">Restaurar dados padrão</button>
    </div>
  `;
  document.getElementById('btn-reset').addEventListener('click', () => {
    resetParksData();
    showToast('Dados restaurados para o padrão.');
  });
}

router();
