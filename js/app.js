// App shell + estado + render das 8 seções.
// Vanilla JS, sem framework/build step — cada mudança de estado re-renderiza a seção ativa.
// Fonte de verdade para comportamento: design-reference/HANDOFF.md
'use strict';

// ---------------------------------------------------------------- estado
const state = {
  theme: localStorage.getItem('ev-theme') || 'light',
  section: (location.hash || '#overview').replace('#', '') || 'overview',
  search: '',
  filters: { marcas: [], sortBy: 'liquido', sortDir: 'asc' },
  compareSelected: [],
  drawerId: null,
  carouselIdx: {},
  glossarySearch: '',
  glossaryCategory: null,
  premissas: Object.assign({}, PREMISSAS_DEFAULT),
  chartSegmentsOff: {},
  sensRefId: 'ex2_max',
  sensLinesOff: {},
  includeRevenda: true,
  compareExpanded: true,
  financing: { selectedIds: ['ora03'], entradaPct: 60, prazoMeses: 24, bonusAlt: 20000, taxaRecusa: 1.46 },
  context: { papel: 'segundo', idade: '18-25', recarga: 'publica' }
};
state.premissas.seguroAno1 = AGE_BASE[state.context.idade] * ROLE_MULT[state.context.papel];

const SEGMENT_COLORS = { preco: 'var(--color-neutral-500)', energia: 'var(--color-accent)', combustivel: '#c98a12', seguro: '#1a6ed8', manutencao: '#7c4dbf', revenda: '#1a9e6b' };
const SEGMENT_LABELS = { preco: 'Preço', energia: 'Energia', combustivel: 'Combustível', seguro: 'Seguro', manutencao: 'Manutenção', revenda: 'Revenda (recuperado)' };

// ---------------------------------------------------------------- helpers
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function findV(id) { return VEICULOS.find(v => v.id === id); }
function glossaryTerm(termo) { return GLOSSARY_TERMS.find(g => g.termo === termo); }

function tip(termo, label) {
  const g = glossaryTerm(termo);
  if (!g) return esc(label);
  return `<span class="ev-tip">${esc(label)}<span class="ev-tip-pop">${esc(g.definicao)}<br><a class="gloss-link" href="#glossary" onclick="App.gotoGlossary('${esc(termo)}');return false;">Ver no glossário →</a></span></span>`;
}

function typeTag(tipo) {
  return `<span class="tag tag-accent">${tipo}</span>`;
}
function origemTag(origem) {
  return `<span class="tag tag-outline">${esc(origem)}</span>`;
}

function computedList(overridePremissas, includeRevenda) {
  return computeAll(VEICULOS, overridePremissas || state.premissas, includeRevenda != null ? includeRevenda : state.includeRevenda);
}
function withIndices(list) {
  const idx = computeIndices(list);
  return list.map(v => Object.assign({}, v, { indice: idx[v.id] }));
}

// ---------------------------------------------------------------- ícones
const ICONS = {
  chevronLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg>`,
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"></path></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"></path></svg>`,
  doc: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 12h7M9 16h7"></path></svg>`,
  yt: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14"></rect><path d="M10 9l6 3-6 3z" fill="currentColor" stroke="none"></path></svg>`,
  ext: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7M21 3l-9 9M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"></path></svg>`
};

// ---------------------------------------------------------------- carrossel
function carousel(vehicleId, size) {
  const fotos = (FOTOS[vehicleId] || []).filter(Boolean);
  if (!fotos.length) return `<div class="carousel"></div>`;
  const idx = ((state.carouselIdx[vehicleId] || 0) % fotos.length + fotos.length) % fotos.length;
  return `<div class="carousel">
    <img src="${esc(fotos[idx])}" alt="Foto ${idx + 1} de ${esc(findV(vehicleId).nome)}" loading="lazy" onerror="this.style.opacity=0.15">
    ${fotos.length > 1 ? `
    <button class="arrow left" title="Foto anterior" onclick="App.carouselNav('${vehicleId}',-1)">${ICONS.chevronLeft}</button>
    <button class="arrow right" title="Próxima foto" onclick="App.carouselNav('${vehicleId}',1)">${ICONS.chevronRight}</button>
    <div class="counter">${idx + 1}/${fotos.length}</div>` : ''}
  </div>`;
}

function iconRow(vehicleId) {
  const yt = YOUTUBE[vehicleId] || [];
  return `<div class="icon-row">
    <button class="btn btn-icon btn-secondary" title="Ficha completa" onclick="App.openDetail('${vehicleId}')">${ICONS.doc}</button>
    <a class="btn btn-icon btn-secondary" title="Vídeo 1" href="${esc(yt[0] || '#')}" target="_blank" rel="noopener noreferrer" style="position:relative">${ICONS.yt}<span class="tag tag-accent" style="position:absolute;top:-6px;right:-6px;padding:0 4px;font-size:9px">1</span></a>
    <a class="btn btn-icon btn-secondary" title="Vídeo 2" href="${esc(yt[1] || '#')}" target="_blank" rel="noopener noreferrer" style="position:relative">${ICONS.yt}<span class="tag tag-accent" style="position:absolute;top:-6px;right:-6px;padding:0 4px;font-size:9px">2</span></a>
  </div>`;
}

// ---------------------------------------------------------------- shell (sidebar / tabbar / topbar)
function renderShellNav(active) {
  return NAV_DEFS.map(n => `<button class="nav-item${n.id === active ? ' active' : ''}" onclick="App.setSection('${n.id}')">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${n.iconD}"></path></svg>
    <span>${esc(n.label)}</span>
  </button>`).join('');
}

function renderSidebar() {
  document.getElementById('sidebar').innerHTML = `
    <div class="brand">Dashboard Compras EV BEV e PHEV Brasil</div>
    <nav>${renderShellNav(state.section)}</nav>
    <div style="padding:14px 20px;border-top:2px solid var(--color-divider);font-size:11px;color:var(--color-text-muted)">16 modelos · TCO 5 anos</div>
  `;
  document.getElementById('tabbar').innerHTML = renderShellNav(state.section);
}

function renderTopbar() {
  document.getElementById('topbar').innerHTML = `
    <div class="searchbox">
      <input id="fld-globalsearch" class="input" placeholder="Buscar modelo, marca ou termo…" value="${esc(state.search)}" oninput="App.setGlobalSearch(this.value)">
    </div>
    <div class="spacer" style="flex:1"></div>
    <button class="tag ${state.includeRevenda ? 'tag-accent' : 'tag-outline'}" style="cursor:pointer" onclick="App.toggleIncludeRevenda()" title="Incluir ou remover a revenda projetada do custo líquido">
      ${state.includeRevenda ? '✓ ' : ''}Revenda no custo
    </button>
    <button class="btn btn-icon btn-secondary" onclick="App.toggleTheme()" title="Alternar tema">
      ${state.theme === 'dark' ? ICONS.sun : ICONS.moon}
    </button>
  `;
}

// ---------------------------------------------------------------- 1. Visão geral
function renderOverview() {
  const list = withIndices(computedList());
  const ranking = [...list].sort((a, b) => a.liquido - b.liquido);
  const top4 = [...list].sort((a, b) => b.indice - a.indice).slice(0, 4);

  const phevSemCarga = VEICULOS.filter(v => v.tipo === 'PHEV');
  const alertHtml = phevSemCarga.length ? `<div class="alert-card">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a1.5 1.5 0 0 0 1.3 2.3h17.8a1.5 1.5 0 0 0 1.3-2.3L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z"></path></svg>
      <div>
        <div class="headline">PHEV sem recarga em casa = híbrido comum na prática</div>
        <div class="body-text">${phevSemCarga.map(v => esc(v.nome)).join(', ')} são plug-in: sem tomada/wallbox em casa, o custo real é dominado pelo combustível, não pela eletricidade.</div>
        <button class="btn btn-ghost" onclick="App.setSection('compare')" style="margin-top:6px">Ver comparação</button>
      </div>
    </div>` : '';

  return `
    <div class="section-title">Visão geral</div>
    <div class="section-desc">Ranking dos 16 modelos por custo líquido em 5 anos, segundo suas premissas de uso.</div>

    <div class="card context-strip">
      <div class="context-field">
        <label>Papel do carro</label>
        <select class="input" onchange="App.setContext('papel', this.value)">
          <option value="unico" ${state.context.papel === 'unico' ? 'selected' : ''}>Carro único da família</option>
          <option value="segundo" ${state.context.papel === 'segundo' ? 'selected' : ''}>Segundo carro</option>
          <option value="terceiro" ${state.context.papel === 'terceiro' ? 'selected' : ''}>Terceiro carro ou mais</option>
        </select>
      </div>
      <div class="context-field">
        <label>Idade do condutor</label>
        <select class="input" onchange="App.setContext('idade', this.value)">
          ${['18-25', '26-35', '36-55', '56+'].map(o => `<option value="${o}" ${state.context.idade === o ? 'selected' : ''}>${o} anos</option>`).join('')}
        </select>
      </div>
      <div class="context-field">
        <label>Km/ano</label>
        <select class="input" onchange="App.setPremissa('kmAno', Number(this.value))">
          ${[5000, 9000, 15000, 20000, 30000].map(o => `<option value="${o}" ${state.premissas.kmAno === o ? 'selected' : ''}>${o.toLocaleString('pt-BR')} km</option>`).join('')}
        </select>
      </div>
      <div class="context-field">
        <label>Recarga em casa</label>
        <select class="input" onchange="App.setContext('recarga', this.value)">
          <option value="publica" ${state.context.recarga === 'publica' ? 'selected' : ''}>Sem recarga em casa (rede pública)</option>
          <option value="tomada" ${state.context.recarga === 'tomada' ? 'selected' : ''}>Tomada comum em casa</option>
          <option value="wallbox" ${state.context.recarga === 'wallbox' ? 'selected' : ''}>Wallbox em casa</option>
        </select>
      </div>
      <button class="btn btn-ghost" onclick="App.setSection('simulator')">Ajuste fino no Simulador →</button>
    </div>

    <div class="alert-row">${alertHtml}</div>

    <h3 class="mb-8">Recomendados para você</h3>
    <div class="rec-grid">
      ${top4.map(v => `
        <div class="card rec-card elev-sm">
          ${carousel(v.id)}
          <div class="body">
            <div class="name">${esc(v.nome)}</div>
            <div class="brand">${esc(v.marca)}</div>
            <div class="badges">${typeTag(v.tipo)}${origemTag(v.origem)}</div>
            <div class="cost">${brl(v.liquido)}</div>
            <div class="cost-sub">${brl2(v.rsKm)}/km · índice ${v.indice.toFixed(0)}</div>
            ${iconRow(v.id)}
          </div>
        </div>`).join('')}
    </div>

    <h3 class="mb-8">${tip('TCO', 'Ranking completo')}</h3>
    <div class="rank-list">
      ${ranking.map((v, i) => `
        <div class="rank-row">
          <div class="rank-num">${i + 1}</div>
          <img src="${esc((FOTOS[v.id] || [])[0] || '')}" alt="" loading="lazy" onerror="this.style.opacity=0">
          <div class="name-col">
            <div class="name" style="cursor:pointer" onclick="App.openDetail('${v.id}')">${esc(v.nome)}</div>
            <div class="brand-badges">${esc(v.marca)} ${typeTag(v.tipo)}</div>
          </div>
          <div class="cost-col">
            <div class="cost">${tip('TCO', brl(v.liquido))}</div>
          </div>
          <div class="cost-col"><div class="rskm">${brl2(v.rsKm)}/km</div></div>
        </div>`).join('')}
    </div>
  `;
}

// ---------------------------------------------------------------- 2. Comparar
const COMPARE_COLUMNS = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'preco', label: 'Preço', term: 'Preço de tabela' },
  { key: 'liquido', label: 'Custo líq. 5a', term: 'TCO' },
  { key: 'rsKm', label: 'R$/km', term: 'R$/km' },
  { key: 'rsMes', label: 'R$/mês', term: 'R$/mês' },
  { key: 'autonomia', label: 'Autonomia', term: 'Autonomia' },
  { key: 'consumo', label: 'Consumo', term: 'Consumo' },
  { key: 'portaMalas', label: 'Porta-malas', term: 'Porta-malas' },
  { key: 'airbags', label: 'Airbags', term: 'Airbags' },
  { key: 'latinNcap', label: 'Latin NCAP', term: 'Latin NCAP' },
  { key: 'adas', label: 'ADAS', term: 'ADAS' },
  { key: 'revenda', label: 'Revenda', term: 'Revenda' },
  { key: 'indice', label: 'Índice', term: 'Índice de adequação' }
];

function compareValue(v, key) {
  switch (key) {
    case 'tipo': return v.tipo;
    case 'consumo': return v.tipo === 'BEV' ? v.consumo : (v.kmPorLitro || 0);
    case 'latinNcap': return v.latinNcap;
    case 'adas': return v.adas;
    default: return v[key];
  }
}
function compareDisplay(v, key) {
  switch (key) {
    case 'preco': return brl(v.preco);
    case 'liquido': return brl(v.liquido);
    case 'rsKm': return brl2(v.rsKm);
    case 'rsMes': return brl(v.rsMes);
    case 'autonomia': return v.autonomia.toLocaleString('pt-BR') + ' km';
    case 'consumo': return v.tipo === 'BEV' ? v.consumo.toFixed(1) + ' kWh/100km' : (v.kmPorLitro ? v.kmPorLitro.toFixed(1) + ' km/l' : '—');
    case 'portaMalas': return v.portaMalas + ' L';
    case 'airbags': return String(v.airbags);
    case 'latinNcap': return v.latinNcap;
    case 'adas': return v.adas;
    case 'revenda': return pct(v.residual.base);
    case 'indice': return v.indice.toFixed(0);
    case 'tipo': return v.tipo;
    default: return String(v[key]);
  }
}

function getCompareFiltered() {
  const q = state.search.trim().toLowerCase();
  let list = VEICULOS.filter(v => {
    if (state.filters.marcas.length && !state.filters.marcas.includes(v.marca)) return false;
    if (q && !(v.nome.toLowerCase().includes(q) || v.marca.toLowerCase().includes(q))) return false;
    return true;
  });
  let computed = withIndices(computeAll(list, state.premissas, state.includeRevenda));
  const { sortBy, sortDir } = state.filters;
  computed.sort((a, b) => {
    const av = compareValue(a, sortBy), bv = compareValue(b, sortBy);
    let cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
    return sortDir === 'asc' ? cmp : -cmp;
  });
  return computed;
}

function renderCompare() {
  const marcas = [...new Set(VEICULOS.map(v => v.marca))];
  const list = getCompareFiltered();

  const drawerHtml = state.compareSelected.length ? `
    <div class="compare-drawer${state.compareExpanded ? '' : ' collapsed'}">
      <div class="drawer-head">
        <strong>Comparando ${state.compareSelected.length}/3 modelos</strong>
        <div class="spacer" style="flex:1"></div>
        <button class="btn btn-ghost" onclick="App.toggleCompareExpanded()">${state.compareExpanded ? 'Recolher' : 'Expandir'}</button>
        <button class="btn btn-ghost" onclick="App.clearCompareSelected()">Limpar seleção</button>
      </div>
      <div class="drawer-body">
        ${renderMultiCompareTable()}
      </div>
    </div>` : '';

  return `
    <div class="section-title">Comparar</div>
    <div class="section-desc">Exibindo ${list.length} de ${VEICULOS.length} modelos.</div>

    <div class="filter-bar">
      ${marcas.map(m => `<button class="tag tag-chip${state.filters.marcas.includes(m) ? ' active' : ''}" onclick="App.toggleMarca('${esc(m)}')">${esc(m)}</button>`).join('')}
      <input id="fld-comparesearch" class="input" style="max-width:220px" placeholder="Buscar…" value="${esc(state.search)}" oninput="App.setGlobalSearch(this.value)">
      <button class="btn btn-ghost" onclick="App.clearFilters()">Limpar</button>
      <div class="spacer"></div>
      <div class="result-counter">Exibindo ${list.length} de ${VEICULOS.length} modelos</div>
    </div>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th class="sticky-col">Modelo</th>
            ${COMPARE_COLUMNS.map(c => `<th class="${state.filters.sortBy === c.key ? 'sorted' : ''}" onclick="App.setSort('${c.key}')">${c.term ? tip(c.term, c.label) : esc(c.label)}</th>`).join('')}
            <th>Comparar</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(v => `
            <tr>
              <td class="sticky-col">
                <div class="model-cell" onclick="App.openDetail('${v.id}')">
                  <img src="${esc((FOTOS[v.id] || [])[0] || '')}" alt="" loading="lazy" onerror="this.style.opacity=0">
                  <div><div class="mn">${esc(v.nome)}</div><div class="text-muted small">${esc(v.marca)}</div></div>
                </div>
              </td>
              ${COMPARE_COLUMNS.map(c => `<td>${compareDisplay(v, c.key)}</td>`).join('')}
              <td><input type="checkbox" ${state.compareSelected.includes(v.id) ? 'checked' : ''} ${(!state.compareSelected.includes(v.id) && state.compareSelected.length >= 3) ? 'disabled' : ''} onchange="App.toggleCompareSelected('${v.id}')"></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>

    ${drawerHtml}
  `;
}

function renderMultiCompareTable() {
  const rows = [
    { key: 'tipo', label: 'Tipo' }, { key: 'preco', label: 'Preço', lowerBetter: true },
    { key: 'liquido', label: 'TCO', lowerBetter: true }, { key: 'rsKm', label: 'R$/km', lowerBetter: true },
    { key: 'autonomia', label: 'Autonomia', lowerBetter: false }, { key: 'consumo', label: 'Consumo', lowerBetter: true },
    { key: 'portaMalas', label: 'Porta-malas', lowerBetter: false }, { key: 'airbags', label: 'Airbags', lowerBetter: false },
    { key: 'adas', label: 'ADAS' }, { key: 'revenda', label: 'Revenda', lowerBetter: false }, { key: 'indice', label: 'Índice', lowerBetter: false }
  ];
  const selected = state.compareSelected.map(id => withIndices(computedList()).find(v => v.id === id)).filter(Boolean);
  return `<table class="table">
    <thead><tr><th class="sticky-col">Métrica</th>${selected.map(v => `<th>${esc(v.nome)}</th>`).join('')}</tr></thead>
    <tbody>
      ${rows.map(r => {
        const vals = selected.map(v => compareValue(v, r.key));
        return `<tr><td class="sticky-col">${esc(r.label)}</td>${selected.map((v, i) => {
          let bg = '';
          if (typeof r.lowerBetter === 'boolean' && vals.every(x => typeof x === 'number')) {
            const b = bucketOf(vals[i], vals, r.lowerBetter);
            bg = ` style="background:${['transparent', 'var(--ev-surface-2)', 'var(--color-neutral-200)', 'var(--color-accent-100)', 'var(--color-accent-300)'][b]}"`;
          }
          return `<td${bg}>${compareDisplay(v, r.key)}</td>`;
        }).join('')}</tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

// ---------------------------------------------------------------- Detail drawer (overlay)
function renderDetailDrawer() {
  if (!state.drawerId) return '';
  const v = computeVehicle(findV(state.drawerId), state.premissas, state.includeRevenda);
  const idx = computeIndices(VEICULOS.map(x => computeVehicle(x, state.premissas, state.includeRevenda)))[v.id];
  const isBev = v.tipo === 'BEV';
  return `<div class="detail-overlay" onclick="App.closeDetail()"></div>
  <div class="detail-drawer">
    <div class="dd-head">
      <strong>${esc(v.nome)}</strong>
      <button class="btn btn-icon btn-secondary" onclick="App.closeDetail()">${ICONS.close}</button>
    </div>
    <div class="dd-body">
      ${carousel(v.id)}
      <div class="badges mt-16 mb-16">${typeTag(v.tipo)}${origemTag(v.origem)}</div>
      <table class="mini" style="width:100%;border-collapse:collapse;font-size:12.5px">
        <tr><td class="text-muted">${tip('Autonomia', 'Autonomia')}</td><td class="text-right">${v.autonomia.toLocaleString('pt-BR')} km${v.autonomiaEletrica ? ' (' + v.autonomiaEletrica + ' km só elétrico)' : ''}</td></tr>
        <tr><td class="text-muted">Potência</td><td class="text-right">${v.potencia} cv</td></tr>
        <tr><td class="text-muted">${tip('Porta-malas', 'Porta-malas')}</td><td class="text-right">${v.portaMalas} L${v.portaMalasEstimado ? ' (estimado)' : ''}</td></tr>
      </table>
      <hr class="divider">
      <h4 class="mb-8">Breakdown de custo em ${state.premissas.anos} anos</h4>
      <table class="mini" style="width:100%;border-collapse:collapse;font-size:12.5px">
        <tr><td>Preço</td><td class="text-right">${brl(v.preco)}</td></tr>
        <tr><td>Energia</td><td class="text-right">${brl(v.energia)}</td></tr>
        ${v.combustivel ? `<tr><td>Combustível</td><td class="text-right">${brl(v.combustivel)}</td></tr>` : ''}
        <tr><td>Seguro</td><td class="text-right">${brl(v.seguro)}</td></tr>
        <tr><td>Manutenção</td><td class="text-right">${brl(v.manutencao)}</td></tr>
        ${v.ipva ? `<tr><td>IPVA</td><td class="text-right">${brl(v.ipva)}</td></tr>` : ''}
        <tr><td>Revenda</td><td class="text-right">−${brl(v.revenda)}</td></tr>
        <tr><td><strong>Líquido</strong></td><td class="text-right"><strong>${brl(v.liquido)}</strong></td></tr>
      </table>
      <div class="mt-16">${tip('Índice de adequação', 'Índice de adequação')}: <strong>${idx.toFixed(0)}</strong></div>
      ${v.obsComercial ? `<div class="checklist-caveat mt-8">${esc(v.obsComercial)}</div>` : ''}
      <div class="flex gap-8 mt-16">
        <a class="btn btn-secondary" href="${esc(v.link)}" target="_blank" rel="noopener noreferrer">${ICONS.ext} Página oficial</a>
      </div>
      <div class="mt-8">${iconRow(v.id)}</div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------- 3. Simulador
function renderSimulator() {
  const P = state.premissas;
  const list = [...computedList()].sort((a, b) => a.liquido - b.liquido);
  const maxTotal = Math.max(...list.map(v => v.preco + v.energia + v.combustivel + v.seguro + v.manutencao + v.revenda));
  const segKeys = ['preco', 'energia', 'combustivel', 'seguro', 'manutencao'];

  return `
    <div class="section-title">Simulador</div>
    <div class="section-desc">Ajuste as premissas e veja o custo recalcular ao vivo em todos os modelos.</div>

    <div class="premises-grid">
      <div><label>Km/ano</label><input id="fld-kmAno" class="input" type="number" step="500" value="${P.kmAno}" oninput="App.setPremissa('kmAno', Number(this.value))"></div>
      <div><label>Anos</label><input id="fld-anos" class="input" type="number" min="1" max="10" value="${P.anos}" oninput="App.setPremissa('anos', Number(this.value))"></div>
      <div><label>Preço do kWh (R$)</label><input id="fld-precoKwh" class="input" type="number" step="0.01" value="${P.precoKwh}" oninput="App.setPremissa('precoKwh', Number(this.value))"></div>
      <div><label>Fator perda recarga</label><input id="fld-fatorPerda" class="input" type="number" step="0.01" value="${P.fatorPerda}" oninput="App.setPremissa('fatorPerda', Number(this.value))"></div>
      <div><label>Seguro ano 1 (%)</label><input id="fld-seguroAno1" class="input" type="number" step="0.1" value="${(P.seguroAno1 * 100).toFixed(1)}" oninput="App.setPremissa('seguroAno1', Number(this.value)/100)"></div>
      <div><label>Queda anual do seguro (%)</label><input id="fld-seguroQueda" class="input" type="number" step="0.1" value="${(P.seguroQueda * 100).toFixed(1)}" oninput="App.setPremissa('seguroQueda', Number(this.value)/100)"></div>
      <div><label>Emplacamento (R$)</label><input id="fld-emplacamento" class="input" type="number" step="50" value="${P.emplacamento}" oninput="App.setPremissa('emplacamento', Number(this.value))"></div>
      <div><label>Preço da gasolina (R$/l)</label><input id="fld-precoGasolina" class="input" type="number" step="0.01" value="${P.precoGasolina}" oninput="App.setPremissa('precoGasolina', Number(this.value))"></div>
      <div>
        <label>Cenário de revenda</label>
        <div class="segmented">
          ${['pess', 'base', 'otim'].map(c => `<button class="${P.cenario === c ? 'active' : ''}" onclick="App.setPremissa('cenario','${c}')">${{ pess: 'Pessimista', base: 'Base', otim: 'Otimista' }[c]}</button>`).join('')}
        </div>
      </div>
      <div>
        <label>Incluir revenda</label>
        <button class="tag ${state.includeRevenda ? 'tag-accent' : 'tag-outline'}" style="cursor:pointer" onclick="App.toggleIncludeRevenda()">${state.includeRevenda ? '✓ Incluída' : 'Excluída'}</button>
      </div>
    </div>

    <div class="chart-legend">
      ${segKeys.concat(['revenda']).map(k => `<span class="item ${state.chartSegmentsOff[k] ? 'off' : ''}" onclick="App.toggleSegment('${k}')"><span class="swatch" style="background:${SEGMENT_COLORS[k]}"></span>${SEGMENT_LABELS[k]}</span>`).join('')}
    </div>

    <div class="card" style="padding:16px">
      ${list.map(v => `
        <div class="bar-chart-row">
          <div class="label">${esc(v.nome)}</div>
          <div class="track">${stackedBarRow(
            segKeys.map(k => ({ key: k, label: SEGMENT_LABELS[k], value: v[k], color: SEGMENT_COLORS[k] }))
              .concat(state.includeRevenda ? [{ key: 'revenda', label: SEGMENT_LABELS.revenda, value: v.revenda, color: SEGMENT_COLORS.revenda, outline: true }] : []),
            maxTotal, state.chartSegmentsOff
          )}</div>
          <div class="total">${brl(v.liquido)}</div>
        </div>`).join('')}
    </div>
  `;
}

// ---------------------------------------------------------------- 4. Sensibilidade
function renderSensitivity() {
  const kmTicks = [6000, 9000, 12000, 15000, 18000, 21000, 24000, 27000, 30000];
  const series = VEICULOS.map(v => ({
    id: v.id, name: v.nome, off: !!state.sensLinesOff[v.id],
    values: kmTicks.map(km => computeVehicle(v, Object.assign({}, state.premissas, { kmAno: km }), state.includeRevenda).liquido)
  }));

  const bevModels = VEICULOS.filter(v => v.tipo === 'BEV');
  const avgConsumo = bevModels.reduce((s, v) => s + v.consumo, 0) / bevModels.length;
  const kwhTicks = []; for (let p = 0.80; p <= 3.50 + 1e-9; p += 0.10) kwhTicks.push(Math.round(p * 100) / 100);
  const kmTotalRef = state.premissas.kmAno * state.premissas.anos;
  const energyValues = kwhTicks.map(p => (avgConsumo / 100) * kmTotalRef * state.premissas.fatorPerda * p);
  const markers = [
    { value: 0.85, label: 'Wallbox em casa' },
    { value: +(2.30 * 0.85).toFixed(3), label: 'BYD com desconto Shell' },
    { value: 2.30, label: 'Rede pública (base)' },
    { value: 3.00, label: 'Recarga rápida DC (estimativa)' }
  ];

  const refV = findV(state.sensRefId);
  const refComputed = computeVehicle(refV, state.premissas, state.includeRevenda);
  const breakEvenRows = VEICULOS.filter(v => v.id !== refV.id).map(v => {
    const c = computeVehicle(v, state.premissas, false);
    const gross = c.liquido; // sem revenda subtraída
    const neededRevendaValue = gross - refComputed.liquido;
    const neededPct = neededRevendaValue / v.preco;
    let situacao;
    if (neededPct <= 0) situacao = 'Já vence sem revenda alguma';
    else if (neededPct > 1) situacao = 'Impossível (>100%)';
    else situacao = 'Alcançável';
    return { v, neededPct, situacao };
  });

  return `
    <div class="section-title">Sensibilidade</div>
    <div class="section-desc">Como o custo líquido reage a variações de uso, preço de energia e revenda.</div>

    <h3 class="mb-8">Quilometragem anual × custo líquido em 5 anos</h3>
    <div class="chart-legend">
      ${series.map(s => `<span class="item ${s.off ? 'off' : ''}" onclick="App.toggleSensLine('${s.id}')"><span class="swatch" style="background:${CHART_COLORS[VEICULOS.findIndex(v => v.id === s.id) % CHART_COLORS.length]}"></span>${esc(s.name)}</span>`).join('')}
    </div>
    <div class="card" style="padding:12px">${lineChartMulti({ series, xTicks: kmTicks, xLabel: 'km/ano', yLabel: 'Custo líquido 5 anos', colorOf: (s, i) => CHART_COLORS[VEICULOS.findIndex(v => v.id === s.id) % CHART_COLORS.length] })}</div>

    <h3 class="mt-20 mb-8">Preço da recarga (R$/kWh) × custo de energia em 5 anos</h3>
    <div class="section-desc">Baseline de consumo médio calculado só com os modelos BEV (híbridos usam unidade diferente, km/l).</div>
    <div class="card" style="padding:12px">${areaLineChart({ xValues: kwhTicks, yValues: energyValues, markers })}</div>
    <div class="chart-legend">${markers.map((m, i) => `<span class="item"><span class="swatch" style="background:${CHART_COLORS[(i + 1) % CHART_COLORS.length]}"></span>${esc(m.label)}: R$ ${m.value.toFixed(2)}/kWh</span>`).join('')}</div>

    <h3 class="mt-20 mb-8">Break-even / ponto de virada de revenda</h3>
    <div class="flex gap-8 mb-16" style="align-items:center">
      <label class="small text-muted">Modelo de referência:</label>
      <select class="input" style="max-width:280px" onchange="App.setSensRef(this.value)">
        ${VEICULOS.map(v => `<option value="${v.id}" ${state.sensRefId === v.id ? 'selected' : ''}>${esc(v.nome)}</option>`).join('')}
      </select>
    </div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Modelo</th><th>Preço</th><th>Revenda base atual</th><th>Revenda necessária p/ empatar</th><th>Situação</th></tr></thead>
        <tbody>
          ${breakEvenRows.map(r => `<tr>
            <td>${esc(r.v.nome)}</td><td>${brl(r.v.preco)}</td><td>${pct(r.v.residual.base)}</td>
            <td>${r.neededPct <= 0 ? '—' : pct(Math.min(r.neededPct, 1.5))}</td>
            <td>${esc(r.situacao)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ---------------------------------------------------------------- 5. Ficha técnica
function renderSpec() {
  return `
    <div class="section-title">Ficha técnica</div>
    <div class="section-desc">Especificações completas dos 16 modelos.</div>
    <div class="spec-grid">
      ${VEICULOS.map(v => `
        <div class="card spec-card elev-sm" style="padding:12px">
          ${carousel(v.id)}
          <div class="mt-8"><strong>${esc(v.nome)}</strong> <span class="text-muted small">${esc(v.marca)}</span></div>
          <div class="badges mt-8">${typeTag(v.tipo)}${origemTag(v.origem)}</div>
          <div class="mt-8">${iconRow(v.id)}</div>
          <table class="mini">
            <tr><td>Preço</td><td class="text-right">${brl(v.preco)}</td></tr>
            <tr><td>Comprimento</td><td class="text-right">${v.comprimento} mm</td></tr>
            <tr><td>Entre-eixos</td><td class="text-right">${v.entreEixos} mm</td></tr>
            <tr><td>Porta-malas</td><td class="text-right">${v.portaMalas} L${v.portaMalasEstimado ? '*' : ''}</td></tr>
            <tr><td>Potência</td><td class="text-right">${v.potencia} cv</td></tr>
            <tr><td>Torque</td><td class="text-right">${v.torque} Nm</td></tr>
            <tr><td>0–100 km/h</td><td class="text-right">${v.aceleracao}s</td></tr>
            <tr><td>Tração</td><td class="text-right">${esc(v.tracao)}</td></tr>
            <tr><td>Bateria</td><td class="text-right">${v.bateria} kWh</td></tr>
            <tr><td>Autonomia</td><td class="text-right">${v.autonomia} km${v.autonomiaEletrica ? ' (' + v.autonomiaEletrica + ' km elétrico)' : ''}</td></tr>
            <tr><td>${v.tipo === 'BEV' ? 'Consumo' : 'Consumo combustível'}</td><td class="text-right">${v.tipo === 'BEV' ? v.consumo.toFixed(1) + ' kWh/100km' : (v.kmPorLitro ? v.kmPorLitro.toFixed(1) + ' km/l' + (v.kmPorLitroEstimado ? '*' : '') : '—')}</td></tr>
            <tr><td>Airbags</td><td class="text-right">${v.airbags}${v.airbagsEstimado ? '*' : ''}</td></tr>
            <tr><td>Latin NCAP</td><td class="text-right">${esc(v.latinNcap)}</td></tr>
            <tr><td>ADAS</td><td class="text-right">${esc(v.adas)}</td></tr>
            <tr><td>Câmera</td><td class="text-right">${esc(v.camera)}</td></tr>
            <tr><td>Recarga DC</td><td class="text-right">${esc(v.recargaDC)}</td></tr>
            <tr><td>Teto panorâmico</td><td class="text-right">${v.tetoPan ? 'Sim' : 'Não'}</td></tr>
            <tr><td>V2L</td><td class="text-right">${v.v2l == null ? 'Não informado' : (v.v2l ? 'Sim' : 'Não')}</td></tr>
          </table>
          ${v.obsComercial ? `<div class="checklist-caveat">${esc(v.obsComercial)}</div>` : ''}
        </div>`).join('')}
    </div>
  `;
}

// ---------------------------------------------------------------- 6. Formatos de compra
function renderFinancing() {
  const F = state.financing;
  const selectedVehicles = F.selectedIds.map(findV);

  const rightPanel = selectedVehicles.length === 0 ? `<div class="card" style="padding:20px">Selecione de 1 a 3 modelos à esquerda para ver os resultados.</div>`
    : selectedVehicles.length === 1 ? renderFinancingSingle(selectedVehicles[0], F)
    : renderFinancingMulti(selectedVehicles, F);

  return `
    <div class="section-title">Formatos de compra</div>
    <div class="section-desc">Compare taxa 0% do fabricante contra bônus à vista alternativo.</div>

    <div class="financing-layout">
      <div>
        <div class="model-picker">
          ${VEICULOS.map(v => {
            const checked = F.selectedIds.includes(v.id);
            const disabled = !checked && F.selectedIds.length >= 3;
            return `<label class="${disabled ? 'disabled' : ''}"><input type="checkbox" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} onchange="App.toggleFinancingModel('${v.id}')"> ${esc(v.nome)}</label>`;
          }).join('')}
        </div>
        <div class="small text-muted mt-8">${F.selectedIds.length}/3 selecionados</div>

        <div class="mt-16"><label class="small text-muted">Entrada: ${F.entradaPct}%</label>
          <input id="fld-entradaPct" type="range" min="30" max="90" step="5" value="${F.entradaPct}" style="width:100%" oninput="App.setFinancing('entradaPct', Number(this.value))"></div>

        <div class="mt-16"><label class="small text-muted">Prazo</label>
          <div class="segmented">${[12, 24, 36, 48].map(m => `<button class="${F.prazoMeses === m ? 'active' : ''}" onclick="App.setFinancing('prazoMeses',${m})">${m}m</button>`).join('')}</div>
        </div>

        <div class="mt-16"><label class="small text-muted">Bônus à vista alternativo (R$)</label>
          <input id="fld-bonusAlt" class="input" type="number" min="0" value="${F.bonusAlt}" oninput="App.setFinancing('bonusAlt', Number(this.value))"></div>

        <div class="mt-16"><label class="small text-muted">Taxa se recusar o 0% (%/mês)</label>
          <input id="fld-taxaRecusa" class="input" type="number" step="0.01" value="${F.taxaRecusa}" oninput="App.setFinancing('taxaRecusa', Number(this.value))"></div>

        <div class="flex gap-8 mt-16">
          <button class="tag tag-chip" onclick="App.applyFinancingPreset('ora03')">ORA 03 · 60% · 24m</button>
          <button class="tag tag-chip" onclick="App.applyFinancingPreset('dolphin_gs')">Dolphin GS · 60% · 24m</button>
        </div>
      </div>

      <div>${rightPanel}</div>
    </div>

    <div class="footer-notes">
      <div class="card">Compare sempre o <strong>total pago</strong> no financiamento, não apenas a taxa de juros nominal anunciada.</div>
      <div class="card">Peça o <strong>CET</strong> (Custo Efetivo Total) por escrito antes de assinar qualquer contrato.</div>
      <div class="card">Compras via <strong>CNPJ</strong> não costumam ser elegíveis a bônus de varejo nem a programas de recompra do fabricante.</div>
    </div>
  `;
}

function renderFinancingSingle(v, F) {
  const r = financingResult(v, F);
  const be = breakEvenEntrada(v.preco, F.prazoMeses, F.taxaRecusa, F.bonusAlt);
  let crossLabel;
  if (be.crossPct != null) crossLabel = `Acima de ${be.crossPct.toFixed(0)}% de entrada, o bônus vence.`;
  else crossLabel = r.bonus > r.jurosEvitados ? 'O bônus vence em toda a faixa de entrada.' : 'A taxa 0% vence em toda a faixa de entrada.';

  return `
    <div class="single-panel">
      <div class="highlight-card">
        <div class="text-muted small">MELHOR OPÇÃO</div>
        <div class="winner">${r.melhor}</div>
        <div class="mt-8">Vantagem de ${brl(r.vantagem)} sobre a outra alternativa.</div>
      </div>
      ${carousel(v.id)}
    </div>
    <table class="table mt-16">
      <tbody>
        <tr><td>Saldo financiado</td><td class="text-right">${brl(r.saldo)}</td></tr>
        <tr><td>Parcela</td><td class="text-right">${brl(r.parcela)}</td></tr>
        <tr><td>Total pago</td><td class="text-right">${brl(r.totalPago)}</td></tr>
        <tr><td>Juros evitados com a taxa 0%</td><td class="text-right"><strong>${brl(r.jurosEvitados)}</strong></td></tr>
        <tr><td>Bônus à vista alternativo</td><td class="text-right">${brl(r.bonus)}</td></tr>
      </tbody>
    </table>
    <h4 class="mt-20 mb-8">Ponto de virada (juros evitados × entrada)</h4>
    <div class="card" style="padding:12px">${breakEvenChart(be)}</div>
    <div class="small text-muted mt-8">${crossLabel}</div>
  `;
}

function renderFinancingMulti(vehicles, F) {
  const results = vehicles.map(v => financingResult(v, F));
  return `<div class="table-wrap"><table class="table">
    <tbody>
      <tr><td class="sticky-col"></td>${results.map(r => `<td class="text-right"><img src="${esc((FOTOS[r.id] || [])[0] || '')}" style="width:96px;height:64px;object-fit:cover" alt="" onerror="this.style.opacity=0"></td>`).join('')}</tr>
      <tr><td class="sticky-col"><strong>Modelo</strong></td>${results.map(r => `<td class="text-right">${esc(r.nome)}</td>`).join('')}</tr>
      <tr><td class="sticky-col">Preço</td>${results.map(r => `<td class="text-right">${brl(r.preco)}</td>`).join('')}</tr>
      <tr><td class="sticky-col">Saldo financiado</td>${results.map(r => `<td class="text-right">${brl(r.saldo)}</td>`).join('')}</tr>
      <tr><td class="sticky-col">Parcela</td>${results.map(r => `<td class="text-right">${brl(r.parcela)}</td>`).join('')}</tr>
      <tr><td class="sticky-col">Total pago</td>${results.map(r => `<td class="text-right">${brl(r.totalPago)}</td>`).join('')}</tr>
      <tr><td class="sticky-col">Juros evitados (taxa 0%)</td>${results.map(r => `<td class="text-right">${brl(r.jurosEvitados)}</td>`).join('')}</tr>
      <tr><td class="sticky-col">Bônus à vista</td>${results.map(r => `<td class="text-right">${brl(r.bonus)}</td>`).join('')}</tr>
      <tr style="background:var(--color-accent-100)"><td class="sticky-col"><strong>Melhor opção</strong></td>${results.map(r => `<td class="text-right"><strong>${r.melhor}</strong></td>`).join('')}</tr>
      <tr><td class="sticky-col">Vantagem</td>${results.map(r => `<td class="text-right">${brl(r.vantagem)}</td>`).join('')}</tr>
    </tbody>
  </table></div>`;
}

// ---------------------------------------------------------------- 7. Glossário
function renderGlossary() {
  const cats = ['Técnico', 'Financeiro', 'Regulatório', 'Segurança'];
  const q = state.glossarySearch.trim().toLowerCase();
  const list = GLOSSARY_TERMS.filter(g => {
    if (state.glossaryCategory && g.categoria !== state.glossaryCategory) return false;
    if (q && !(g.termo.toLowerCase().includes(q) || g.definicao.toLowerCase().includes(q))) return false;
    return true;
  });
  return `
    <div class="section-title">Glossário</div>
    <div class="section-desc">Termos técnicos, financeiros, regulatórios e de segurança usados no dashboard.</div>
    <div class="filter-bar">
      <input id="fld-glossarysearch" class="input" style="max-width:280px" placeholder="Buscar termo…" value="${esc(state.glossarySearch)}" oninput="App.setGlossarySearch(this.value)">
      ${cats.map(c => `<button class="tag tag-chip${state.glossaryCategory === c ? ' active' : ''}" onclick="App.setGlossaryCategory('${c}')">${c}</button>`).join('')}
      ${state.glossaryCategory ? `<button class="btn btn-ghost" onclick="App.setGlossaryCategory(null)">Limpar categoria</button>` : ''}
    </div>
    <div>
      ${list.map(g => `
        <div class="gloss-row">
          <div class="term-line"><span class="term">${esc(g.termo)}</span>${g.sigla ? `<span class="tag tag-outline">${esc(g.sigla)}</span>` : ''}<span class="tag tag-neutral">${esc(g.categoria)}</span></div>
          <div class="def">${esc(g.definicao)}</div>
        </div>`).join('')}
      ${!list.length ? '<div class="text-muted">Nenhum termo encontrado.</div>' : ''}
    </div>
  `;
}

// ---------------------------------------------------------------- 8. Fontes
function renderSources() {
  return `
    <div class="section-title">Fontes</div>
    <div class="section-desc">Fontes e citações usadas para montar os dados de preço e ficha técnica.</div>
    ${FONTES_GROUPS.map(g => `
      <div class="sources-group">
        <h3>${esc(g.titulo)}</h3>
        <table class="table">
          <thead><tr><th>Fonte</th><th>O que foi extraído</th><th>Status</th></tr></thead>
          <tbody>${g.rows.map(r => `<tr><td><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.nome)}</a></td><td>${esc(r.extraido)}</td><td class="text-muted">${esc(r.status)}</td></tr>`).join('')}</tbody>
        </table>
      </div>`).join('')}
  `;
}

// ---------------------------------------------------------------- dispatcher
const SECTION_RENDERERS = {
  overview: renderOverview, compare: renderCompare, simulator: renderSimulator,
  sensitivity: renderSensitivity, spec: renderSpec, financing: renderFinancing,
  glossary: renderGlossary, sources: renderSources
};

function withFocusPreserved(container, fn) {
  const active = document.activeElement;
  let info = null;
  if (active && container.contains(active) && active.id && active.id.indexOf('fld-') === 0) {
    info = { id: active.id, selStart: active.selectionStart, selEnd: active.selectionEnd };
  }
  fn();
  if (info) {
    const el = document.getElementById(info.id);
    if (el) {
      el.focus();
      if (typeof info.selStart === 'number' && el.setSelectionRange) {
        try { el.setSelectionRange(info.selStart, info.selEnd); } catch (e) {}
      }
    }
  }
}

function render() {
  document.documentElement.setAttribute('data-theme', state.theme);
  renderSidebar();
  renderTopbar();
  const mainEl = document.getElementById('main-content');
  withFocusPreserved(mainEl, () => {
    mainEl.innerHTML = (SECTION_RENDERERS[state.section] || renderOverview)();
  });
  document.getElementById('overlay-root').innerHTML = renderDetailDrawer();
}

// ---------------------------------------------------------------- ações (App)
const App = {
  setSection(id) {
    state.section = id; state.drawerId = null;
    if (location.hash.replace('#', '') !== id) location.hash = id;
    render();
  },
  toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ev-theme', state.theme);
    render();
  },
  setContext(key, value) {
    state.context[key] = value;
    if (key === 'papel' || key === 'idade') {
      state.premissas.seguroAno1 = AGE_BASE[state.context.idade] * ROLE_MULT[state.context.papel];
    }
    if (key === 'recarga') {
      const r = RECARGA_PREMISSAS[value];
      state.premissas.precoKwh = r.precoKwh;
      state.premissas.fatorPerda = r.fatorPerda;
    }
    render();
  },
  setPremissa(key, value) { state.premissas[key] = value; render(); },
  toggleIncludeRevenda() { state.includeRevenda = !state.includeRevenda; render(); },
  carouselNav(id, delta) {
    const n = (FOTOS[id] || []).filter(Boolean).length || 1;
    const cur = state.carouselIdx[id] || 0;
    state.carouselIdx[id] = (cur + delta + n) % n;
    render();
  },
  openDetail(id) { state.drawerId = id; render(); },
  closeDetail() { state.drawerId = null; render(); },
  gotoGlossary(term) { state.section = 'glossary'; state.glossarySearch = term; state.glossaryCategory = null; location.hash = 'glossary'; render(); },
  setGlobalSearch(v) { state.search = v; render(); },
  toggleMarca(m) {
    const arr = state.filters.marcas;
    state.filters.marcas = arr.includes(m) ? arr.filter(x => x !== m) : [...arr, m];
    render();
  },
  clearFilters() { state.filters.marcas = []; state.search = ''; render(); },
  setSort(key) {
    if (state.filters.sortBy === key) state.filters.sortDir = state.filters.sortDir === 'asc' ? 'desc' : 'asc';
    else { state.filters.sortBy = key; state.filters.sortDir = 'asc'; }
    render();
  },
  toggleCompareSelected(id) {
    const arr = state.compareSelected;
    if (arr.includes(id)) state.compareSelected = arr.filter(x => x !== id);
    else if (arr.length < 3) state.compareSelected = [...arr, id];
    render();
  },
  clearCompareSelected() { state.compareSelected = []; render(); },
  toggleCompareExpanded() { state.compareExpanded = !state.compareExpanded; render(); },
  toggleSegment(key) { state.chartSegmentsOff[key] = !state.chartSegmentsOff[key]; render(); },
  toggleSensLine(id) { state.sensLinesOff[id] = !state.sensLinesOff[id]; render(); },
  setSensRef(id) { state.sensRefId = id; render(); },
  toggleFinancingModel(id) {
    const arr = state.financing.selectedIds;
    if (arr.includes(id)) state.financing.selectedIds = arr.filter(x => x !== id);
    else if (arr.length < 3) state.financing.selectedIds = [...arr, id];
    render();
  },
  setFinancing(key, value) { state.financing[key] = value; render(); },
  applyFinancingPreset(which) {
    if (which === 'ora03') Object.assign(state.financing, { selectedIds: ['ora03'], entradaPct: 60, prazoMeses: 24, bonusAlt: 20000 });
    else Object.assign(state.financing, { selectedIds: ['dolphin_gs'], entradaPct: 60, prazoMeses: 24, bonusAlt: 8000 });
    render();
  },
  setGlossarySearch(v) { state.glossarySearch = v; render(); },
  setGlossaryCategory(c) { state.glossaryCategory = c; render(); }
};
window.App = App;

window.addEventListener('hashchange', () => {
  const id = (location.hash || '#overview').replace('#', '') || 'overview';
  if (id !== state.section) { state.section = id; render(); }
});

document.addEventListener('DOMContentLoaded', render);
