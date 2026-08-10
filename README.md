# Dashboard Compras EV BEV e PHEV Brasil

Dashboard interativo de apoio à decisão de compra de um veículo elétrico ou híbrido como
segundo carro da família em Recife. Compara 16 modelos (11 BEV + 5 híbridos PHEV/HEV) por
custo total de propriedade (TCO) em 5 anos, com simulador de premissas, análise de
sensibilidade, ficha técnica, glossário e comparador de formatos de financiamento.

Site estático — **HTML/CSS/JS puro, sem framework e sem build step**. Abre direto no
navegador ou em qualquer host estático (Netlify, GitHub Pages, etc).

## Rodando localmente

Qualquer servidor estático serve. Por exemplo, com Node:

```bash
npx serve .
# ou
node -e "require('http').createServer((q,r)=>require('fs').readFile('.'+(q.url==='/'?'/index.html':q.url),(e,d)=>e?(r.writeHead(404),r.end()):(r.writeHead(200),r.end(d)))).listen(8080)"
```

Depois abra `http://localhost:8080`. **Não abra `index.html` direto via `file://`** — os
`<script>` são carregados na ordem certa, mas alguns navegadores restringem `fetch`/módulos
em `file://`; um servidor local evita qualquer surpresa.

## Estrutura

```
index.html          shell da SPA (sidebar/tab bar, header, container das 8 seções)
css/styles.css       design tokens do sistema "Modernist" (claro/escuro)
js/data.js           dados reais dos 16 veículos, fotos, vídeos, glossário e fontes
js/calc.js           motor de cálculo (TCO, índice de adequação, financiamento)
js/charts.js         gráficos SVG feitos à mão (sem lib externa)
js/app.js            estado da aplicação + render das 8 seções + roteamento por hash
netlify.toml         config de deploy (publish "." , sem build command)
design-reference/    protótipo original de design (não roda fora da ferramenta) + spec completa
```

## Seções

Visão geral · Comparar · Simulador · Sensibilidade · Ficha técnica · Formatos de compra ·
Glossário · Fontes — navegação pela sidebar (desktop) ou tab bar (mobile), tema claro/escuro
persistido em `localStorage`.

## Deploy no Netlify

1. **New site from Git** → conectar este repositório.
2. Build command: (vazio). Publish directory: `.` (raiz).
3. Deploy. O `netlify.toml` já define isso, então os campos devem vir pré-preenchidos.

Não precisa de variáveis de ambiente nem de nenhum passo de build.

## Fonte de verdade / spec original

A pasta [`design-reference/`](design-reference/) guarda o protótipo de design original
(`Dashboard EV Recife.dc.html`) e o handoff completo (`HANDOFF.md`) que documentou todas as
telas, interações e fórmulas de cálculo usadas para reconstruir este site. O `.dc.html` **não
roda fora da ferramenta de design** (usa um runtime proprietário) — está ali só como
referência histórica, não como código a ser servido.

## Caveats conhecidos (herdados do design original)

- Nenhum dos 16 modelos tem teste de colisão Latin NCAP registrado — as notas de segurança no
  glossário/índice são estimativas da equipe, não certificação oficial.
- 3 dos 5 híbridos (Atto 2, Song Pro, Jaecoo 7) são **PHEV**: sem recarga em casa, o custo real
  é dominado pelo combustível — chamado explicitamente no alerta da Visão geral.
- 2 dos 5 híbridos (Omoda 5, Tiggo 7) são **HEV**, sem plugue nenhum.
- Alguns km/l de híbridos e a capacidade de porta-malas do Tiggo 7 Pro são estimativas
  (`kmPorLitroEstimado` / `portaMalasEstimado`), não confirmadas pelo fabricante.
- As fotos são URLs hot-linked de terceiros (sites das montadoras, blogs automotivos) — em
  produção de longo prazo, migrar para assets próprios/CDN é recomendável.
- Customização de pesos do índice de adequação por pessoa (até 4 perfis) existia como estado
  no protótipo mas não fazia parte do spec fechado — não foi implementada nesta v1.
