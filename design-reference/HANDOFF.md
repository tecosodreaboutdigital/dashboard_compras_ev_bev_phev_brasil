# Handoff: Dashboard de Compra Veicular (EV/Híbrido — segundo carro)

## Overview
Dashboard interativo de apoio à decisão de compra de um veículo elétrico ou híbrido como segundo carro da família em Recife. Compara 16 modelos (11 BEV + 5 híbridos PHEV/HEV) por custo total de propriedade (TCO) em 5 anos, com simulador de premissas, análise de sensibilidade, ficha técnica, glossário e comparador de formatos de financiamento.

## About the Design Files
The file in this bundle — `Dashboard EV Recife.dc.html` — is a **design reference / functional HTML prototype**, not production code to copy directly. It runs on a proprietary internal component runtime (Design Components: template holes, `sc-for`/`sc-if` control flow, a `DCLogic` class) that does not exist outside this design tool. **Do not attempt to run or import this file as-is.** The task is to recreate the design, data model, calculations, and interactions in the target codebase's actual environment (React/Vue/whatever stack the repo uses), using its own component and state patterns.

`image-slot.js` is a design-tool-only placeholder web component for drag-and-drop images; in the real app, replace every `<image-slot>` with a normal `<img>` bound to a real image URL or asset pipeline.

## Fidelity
**High-fidelity.** All colors, typography, spacing, and copy are final. Interactions (dropdown premises, live recalculation, sortable tables, drawers, carousels, checkboxes) are fully specified — treat behavior as a functional spec, not just visual reference.

## Design System
Built on the **Modernist** design system: flat, architectural, Archivo typeface (heading + body), a single red accent (#ec3013) on a light ground (#f3f2f2), 2px rule dividers, zero border radius, no shadows beyond flat elevation tiers, tonal ramps (100–900) generated in OKLCH per color role. If the target codebase doesn't already have this design system, port the tokens below; if it does, use its existing component library instead of the raw CSS variables shown here.

### Design tokens
- `--color-bg`: #f3f2f2 (page background)
- `--color-text`: #201e1d
- `--color-accent`: #ec3013 (single accent, mono-scheme; used for primary actions, highlights, active nav states)
- `--color-accent-100` … `--color-accent-900`: tonal ramp (100/300 = tints/borders, 500 = base, 700/900 = text-on-tint)
- `--color-neutral-100` … `--color-neutral-900`: neutral/grayscale ramp for surfaces and secondary text
- `--color-divider`: strong 2px rule color, used between all major sections
- `--font-heading` / `--font-body`: Archivo (single family, two roles)
- Radius: 0px everywhere (no rounded corners, ever)
- Shadows: `--shadow-sm/md/lg`, flat elevation tiers, no soft glows
- Buttons: `.btn-primary` (solid accent fill), `.btn-secondary`, `.btn-ghost`, `.btn-icon` — labels flush-left, never centered
- Tags: `.tag-accent`, `.tag-neutral`, `.tag-outline` — small pill-free (radius 0) labels
- Tables: `.table` with themed header row and 1px row dividers
- Cards: `.card` + `.elev-sm/md/lg`

## Screens / Views

The dashboard is a single-page app with a left sidebar (desktop) / top tab bar (narrow viewports) navigation across 8 sections. A light/dark theme toggle lives in the header.

### 1. Navigation shell
- **Layout**: fixed-width left sidebar (~220px) with nav items (icon + label), main content area fills the rest, scrollable independently. On narrow viewports the sidebar collapses to a horizontal scrolling tab bar at the top.
- **Nav items** (in order): Visão geral, Comparar, Simulador, Sensibilidade, Ficha técnica, Formatos de compra, Glossário, Fontes.
- Active item: accent-colored left border (sidebar) or bottom border (tab bar), accent text color. Inactive: neutral text, transparent border.
- Theme toggle (light/dark) in the header, persists across the session.

### 2. Visão geral (Overview)
- **Header strip**: a card summarizing the decision context — 4 dropdowns, inline, that drive every calculation in the app:
  1. **Papel do carro**: "Carro único da família" / "Segundo carro" / "Terceiro carro ou mais" — affects insurance rate multiplier (1.10× / 1.00× / 0.90×).
  2. **Idade do condutor**: 18–25 / 26–35 / 36–55 / 56+ — base insurance rate by bracket (3.5% / 2.8% / 2.3% / 2.0% of vehicle price, year 1).
  3. **Km/ano**: 5.000 / 9.000 / 15.000 / 20.000 / 30.000 — annual mileage driving energy/fuel cost.
  4. **Recarga em casa**: "Sem recarga em casa (rede pública)" (R$2,30/kWh) / "Tomada comum em casa" (R$0,95/kWh) / "Wallbox em casa" (R$0,85/kWh) — also sets a small charging-loss factor.
  - Changing any dropdown **recalculates all costs live** across the entire app (ranking order, TCO figures, recommendation cards) — there is no "apply" button, it's instant.
  - A "Ajuste fino no Simulador" ghost button deep-links to the Simulador tab for finer control (custom insurance curve, energy price, resale scenario, etc).
- **Recommendation cards**: 4 cards, the top 4 models by "Índice de adequação" (weighted score, see Calculations below). Each card shows: photo carousel (5 photos, left/right arrow buttons + counter), model name/brand, badge tags (BEV/PHEV/HEV, origin), 5-year net cost (big number) + R$/km, 3 icon buttons row below the carousel (open full spec sheet, YouTube review video 1, YouTube review video 2 — YouTube icon with a small "1"/"2" badge).
- **Alert row**: informational banners, e.g. one calling out that PHEV models without home charging behave like regular hybrids (cost driven almost entirely by fuel) — icon + headline + one-line explanation + a "Ver comparação" ghost button linking to Comparar.
- **Ranking list**: a vertically stacked list (all visible models, `border-top: 2px solid divider` at top of list, 1px rules between rows) sorted by net 5-year cost, each row: rank number, thumbnail photo, name, brand, tag badges, TCO figure with a hover tooltip explaining "TCO" and a "Ver no glossário →" link, R$/km.

### 3. Comparar (Compare)
- **Filter bar**: brand multi-select chips (BYD, Geely, MG, GWM, Leapmotor, Jaecoo, Omoda, Chery), a search box, a "Limpar" (clear) ghost button, and a result counter ("Exibindo N de 16 modelos").
- **Main data table**: sticky header, sticky first column (model name + thumbnail), 13 sortable/informational columns: Tipo, Preço, Custo líq. 5a, R$/km, R$/mês, Autonomia, Consumo (adaptive: kWh/100km for BEV, km/l for PHEV/HEV), Porta-malas, Airbags, Latin NCAP, ADAS, Revenda, Índice. Every column header has a hover tooltip (dotted underline cue) explaining the metric with a "Ver no glossário →" deep link. Sortable columns show a ▾ arrow when active; click header to sort.
- **Row checkboxes**: each row has a checkbox to add the model to a **non-modal comparison drawer** — a persistent bottom or side panel (NOT a full-screen modal — this was a deliberate fix; a full-screen modal blocked selecting more models) that lists selected models' full attributes side-by-side in a small table (Tipo, Preço, TCO, R$/km, Autonomia, Consumo, Porta-malas, Airbags, ADAS, Revenda, Índice — lower/higher-is-better highlighting per row). Drawer can be expanded/collapsed and stays open while the user keeps browsing/checking rows.
- **Row-level model detail drawer** (separate from the multi-compare drawer): clicking a model name/photo opens a detail drawer with a 5-photo carousel, full spec grid (autonomia, potência, porta-malas — each with a hover tooltip), a full cost breakdown table (preço, energia, combustível-if-applicable, seguro, manutenção, IPVA-if-applicable, revenda, líquido — each row labeled, revenda negative/subtracted), "Índice de adequação" with tooltip, an official-page link button, and two YouTube video buttons (Vídeo 1 / Vídeo 2).

### 4. Simulador (Simulator)
- **Premises panel**: editable inputs for km/ano, anos (horizon), preço do kWh, fator de perda de recarga, seguro ano 1 (%), queda anual do seguro (%), cenário de revenda (pessimista/base/otimista radio/segmented control), emplacamento (R$), preço da gasolina (R$/l). A toggle to include/exclude resale value from the net cost total.
- **Stacked bar chart**: one horizontal (or vertical) stacked bar per model, segments = Preço / Energia / Combustível (only for PHEV/HEV) / Seguro / Manutenção / Revenda (recuperado, shown as a subtracted/outlined segment when included). A legend below/beside the chart with clickable swatches that toggle each segment's visibility (dimmed to 0.35 opacity when off) across all bars.
- Sorted ascending by total net cost so the cheapest model's bar is first/shortest.

### 5. Sensibilidade (Sensitivity)
- **Chart 1 — Quilometragem anual × Custo líquido em 5 anos**: a multi-line SVG chart, one line per model (or a toggle-able subset via a legend list), X axis = annual km (6k–30k), Y axis = 5-year net cost in R$. **Axis labels are HTML `<span>` overlays positioned by percentage over the SVG, not SVG `<text>` elements** (SVG `<text>` was found to silently fail to render in this runtime — recreate with real SVG/chart-library text elements in production, this constraint doesn't apply outside this tool). Gridlines on both axes, values in "R$ X mil" / "X mil km" format.
- **Chart 2 — Preço da recarga (R$/kWh) × Custo de energia em 5 anos**: an area+line chart, X axis = price per kWh (R$0,80–R$3,50), Y axis = 5-year energy cost. Vertical dashed marker lines at 4 named scenarios (home wallbox rate, BYD-discounted rate, base rate, DC fast-charging rate) with a legend below listing each marker's value and label.
- **Chart 3 — Break-even / Ponto de virada**: for a chosen reference model (dropdown), a table + a list showing, for every other model, the resale percentage the *other* model would need to hit for the reference model to still win on net cost — i.e., "how much would Model X's resale have to be to catch up".
- Only BEV models are used to compute the "average consumption" reference baseline (hybrids excluded from that specific average since their unit is different).

### 6. Ficha técnica (Spec sheet)
- A grid of cards, one per model (16 total), each with: 5-photo carousel (same left/right arrow + counter pattern as Overview cards), same 3-icon-button row (full spec / YouTube 1 / YouTube 2) as the Overview cards (kept visually identical for consistency), and a compact spec table (dimensions, powertrain, safety, comfort features).

### 7. Formatos de compra (Financing / purchase formats)
- **Left panel — model picker**: a scrollable checklist (checkbox per model, all 16 listed) allowing **1 to 3 models selected at once**, with a "X/3" counter and a disabled state on unchecked boxes once 3 are selected. Below it: entrada (down payment %) slider (30–90%, 5% steps), prazo (term) segmented control (12/24/36/48 months), "bônus à vista alternativo" (R$ number input), "taxa se recusar o 0%" (%/month number input). Two preset "chip" shortcut buttons pre-fill a known scenario (e.g. ORA 03 · 60% · 24m).
- **Right panel — results**:
  - **When exactly 1 model is selected**: a highlighted "melhor opção" (best option) card (accent-tinted background) declaring "TAXA 0%" or "BÔNUS À VISTA" as the winner with the R$ advantage margin, **plus a photo carousel of that single model to its right** (same 5-photo carousel pattern, positioned in a fixed ~220px-wide panel beside the highlight card) — added specifically so the user can see the car while comparing its financing math. Below: a detail table (saldo financiado, parcela, total pago, juros evitados, bônus alternativo). Below that: a "ponto de virada" line chart (juros evitados vs. entrada %, with the bônus alternativo drawn as a flat dashed reference line, and a dot marking the crossover point where one strategy starts beating the other) with a one-line takeaway sentence.
  - **When 2–3 models are selected**: instead of the single-model view, a **side-by-side comparison table** — first row is each model's photo (right-aligned per column, in its own header row above the name row), then rows for Preço, Saldo financiado, Parcela, Total pago, Juros evitados, Bônus à vista, and a highlighted "Melhor opção" row (accent-tinted cell) plus "Vantagem" row — all columns share the same entrada/prazo/taxa/bônus inputs from the left panel so it's an apples-to-apples comparison.
- **Footer notice card**: 3 short compliance/gotcha notes (compare total paid not nominal rate; ask for CET in writing; CNPJ purchases don't qualify for retail bonuses/buyback programs).

### 8. Glossário (Glossary)
- A search box + category filter chips (Técnico / Financeiro / Regulatório / Segurança).
- A flat list of ~19 terms, each row: term name (+ acronym tag if applicable), category tag, one-paragraph definition. Every metric tooltip across the app ("Ver no glossário →") deep-links here and pre-fills the search box with that term.

### 9. Fontes (Sources)
- Grouped list of data sources/citations used to build the pricing and spec data (not fully detailed here — see the HTML file directly for current content).

## Interactions & Behavior
- **Live recalculation**: every premise (Overview dropdowns, Simulador inputs) triggers a full recompute of the cost model and instantly re-renders ranking order, TCO figures, chart data, and recommendation cards. No "Apply"/"Save" step.
- **Tooltips**: hover (dotted-underline cue) reveals a dark popover with a metric explanation + "Ver no glossário →" link, on: TCO card labels, all 13 compare-table column headers, drawer metric labels, ranking section heading, sensitivity chart headings.
- **Carousels**: every 5-photo carousel has left/right chevron buttons and a "N/5" counter, positioned bottom-left as a small dark pill over the image.
- **Comparison drawer (Comparar tab)**: non-modal, stays open while browsing — this was an explicit UX fix after an earlier full-screen-modal version blocked selecting additional models. Preserve this non-blocking pattern.
- **Financing model picker**: max-3 selection cap enforced via disabled checkboxes once at the limit; unchecking frees a slot.
- **Theme toggle**: light/dark, affects the whole app (surfaces, text, dividers) while keeping the accent red for both.

## Calculations (cost model)

For each vehicle, 5-year (`anos`, default 5) net cost at `kmAno` (default 9.000 km/ano):

```
kmTotal = kmAno * anos
energia = (consumo_kWh_per_100km / 100) * kmTotal * fatorPerdaRecarga * precoKwh * (1 - descontoEnergia)
combustivel = kmPorLitro ? (kmTotal / kmPorLitro) * precoGasolina : 0   // PHEV/HEV only
seguro = preco * (anos * seguroAno1 - seguroQueda * (anos-1) * anos / 2)   // declining-rate approximation
manutencao = revisoes + pneus + outros   // flat 5-year sums per model
ipva = tipo === 'BEV' ? 0 : preco * 0.024 * 3.7   // combustion/hybrid IPVA approximation, BEVs exempt in this scenario
revenda = preco * residual[cenario]   // cenario: pessimista/base/otimista, per-model residual %
liquido = preco + emplacamento + energia + combustivel + seguro + manutencao + ipva - (includeRevenda ? revenda : 0)
rsKm = liquido / kmTotal
rsMes = liquido / (anos * 12)
efiCost = (energia + combustivel) / kmTotal   // normalized efficiency cost/km, used in the index so BEV and hybrid compare fairly
```

**Índice de adequação** (0–100, relative to the *currently filtered* set of models): weighted, min-max normalized score across: custo líquido (30%, lower better), segurança/notas.seg (20%, higher better), autonomia (12%, higher better), rede/notas.rede (10%, higher better), revenda cenário base (10%, higher better), efiCost (8%, lower better), portaMalas (5%, higher better), conforto/notas.conf (5%, higher better).

**Insurance rate (`seguroAno1`)** = `AGE_BASE[idade] * ROLE_MULT[papel]`, where:
- `AGE_BASE`: 18-25→3.5%, 26-35→2.8%, 36-55→2.3%, 56+→2.0% (of vehicle price)
- `ROLE_MULT`: único→1.10, segundo→1.00, terceiro→0.90

**Charging premise (`recarga`)** sets `precoKwh` + `fatorPerda`: pública→(2.30, 1.05), tomada→(0.95, 1.02), wallbox→(0.85, 1.01).

**Financing (Formatos de compra)**: standard amortization formula for the "taxa de mercado" scenario (if the buyer refuses a manufacturer's 0% offer):
```
saldo = preco * (1 - entradaPct/100)
parcela = saldo * (i * (1+i)^n) / ((1+i)^n - 1)     // i = taxaRecusa/100 monthly, n = prazoMeses
totalPago = parcela * n
jurosEvitados = totalPago - saldo   // value of taking the 0% offer instead
melhor = bonusAlt > jurosEvitados ? 'BÔNUS À VISTA' : 'TAXA 0%'
vantagem = |bonusAlt - jurosEvitados|
```
Break-even entrada % (the "ponto de virada" chart) is found by sampling `entradaPct` from 30–90% in 5% steps and finding where the `jurosEvitados` curve crosses the flat `bonusAlt` line.

## Data model
16 vehicles across BYD, Geely, MG, GWM, Leapmotor (BEV) and Jaecoo, Omoda, Chery (PHEV/HEV), each with: id, nome, marca, tipo (BEV/PHEV/HEV), origem, preço, bateria (kWh), autonomia (km, combined range for PHEV/HEV — see `autonomiaEletrica` for electric-only range), consumo (kWh/100km, BEV) or kmPorLitro (PHEV/HEV, some flagged `kmPorLitroEstimado: true`), potência, torque, aceleração, tração, dimensões, portaMalas, airbags, latinNcap (mostly "Não testado" — none of the 5 added hybrids have been crash-tested), adas description, acc (boolean), câmera, recargaDC spec, v2l, tetoPan, estepe, descontoEnergia, revisões/pneus/outros (5-year maintenance sums), residual {pess, base, otim} (resale % by scenario), notas {seg, rede, conf} (0–10 subjective ratings — **flagged in-app as estimates, not certified data**), obsComercial (a free-text caveat per model), link (official page URL).

Photos: 5 URLs per model (`FOTOS` map keyed by model id) — currently pointing at externally-hosted images the user supplied; **replace with owned/licensed assets or a proper CMS/CDN in production**, do not ship hot-linked third-party URLs.

Videos: 2 YouTube URLs per model (`YOUTUBE` map) — user-curated "best ranked, most-viewed Brazilian review" picks per model.

## Known data caveats to carry forward
- None of the 16 models have a Latin NCAP crash test on record ("Não testado") — safety scores are the design team's own estimates, not certified ratings. Make this explicit in the UI copy, don't imply official certification.
- 3 of the 5 hybrids (Atto 2, Song Pro, Jaecoo 7) are **PHEV**: with no home charging, they behave almost like regular hybrids — fuel dominates their real-world cost. This is called out via an Overview alert banner; keep that messaging.
- 2 of the 5 hybrids (Omoda 5, Tiggo 7) are **HEV** with no plug at all.
- Some hybrid km/l figures are flagged `kmPorLitroEstimado: true` — not manufacturer-confirmed.
- Jaecoo 7 Elite has several fields marked as unconfirmed by the manufacturer (weight, isolated torque, financing terms).
- Tiggo 7 Pro's trunk capacity is inconsistent across sources (330L–475L range) — flagged `portaMalasEstimado: true`.

## Assets
All car photos and YouTube video links were supplied directly by the user (external hosted image URLs + YouTube video IDs), not generated by this tool. Icons are inline SVG (chevrons, YouTube glyph, financing/document icons) drawn to match Lucide's style per the Modernist system's icon guidance — recreate with actual Lucide icons in production.

## Files
- `Dashboard EV Recife.dc.html` — the full design reference (all 8 screens, calculation logic, and Modernist-styled markup are in this one file; read it top-to-bottom as the source of truth for exact copy, layout order, and every conditional/edge case not captured above).
- `image-slot.js` — design-tool-only placeholder component, for reference only (see note above).
