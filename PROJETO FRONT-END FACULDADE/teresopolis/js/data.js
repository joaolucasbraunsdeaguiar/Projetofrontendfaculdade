/* ============================================================
   Teresópolis · Parques — Camada de dados
   Fonte única da verdade para os parques, mesclando os dados
   padrão com qualquer alteração salva pelo painel ADM no
   localStorage (chave: teresopolis:parks).
   ============================================================ */

const IMG = {
  peakSunrise: 'https://images.unsplash.com/photo-1755371033904-21dd8a9d002b',
  mountainRange: 'https://images.unsplash.com/photo-1558180348-506ab49a5912',
  waterfall: 'https://images.unsplash.com/photo-1705442199402-38525463819a',
  forestTrail: 'https://images.unsplash.com/photo-1780840883375-ed284c0831e3',
};

function img(key, w, h) {
  return `${IMG[key]}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

const STORAGE_KEYS = {
  parks: 'teresopolis:parks',
  session: 'teresopolis:session',
};

const DEFAULT_PARKS = [
  {
    id: 'serra-dos-orgaos',
    name: 'Parque Nacional da Serra dos Órgãos',
    shortName: 'Serra dos Órgãos',
    short: 'Um dos mais importantes parques do Brasil, com trilhas, picos e paisagens inesquecíveis.',
    tagline: 'Natureza exuberante e aventuras inesquecíveis.',
    description: 'Criado em 1939, o parque protege uma área de Mata Atlântica de incrível biodiversidade, com trilhas para todos os níveis e paisagens de tirar o fôlego. É aqui que fica o Dedo de Deus, um dos cartões-postais mais conhecidos do Brasil, além da travessia para a Pedra do Sino, um clássico do montanhismo nacional.',
    heroImage: img('peakSunrise', 1600, 900),
    cardImage: img('peakSunrise', 700, 500),
    gallery: [img('mountainRange', 500, 380), img('forestTrail', 500, 380), img('peakSunrise', 500, 380), img('waterfall', 500, 380)],
    founded: 1939,
    area: '20.024 hectares',
    location: 'Teresópolis - RJ',
    biome: 'Mata Atlântica',
    status: 'aberto',
    statusNote: '',
    hours: { weekdays: '08h às 17h', weekend: '08h às 17h', note: 'Entrada permitida até às 15h' },
    howToGet: 'Acesso pela Rodovia BR-116, sede administrativa no centro de Teresópolis (Alto). Estacionamento pago disponível na portaria.',
    trails: [
      { name: 'Trilha do Dedo de Deus', difficulty: 'Difícil', duration: '6h', distance: '9 km', status: 'aberta' },
      { name: 'Travessia Pedra do Sino', difficulty: 'Difícil', duration: '2 dias', distance: '14 km', status: 'aberta' },
      { name: 'Trilha do Rancho Frio', difficulty: 'Fácil', duration: '1h30', distance: '3 km', status: 'manutenção', statusNote: 'Ponte da Cachoeira do Imbuí em reparo até 30/09.' },
    ],
    events: [
      { title: 'Trilha Guiada - Brejal', date: '2026-08-25', time: '08h' },
      { title: 'Observação de Aves', date: '2026-09-06', time: '07h' },
    ],
  },
  {
    id: 'tres-picos',
    name: 'Parque Estadual dos Três Picos',
    shortName: 'Três Picos',
    short: 'O maior parque estadual do RJ, com o Pico das Agulhas Negras, o ponto mais alto do estado.',
    tagline: 'O teto do Rio de Janeiro, entre picos e nuvens.',
    description: 'O maior parque estadual do Rio de Janeiro protege remanescentes contínuos de Mata Atlântica entre quatro municípios. Reúne alguns dos picos mais altos do estado e trilhas técnicas de montanhismo, além de nascentes que abastecem boa parte da região serrana.',
    heroImage: img('mountainRange', 1600, 900),
    cardImage: img('mountainRange', 700, 500),
    gallery: [img('peakSunrise', 500, 380), img('mountainRange', 500, 380), img('forestTrail', 500, 380), img('waterfall', 500, 380)],
    founded: 1986,
    area: '46.350 hectares',
    location: 'Teresópolis, Cachoeiras de Macacu, Nova Friburgo e Guapimirim - RJ',
    biome: 'Mata Atlântica',
    status: 'aberto',
    statusNote: '',
    hours: { weekdays: '07h às 16h', weekend: '07h às 16h', note: 'Necessário agendamento prévio para trilhas longas' },
    howToGet: 'Principal acesso pelo distrito de Vale das Palmeiras, a cerca de 40 minutos do centro de Teresópolis.',
    trails: [
      { name: 'Pico das Agulhas Negras (via alternativa)', difficulty: 'Difícil', duration: '3 dias', distance: '22 km', status: 'aberta' },
      { name: 'Trilha da Cachoeira das Andorinhas', difficulty: 'Moderada', duration: '3h', distance: '5 km', status: 'aberta' },
      { name: 'Trilha do Mirante do Soberbo', difficulty: 'Fácil', duration: '2h', distance: '4 km', status: 'aberta' },
    ],
    events: [
      { title: 'Curso de Montanhismo Básico', date: '2026-08-30', time: '07h' },
    ],
  },
  {
    id: 'montanhas-de-teresopolis',
    name: 'Parque Natural Municipal Montanhas de Teresópolis',
    shortName: 'Montanhas de Teresópolis',
    short: 'Área de preservação com trilhas leves, cachoeiras e contato direto com a natureza, pertinho da cidade.',
    tagline: 'Cachoeiras e trilhas leves a poucos minutos do centro.',
    description: 'Pensado para toda a família, este parque municipal reúne trilhas curtas e bem sinalizadas, cachoeiras de fácil acesso e áreas de piquenique, sendo uma ótima porta de entrada para quem está conhecendo a região serrana.',
    heroImage: img('waterfall', 1600, 900),
    cardImage: img('waterfall', 700, 500),
    gallery: [img('waterfall', 500, 380), img('forestTrail', 500, 380), img('mountainRange', 500, 380), img('peakSunrise', 500, 380)],
    founded: 2003,
    area: '850 hectares',
    location: 'Teresópolis - RJ',
    biome: 'Mata Atlântica',
    status: 'fechado',
    statusNote: 'Fechado temporariamente para manutenção das passarelas após as últimas chuvas.',
    hours: { weekdays: '08h às 17h', weekend: '08h às 18h', note: 'Última entrada 1h antes do fechamento' },
    howToGet: 'Localizado no bairro Várzea, a 10 minutos do centro. Ponto de ônibus na entrada principal.',
    trails: [
      { name: 'Trilha da Cachoeira Véu de Noiva', difficulty: 'Fácil', duration: '45min', distance: '1,5 km', status: 'manutenção', statusNote: 'Passarela de acesso em manutenção.' },
      { name: 'Circuito das Bromélias', difficulty: 'Fácil', duration: '1h', distance: '2 km', status: 'aberta' },
    ],
    events: [
      { title: 'Oficina de Educação Ambiental', date: '2026-09-12', time: '09h' },
    ],
  },
];

/** Lê os parques do localStorage, mesclando com os padrões. */
function getParks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.parks);
    if (!raw) return structuredClone(DEFAULT_PARKS);
    const saved = JSON.parse(raw);
    // Mescla por id para tolerar novos campos adicionados aos padrões
    return DEFAULT_PARKS.map((def) => {
      const override = saved.find((p) => p.id === def.id);
      return override ? { ...def, ...override } : def;
    });
  } catch (e) {
    console.error('Erro ao ler parques do armazenamento local', e);
    return structuredClone(DEFAULT_PARKS);
  }
}

function saveParks(parks) {
  localStorage.setItem(STORAGE_KEYS.parks, JSON.stringify(parks));
}

function getParkById(id) {
  return getParks().find((p) => p.id === id);
}

function updatePark(id, patch) {
  const parks = getParks();
  const idx = parks.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  parks[idx] = { ...parks[idx], ...patch };
  saveParks(parks);
  return parks[idx];
}

function addEvent(parkId, event) {
  const parks = getParks();
  const idx = parks.findIndex((p) => p.id === parkId);
  if (idx === -1) return null;
  parks[idx].events = [...(parks[idx].events || []), event];
  saveParks(parks);
  return parks[idx];
}

function removeEvent(parkId, eventIndex) {
  const parks = getParks();
  const idx = parks.findIndex((p) => p.id === parkId);
  if (idx === -1) return null;
  parks[idx].events.splice(eventIndex, 1);
  saveParks(parks);
  return parks[idx];
}

function resetParksData() {
  localStorage.removeItem(STORAGE_KEYS.parks);
}

/* ---------------- Sessão de administrador ---------------- */

const ADMIN_CREDENTIALS = { user: 'admin', pass: 'teresopolis2026' };

function login(user, pass) {
  if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ user, at: Date.now() }));
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function isLoggedIn() {
  return !!localStorage.getItem(STORAGE_KEYS.session);
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

/* ---------------- Utilidades ---------------- */

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
