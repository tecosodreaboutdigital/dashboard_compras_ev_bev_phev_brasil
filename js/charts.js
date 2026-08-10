// Gráficos SVG puros (sem libs externas). Usa <text> real do SVG — no protótipo original
// os rótulos de eixo eram <span> HTML sobrepostos porque o runtime da ferramenta de design
// falhava ao renderizar <text> SVG; essa limitação não existe fora dela (ver HANDOFF.md > Sensibilidade).
'use strict';

const CHART_COLORS = ['#ec3013', '#1a6ed8', '#1a9e6b', '#c98a12', '#7c4dbf', '#3aa0a0', '#c94d8a', '#6b6764'];

function svgEl(tag, attrs, children) {
  const parts = [`<${tag}`];
  for (const k in attrs) parts.push(` ${k}="${attrs[k]}"`);
  if (!children) { parts.push('/>'); return parts.join(''); }
  parts.push('>');
  parts.push(Array.isArray(children) ? children.join('') : children);
  parts.push(`</${tag}>`);
  return parts.join('');
}

function fmtMil(v) {
  return (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mil';
}

// ---------- Chart 1: multi-line, km/ano x custo líquido 5 anos ----------
function lineChartMulti(opts) {
  const { width = 720, height = 340, series, xTicks, xLabel, yLabel, colorOf } = opts;
  const padL = 64, padR = 20, padT = 16, padB = 40;
  const w = width - padL - padR, h = height - padT - padB;
  const allY = series.flatMap(s => s.values);
  const yMax = Math.max(...allY) * 1.08;
  const yMin = 0;
  const xMin = xTicks[0], xMax = xTicks[xTicks.length - 1];
  const xPix = x => padL + ((x - xMin) / (xMax - xMin)) * w;
  const yPix = y => padT + h - ((y - yMin) / (yMax - yMin)) * h;

  let gridLines = [];
  const yStepCount = 5;
  for (let i = 0; i <= yStepCount; i++) {
    const y = yMin + (yMax - yMin) * (i / yStepCount);
    gridLines.push(svgEl('line', { x1: padL, x2: padL + w, y1: yPix(y), y2: yPix(y), stroke: 'var(--color-divider)', 'stroke-width': 1 }));
    gridLines.push(svgEl('text', { x: padL - 8, y: yPix(y) + 4, 'text-anchor': 'end', 'font-size': 10, fill: 'var(--color-text-muted)' }, 'R$ ' + fmtMil(y)));
  }
  xTicks.forEach(x => {
    gridLines.push(svgEl('text', { x: xPix(x), y: padT + h + 20, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--color-text-muted)' }, fmtMil(x) + ' km'));
  });

  const lines = series.map((s, i) => {
    const color = colorOf ? colorOf(s, i) : CHART_COLORS[i % CHART_COLORS.length];
    const d = s.values.map((v, k) => (k === 0 ? 'M' : 'L') + xPix(xTicks[k]) + ',' + yPix(v)).join(' ');
    const dots = s.values.map((v, k) => svgEl('circle', { cx: xPix(xTicks[k]), cy: yPix(v), r: 3, fill: color }));
    return svgEl('g', { opacity: s.off ? 0.15 : 1 }, [
      svgEl('path', { d, fill: 'none', stroke: color, 'stroke-width': 2 }),
      ...dots
    ]);
  });

  return svgEl('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', height, role: 'img', 'aria-label': xLabel + ' x ' + yLabel },
    [...gridLines, ...lines]);
}

// ---------- Chart 2: área + linha, preço/kWh x custo de energia, com marcadores verticais ----------
function areaLineChart(opts) {
  const { width = 720, height = 320, xValues, yValues, markers = [] } = opts;
  const padL = 64, padR = 20, padT = 16, padB = 44;
  const w = width - padL - padR, h = height - padT - padB;
  const xMin = xValues[0], xMax = xValues[xValues.length - 1];
  const yMax = Math.max(...yValues) * 1.08;
  const xPix = x => padL + ((x - xMin) / (xMax - xMin)) * w;
  const yPix = y => padT + h - (y / yMax) * h;

  let grid = [];
  for (let i = 0; i <= 5; i++) {
    const y = yMax * (i / 5);
    grid.push(svgEl('line', { x1: padL, x2: padL + w, y1: yPix(y), y2: yPix(y), stroke: 'var(--color-divider)', 'stroke-width': 1 }));
    grid.push(svgEl('text', { x: padL - 8, y: yPix(y) + 4, 'text-anchor': 'end', 'font-size': 10, fill: 'var(--color-text-muted)' }, 'R$ ' + fmtMil(y)));
  }
  [xMin, (xMin + xMax) / 2, xMax].forEach(x => {
    grid.push(svgEl('text', { x: xPix(x), y: padT + h + 20, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--color-text-muted)' }, 'R$ ' + x.toFixed(2)));
  });

  const linePath = xValues.map((x, k) => (k === 0 ? 'M' : 'L') + xPix(x) + ',' + yPix(yValues[k])).join(' ');
  const areaPath = linePath + ` L${xPix(xMax)},${yPix(0)} L${xPix(xMin)},${yPix(0)} Z`;

  const markerLines = markers.map((m, i) => {
    const x = xPix(m.value);
    return svgEl('g', {}, [
      svgEl('line', { x1: x, x2: x, y1: padT, y2: padT + h, stroke: CHART_COLORS[(i + 1) % CHART_COLORS.length], 'stroke-width': 1.5, 'stroke-dasharray': '4,3' }),
    ]);
  });

  return svgEl('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', height, role: 'img', 'aria-label': 'Preço por kWh x custo de energia em 5 anos' }, [
    ...grid,
    svgEl('path', { d: areaPath, fill: 'var(--color-accent-100)', stroke: 'none' }),
    svgEl('path', { d: linePath, fill: 'none', stroke: 'var(--color-accent)', 'stroke-width': 2 }),
    ...markerLines
  ]);
}

// ---------- Chart 3 (Simulador): barras horizontais empilhadas ----------
// Segmentos desligados na legenda ficam com opacity 0.35 (não somem) — ver HANDOFF.md > Interactions & Behavior > Carrossels/legendas.
function stackedBarRow(segments, maxTotal, off) {
  // segments: [{key,label,value,color,outline}]
  return segments.map(s => {
    const wpct = maxTotal > 0 ? (s.value / maxTotal) * 100 : 0;
    const opacity = off[s.key] ? 0.35 : 1;
    const style = s.outline
      ? `width:${wpct}%;height:100%;opacity:${opacity};border:2px dashed ${s.color};box-sizing:border-box;background:repeating-linear-gradient(45deg,${s.color}22,${s.color}22 4px,transparent 4px,transparent 8px)`
      : `width:${wpct}%;height:100%;opacity:${opacity};background:${s.color}`;
    return `<div title="${s.label}: ${brl(s.value)}" style="${style}"></div>`;
  }).join('');
}

// ---------- Financing break-even chart ----------
function breakEvenChart(opts) {
  const { width = 700, height = 260, samples, jurosSeries, bonusAlt, crossPct } = opts;
  const padL = 64, padR = 20, padT = 16, padB = 36;
  const w = width - padL - padR, h = height - padT - padB;
  const xMin = samples[0], xMax = samples[samples.length - 1];
  const yMax = Math.max(...jurosSeries, bonusAlt) * 1.1;
  const xPix = x => padL + ((x - xMin) / (xMax - xMin)) * w;
  const yPix = y => padT + h - (y / yMax) * h;

  let grid = [];
  for (let i = 0; i <= 4; i++) {
    const y = yMax * (i / 4);
    grid.push(svgEl('line', { x1: padL, x2: padL + w, y1: yPix(y), y2: yPix(y), stroke: 'var(--color-divider)', 'stroke-width': 1 }));
    grid.push(svgEl('text', { x: padL - 8, y: yPix(y) + 4, 'text-anchor': 'end', 'font-size': 10, fill: 'var(--color-text-muted)' }, 'R$ ' + fmtMil(y)));
  }
  samples.forEach(x => {
    if (x % 10 === 0) grid.push(svgEl('text', { x: xPix(x), y: padT + h + 18, 'text-anchor': 'middle', 'font-size': 10, fill: 'var(--color-text-muted)' }, x + '%'));
  });

  const jurosPath = samples.map((x, k) => (k === 0 ? 'M' : 'L') + xPix(x) + ',' + yPix(jurosSeries[k])).join(' ');
  const bonusY = yPix(bonusAlt);
  const crossDot = crossPct != null ? svgEl('circle', { cx: xPix(crossPct), cy: yPix(bonusAlt), r: 5, fill: 'var(--color-accent)' }) : '';

  return svgEl('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', height }, [
    ...grid,
    svgEl('line', { x1: padL, x2: padL + w, y1: bonusY, y2: bonusY, stroke: CHART_COLORS[1], 'stroke-width': 2, 'stroke-dasharray': '6,4' }),
    svgEl('path', { d: jurosPath, fill: 'none', stroke: 'var(--color-accent)', 'stroke-width': 2 }),
    crossDot
  ]);
}
