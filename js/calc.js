// Motor de cálculo — fórmulas herdadas 1:1 do protótipo design-reference/Dashboard EV Recife.dc.html
// Ver design-reference/HANDOFF.md > "Calculations (cost model)" para a documentação das fórmulas.
'use strict';

function brl(v) {
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
}
function brl2(v) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function pct(v, casas) {
  return (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0 }) + '%';
}

// Custo total de propriedade de um veículo, dado um conjunto de premissas.
function computeVehicle(v, premissas, includeRevenda) {
  const P = premissas;
  const kmTotal = P.kmAno * P.anos;
  const energia = (v.consumo / 100) * kmTotal * P.fatorPerda * P.precoKwh * (1 - v.descontoEnergia);
  const combustivel = v.kmPorLitro ? (kmTotal / v.kmPorLitro) * P.precoGasolina : 0;
  const seguro = v.preco * (P.anos * P.seguroAno1 - P.seguroQueda * (P.anos - 1) * P.anos / 2);
  const manutencao = v.revisoes + v.pneus + v.outros;
  const ipva = v.tipo === 'BEV' ? 0 : v.preco * 0.024 * 3.7;
  const revenda = v.preco * v.residual[P.cenario];
  const liquido = v.preco + P.emplacamento + energia + combustivel + seguro + manutencao + ipva - (includeRevenda ? revenda : 0);
  const rsKm = liquido / kmTotal;
  const rsMes = liquido / (P.anos * 12);
  const efiCost = (energia + combustivel) / kmTotal;
  return Object.assign({}, v, { energia, combustivel, seguro, manutencao, ipva, revenda, liquido, rsKm, rsMes, efiCost, kmTotal });
}

function computeAll(list, premissas, includeRevenda) {
  return list.map(v => computeVehicle(v, premissas, includeRevenda));
}

// Normalização min-max (0-10), com opção de inverter (quanto menor, melhor).
function nz(x, lo, hi, inverter) {
  if (hi === lo) return 5;
  let val = (x - lo) / (hi - lo);
  if (inverter) val = 1 - val;
  return Math.max(0, Math.min(10, val * 10));
}

// Índice de adequação (0-100), relativo ao conjunto informado (já filtrado).
// Pesos fixos: custo 30%, segurança 20%, autonomia 12%, rede 10%, revenda 10%, eficiência 8%, porta-malas 5%, conforto 5%.
function computeIndices(list) {
  const metrics = [
    { get: v => v.liquido, inv: true, w: 0.30 },
    { get: v => v.notas.seg, inv: false, w: 0.20 },
    { get: v => v.autonomia, inv: false, w: 0.12 },
    { get: v => v.notas.rede, inv: false, w: 0.10 },
    { get: v => v.residual.base, inv: false, w: 0.10 },
    { get: v => v.efiCost, inv: true, w: 0.08 },
    { get: v => v.portaMalas, inv: false, w: 0.05 },
    { get: v => v.notas.conf, inv: false, w: 0.05 }
  ];
  const ranges = metrics.map(m => {
    const vals = list.map(m.get);
    return { lo: Math.min(...vals), hi: Math.max(...vals) };
  });
  const out = {};
  list.forEach(v => {
    let idx = 0;
    metrics.forEach((m, i) => { idx += nz(m.get(v), ranges[i].lo, ranges[i].hi, m.inv) * m.w; });
    out[v.id] = idx * 10;
  });
  return out;
}

// Bucket de destaque relativo (0-4, pior a melhor) usado nas tabelas de comparação.
function bucketOf(v, arr, lowerBetter) {
  const min = Math.min(...arr), max = Math.max(...arr);
  if (max === min) return 2;
  const frac = (v - min) / (max - min);
  const goodness = lowerBetter ? 1 - frac : frac;
  const severity = 1 - goodness;
  return Math.min(4, Math.floor(severity * 5));
}

function medianOf(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// --- Financiamento (Formatos de compra) ---
// saldo financiado, parcela (amortização padrão), total pago, juros evitados ao aceitar 0%.
function parcelaCalc(preco, entradaPct, prazoMeses, taxaMensalPct) {
  const saldo = preco * (1 - entradaPct / 100);
  const i = taxaMensalPct / 100;
  const n = prazoMeses;
  const parcela = i === 0 ? saldo / n : saldo * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  const totalPago = parcela * n;
  const jurosEvitados = totalPago - saldo;
  return { saldo, parcela, totalPago, jurosEvitados };
}

function financingResult(v, F) {
  const calc = parcelaCalc(v.preco, F.entradaPct, F.prazoMeses, F.taxaRecusa);
  const bonus = F.bonusAlt;
  const melhor = bonus > calc.jurosEvitados ? 'BÔNUS À VISTA' : 'TAXA 0%';
  const vantagem = Math.abs(bonus - calc.jurosEvitados);
  return Object.assign({}, v, calc, { bonus, melhor, vantagem });
}

// Ponto de virada: amostra entradaPct de 30% a 90% em passos de 5% e acha onde jurosEvitados cruza o bônus fixo.
function breakEvenEntrada(preco, prazoMeses, taxaRecusa, bonusAlt) {
  const samples = [];
  for (let e = 30; e <= 90; e += 5) samples.push(e);
  const jurosSeries = samples.map(e => parcelaCalc(preco, e, prazoMeses, taxaRecusa).jurosEvitados);
  let crossPct = null;
  for (let k = 1; k < samples.length; k++) {
    const prevDiff = jurosSeries[k - 1] - bonusAlt;
    const curDiff = jurosSeries[k] - bonusAlt;
    if (prevDiff === 0) { crossPct = samples[k - 1]; break; }
    if ((prevDiff < 0 && curDiff >= 0) || (prevDiff > 0 && curDiff <= 0)) {
      const t = Math.abs(prevDiff) / (Math.abs(prevDiff) + Math.abs(curDiff));
      crossPct = samples[k - 1] + t * (samples[k] - samples[k - 1]);
      break;
    }
  }
  return { samples, jurosSeries, bonusAlt, crossPct };
}
