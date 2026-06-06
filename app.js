/* ====================================================================== */
/*  APP — rendering + interaction + pan/zoom                               */
/*                                                                         */
/*  Depends on:                                                            */
/*    data.js     — NODES, EDGES, PATHWAYS, PATHWAY_NAMES, WATERMARKS,     */
/*                  PANELS, TITLE, NODE_INDEX                              */
/*    clinical.js — CLIN, CLIN_PATHWAY, CLIN_VITAMIN, VIT_COLOR            */
/*                                                                         */
/*  Sections in this file:                                                 */
/*    1. SVG construction (defs, watermarks, info panels, nodes, edges)    */
/*    2. Interaction (node / pathway / vitamin selection → right panel)    */
/*    3. Mode toggle (Essential vs Comprehensive)                          */
/*    4. Pan / zoom (mouse, wheel, touch)                                  */
/* ====================================================================== */

const svgNS = 'http://www.w3.org/2000/svg';
const $ = (id) => document.getElementById(id);
const svg = $('map');

/* ---------- 1. SVG CONSTRUCTION ---------- */

(function buildDefs() {
  const defs = $('defs');
  // shunt arrowhead (red)
  const sm = document.createElementNS(svgNS, 'marker');
  sm.setAttribute('id', 'arr-shunt');
  sm.setAttribute('viewBox', '0 0 10 10');
  sm.setAttribute('refX', '9'); sm.setAttribute('refY', '5');
  sm.setAttribute('markerWidth', '7'); sm.setAttribute('markerHeight', '7');
  sm.setAttribute('orient', 'auto-start-reverse');
  const sp = document.createElementNS(svgNS, 'path');
  sp.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
  sp.setAttribute('fill', '#ff6b6f');
  sm.appendChild(sp);
  defs.appendChild(sm);

  Object.entries(PATHWAYS).forEach(([key, color]) => {
    const m = document.createElementNS(svgNS, 'marker');
    m.setAttribute('id', `arr-${key}`);
    m.setAttribute('viewBox', '0 0 10 10');
    m.setAttribute('refX', '9'); m.setAttribute('refY', '5');
    m.setAttribute('markerWidth', '7'); m.setAttribute('markerHeight', '7');
    m.setAttribute('orient', 'auto-start-reverse');
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    p.setAttribute('fill', color);
    m.appendChild(p);
    defs.appendChild(m);
  });
})();

// Parses @key[display] markers and turns them into clickable disease links.
// Plain text without markers falls back to innerHTML (preserves existing
// tspans used for color highlighting).
// Expand enzyme acronyms to full names for the right panel (map stays compact).
function expandEnzyme(s) {
  if (typeof s !== 'string') return s;
  let out = s;
  if (typeof ENZYME_FULL !== 'undefined') {
    Object.keys(ENZYME_FULL).forEach(k => {
      if (out.indexOf(k) !== -1) out = out.split(k).join(ENZYME_FULL[k]);
    });
  }
  out = out.replace(/\bDH\b/g, 'dehydrogenase');
  return out;
}

// Highlight NAD/FAD substrates ONLY in actual reaction arrows
// (NAD⁺ → NADH, FAD → FADH₂, etc.). Skip ATP-yield calculations
// like "NADH → 2.5 ATP" — those are mechanism detail, not Step 1 HY.
function markCofactors(text) {
  if (typeof text !== 'string') return text;
  // Must contain a reaction arrow
  if (!/→/.test(text)) return text;
  // Skip ATP-yield contexts ("NADH → 2.5 ATP", "FADH₂ → 1.5 ATP", etc.)
  if (/(NAD\S*|FAD\S*)\s*→\s*[\d.]/.test(text)) return text;

  let out = text;
  // NAD-family (longest first — NADPH before NADP, etc.)
  out = out.replace(/NADPH|NADP⁺|NADP\b|NADH|NAD⁺|NAD\b/g, function(m) {
    return '<tspan class="cof-mark cof-nad">' + m + '</tspan>';
  });
  // FAD-family
  out = out.replace(/FADH₂|FADH\b|FAD\b/g, function(m) {
    return '<tspan class="cof-mark cof-fad">' + m + '</tspan>';
  });
  return out;
}

// Auto-detect the class word inside an enzyme name based on enzClass.
// (Avoids having to hand-author classWord on every edge.)
function findClassWord(enzyme, enzClass) {
  const patterns = {
    carb: /carboxylase|ACC\b/,
    dh:   /dehydrogenase|G6PDH|PDH|LDH|MDH|SDH|αKG-DH|\bDH\b/,
    kin:  /kinase|PFK-?\d?/,
    tram: /transamination|ALT|AST/,
    phos: /F-1,6-BPase|G6Pase|BPase|Pase/,
    red:  /reductase/,
  };
  const p = patterns[enzClass];
  if (!p) return null;
  const m = enzyme.match(p);
  return m ? m[0] : null;
}

function makeText(x, y, content, cls, anchor) {
  const t = document.createElementNS(svgNS, 'text');
  t.setAttribute('x', x); t.setAttribute('y', y);
  if (anchor) t.setAttribute('text-anchor', anchor);
  if (cls) t.setAttribute('class', cls);

  if (typeof content !== 'string' || content.indexOf('@') === -1 || !/@(?:x:)?\w+\[/.test(content)) {
    t.innerHTML = content;
    return t;
  }

  // Has @markers — re-enable pointer events on the text (its CSS class
  // would otherwise set pointer-events:none, which blocks ALL descendant
  // hit testing in SVG including the clickable tspans).
  t.style.pointerEvents = 'auto';

  // Split into plain segments + clickable links.
  //   @key[display]     → disease link (red)
  //   @x:key[display]   → cross-reference jump (cyan) to a node or edge id
  const re = /@(x:)?(\w+)\[([^\]]+)\]/g;
  let lastIdx = 0;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (m.index > lastIdx) {
      const span = document.createElementNS(svgNS, 'tspan');
      span.innerHTML = content.slice(lastIdx, m.index);
      t.appendChild(span);
    }
    const isXref = m[1] === 'x:';
    const key = m[2];   // capture by value — `m` is reassigned each loop
    const disp = m[3];
    const link = document.createElementNS(svgNS, 'tspan');
    link.textContent = disp;
    if (isXref) {
      link.setAttribute('class', 'xref-link');
      link.setAttribute('data-xref', key);
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof focusXref === 'function') focusXref(key);
      });
    } else {
      link.setAttribute('class', 'disease-link');
      link.setAttribute('data-disease', key);
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof openDiseasePanel === 'function') openDiseasePanel(key);
      });
    }
    t.appendChild(link);
    lastIdx = re.lastIndex;
  }
  if (lastIdx < content.length) {
    const span = document.createElementNS(svgNS, 'tspan');
    span.innerHTML = content.slice(lastIdx);
    t.appendChild(span);
  }
  return t;
}

(function renderWatermarks() {
  const root = $('watermarks');
  const titleEl = makeText(TITLE.x, TITLE.y, TITLE.text, 'pathway-label title-text', 'middle');
  titleEl.setAttribute('font-size', 32);
  titleEl.setAttribute('fill', '#e6ecf5');
  titleEl.style.opacity = 0.85;
  root.appendChild(titleEl);
  WATERMARKS.forEach(w => {
    const t = makeText(w.x, w.y, w.text, `pathway-label wm ${w.cls}`, 'middle');
    t.setAttribute('font-size', 30);
    root.appendChild(t);
  });
})();

(function renderOrganelles() {
  const root = $('organelles');
  if (typeof ORGANELLES === 'undefined') return;
  ORGANELLES.forEach(o => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', `organelle org-${o.id}`);

    // Outer membrane (smooth rounded rect, slight fill)
    const outer = document.createElementNS(svgNS, 'rect');
    outer.setAttribute('class', 'mito-outer');
    outer.setAttribute('x', o.x); outer.setAttribute('y', o.y);
    outer.setAttribute('width', o.w); outer.setAttribute('height', o.h);
    outer.setAttribute('rx', o.rx); outer.setAttribute('ry', o.rx);
    outer.setAttribute('fill', o.color);
    outer.setAttribute('stroke', o.color);
    g.appendChild(outer);

    // Inner membrane (slightly inset, dashed to suggest cristae folds)
    const inset = 14;
    const inner = document.createElementNS(svgNS, 'rect');
    inner.setAttribute('class', 'mito-inner');
    inner.setAttribute('x', o.x + inset);
    inner.setAttribute('y', o.y + inset);
    inner.setAttribute('width', o.w - inset*2);
    inner.setAttribute('height', o.h - inset*2);
    inner.setAttribute('rx', o.rx - inset);
    inner.setAttribute('ry', o.rx - inset);
    inner.setAttribute('stroke', o.color);
    g.appendChild(inner);

    // Label inside top-left of the organelle
    const lbl = makeText(o.x + 32, o.y + 38, o.label, 'organelle-label', 'start');
    lbl.setAttribute('fill', o.color);
    g.appendChild(lbl);
    if (o.sub) {
      const sub = makeText(o.x + 32, o.y + 60, o.sub, 'organelle-sub', 'start');
      sub.setAttribute('fill', o.color);
      g.appendChild(sub);
    }

    root.appendChild(g);
  });
})();

(function renderUreaSplit() {
  if (typeof UREA_SPLIT === 'undefined') return;
  const u = UREA_SPLIT;
  const root = $('organelles');
  const g = document.createElementNS(svgNS, 'g');
  g.setAttribute('class', 'urea-split');

  // Mitochondrial zone band (top — CPS-I, OTC)
  const mito = document.createElementNS(svgNS, 'rect');
  mito.setAttribute('class', 'urea-zone-mito');
  mito.setAttribute('x', u.x); mito.setAttribute('y', u.top);
  mito.setAttribute('width', u.w); mito.setAttribute('height', u.membraneY - u.top);
  mito.setAttribute('rx', 16); mito.setAttribute('ry', 16);
  g.appendChild(mito);

  // Cytosolic zone band (bottom — synthetase, lyase, arginase)
  const cyto = document.createElementNS(svgNS, 'rect');
  cyto.setAttribute('class', 'urea-zone-cyto');
  cyto.setAttribute('x', u.x); cyto.setAttribute('y', u.membraneY);
  cyto.setAttribute('width', u.w); cyto.setAttribute('height', u.bottom - u.membraneY);
  cyto.setAttribute('rx', 16); cyto.setAttribute('ry', 16);
  g.appendChild(cyto);

  // The inner-membrane "doorway" line
  const mem = document.createElementNS(svgNS, 'line');
  mem.setAttribute('class', 'urea-membrane');
  mem.setAttribute('x1', u.x); mem.setAttribute('y1', u.membraneY);
  mem.setAttribute('x2', u.x + u.w); mem.setAttribute('y2', u.membraneY);
  g.appendChild(mem);

  // Zone labels
  g.appendChild(makeText(u.x + 20, u.top + 32, 'MITOCHONDRION', 'urea-zone-label mito', 'start'));
  g.appendChild(makeText(u.x + 20, u.bottom - 16, 'CYTOSOL', 'urea-zone-label cyto', 'start'));
  // Membrane annotation (left side, clear of the urea node stack)
  g.appendChild(makeText(u.x + 20, u.membraneY - 9, 'inner mitochondrial membrane — Citrulline crosses here', 'urea-membrane-label', 'start'));

  root.appendChild(g);
})();

// Shunt pathways — faint by default, lit up when their disease is clicked.
const SHUNT_ELS = [];
(function renderShunts() {
  if (typeof SHUNTS === 'undefined') return;
  const root = $('shunts');
  SHUNTS.forEach(s => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', `shunt shunt-${s.disease}`);
    g.setAttribute('data-disease', s.disease);

    // arrow from the accumulating metabolite to the shunt product
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('class', 'shunt-arrow');
    p.setAttribute('d', s.arrow);
    p.setAttribute('marker-end', 'url(#arr-shunt)');
    g.appendChild(p);

    // shunt-product node box
    const n = s.node;
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('class', 'shunt-box');
    rect.setAttribute('x', n.x); rect.setAttribute('y', n.y);
    rect.setAttribute('width', n.w); rect.setAttribute('height', n.h);
    rect.setAttribute('rx', 7); rect.setAttribute('ry', 7);
    g.appendChild(rect);
    const cx = n.x + n.w/2, cy = n.y + n.h/2;
    g.appendChild(makeText(cx, cy - 7, n.label, 'shunt-lbl', 'middle'));
    if (n.sub) g.appendChild(makeText(cx, cy + 11, n.sub, 'shunt-sub', 'middle'));

    // small descriptor along the arrow
    if (s.label) {
      g.appendChild(makeText(s.label.x, s.label.y, s.label.t, 'shunt-desc', s.label.anchor || 'middle'));
    }

    // clicking a shunt opens its disease
    g.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof openDiseasePanel === 'function') openDiseasePanel(s.disease);
    });

    root.appendChild(g);
    SHUNT_ELS.push({ el: g, disease: s.disease });
  });
})();

(function renderPathwayBoxes() {
  const root = $('pathway-boxes');
  Object.entries(PATHWAY_BOXES).forEach(([p, label]) => {
    const nodes = NODES.filter(n => n.p === p);
    if (!nodes.length) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      let x1, y1, x2, y2;
      if (n.shape === 'hexagon') {
        const r = n.hexR || 60;
        const s32 = r * 0.866;
        x1 = n.cx - s32; y1 = n.cy - r;
        x2 = n.cx + s32; y2 = n.cy + r;
      } else {
        x1 = n.x; y1 = n.y;
        x2 = n.x + n.w; y2 = n.y + n.h;
      }
      if (x1 < minX) minX = x1;
      if (y1 < minY) minY = y1;
      if (x2 > maxX) maxX = x2;
      if (y2 > maxY) maxY = y2;
    });
    const padX = 35, padTop = 42, padBottom = 28;
    const x = minX - padX;
    const y = minY - padTop;
    const w = (maxX - minX) + padX * 2;
    const h = (maxY - minY) + padTop + padBottom;

    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', `pathway-box pb-${p}`);

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', y);
    rect.setAttribute('width', w); rect.setAttribute('height', h);
    rect.setAttribute('rx', 16); rect.setAttribute('ry', 16);
    rect.setAttribute('fill', PATHWAYS[p]);
    rect.setAttribute('stroke', PATHWAYS[p]);
    g.appendChild(rect);

    const lbl = makeText(x + 18, y + 26, label, `box-label c-${p}`, 'start');
    lbl.setAttribute('font-size', 18);
    g.appendChild(lbl);

    root.appendChild(g);
  });
})();

(function renderPanels() {
  const root = $('panels');
  PANELS.forEach(p => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'infopanel');
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', p.x); rect.setAttribute('y', p.y);
    rect.setAttribute('width', p.w); rect.setAttribute('height', p.h);
    rect.setAttribute('stroke', p.stroke);
    if (p.fill) rect.setAttribute('fill', p.fill);
    if (p.dashed) rect.setAttribute('stroke-dasharray', '3 3');
    g.appendChild(rect);
    const cx = p.x + p.w/2;
    const tEl = makeText(cx, p.y + 22, p.title, `enz ${p.titleCls}`, 'middle');
    g.appendChild(tEl);
    p.lines.forEach((ln, i) => {
      const cls = ln.cls || 'cof';
      const lEl = makeText(cx, p.y + 42 + i*16, ln.t, cls, 'middle');
      g.appendChild(lEl);
    });
    root.appendChild(g);
  });
})();

const NODE_ELS = {};
(function renderNodes() {
  const root = $('nodes');
  NODES.forEach(n => {
    const hasClin = !!CLIN[n.id];
    const g = document.createElementNS(svgNS, 'g');
    let cls = `node tint-${n.p}`;
    if (n.hub) cls += ' hub';
    if (hasClin) cls += ' has-clinical';
    if (n.start) cls += ' start';
    g.setAttribute('class', cls);
    g.setAttribute('data-node', n.id);

    if (n.shape === 'hexagon') {
      const r = n.hexR || 60;
      const cx = n.cx, cy = n.cy;
      const s32 = r * 0.866;
      const points = [
        [cx + s32, cy - r/2],
        [cx, cy - r],
        [cx - s32, cy - r/2],
        [cx - s32, cy + r/2],
        [cx, cy + r],
        [cx + s32, cy + r/2],
      ].map(p => p.join(',')).join(' ');
      const poly = document.createElementNS(svgNS, 'polygon');
      poly.setAttribute('class', 'outline');
      poly.setAttribute('points', points);
      g.appendChild(poly);
      g.appendChild(makeText(cx, cy - 8, n.label, 'lbl', 'middle'));
      if (n.sub) g.appendChild(makeText(cx, cy + 18, n.sub, 'sub', 'middle'));
      // (Removed the "◆ START ◆" tag — the gold hexagon shape is distinctive enough,
      //  and the tag was overlapping the Hexokinase / Glucokinase enzyme label.)
      const hit = document.createElementNS(svgNS, 'polygon');
      hit.setAttribute('class', 'hit');
      const hitPoints = [
        [cx + s32 + 4, cy - r/2],
        [cx, cy - r - 6],
        [cx - s32 - 4, cy - r/2],
        [cx - s32 - 4, cy + r/2],
        [cx, cy + r + 6],
        [cx + s32 + 4, cy + r/2],
      ].map(p => p.join(',')).join(' ');
      hit.setAttribute('points', hitPoints);
      g.appendChild(hit);
    } else {
      const r = document.createElementNS(svgNS, 'rect');
      r.setAttribute('class', 'outline');
      r.setAttribute('x', n.x); r.setAttribute('y', n.y);
      r.setAttribute('width', n.w); r.setAttribute('height', n.h);
      g.appendChild(r);
      const cx = n.x + n.w/2, cy = n.y + n.h/2;
      const lblOffset = n.sub ? -7 : 0;
      g.appendChild(makeText(cx, cy + lblOffset, n.label, 'lbl', 'middle'));
      if (n.sub) g.appendChild(makeText(cx, cy + 10, n.sub, 'sub', 'middle'));
      if (n.hub) g.appendChild(makeText(n.x + 16, cy + lblOffset, '♛', 'hub-crown', 'middle'));
      const hit = document.createElementNS(svgNS, 'rect');
      hit.setAttribute('class', 'hit');
      hit.setAttribute('x', n.x-4); hit.setAttribute('y', n.y-4);
      hit.setAttribute('width', n.w+8); hit.setAttribute('height', n.h+8);
      g.appendChild(hit);
    }

    g.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNode(n.id);
    });
    g.addEventListener('mouseenter', () => { showStatus(n); });
    g.addEventListener('mouseleave', () => { if (!SELECTED) hideStatus(); else if (SELECTED && SELECTED.startsWith('node:')) showStatus(NODE_INDEX[SELECTED.slice(5)]); });

    root.appendChild(g);
    NODE_ELS[n.id] = g;
  });
})();

const EDGE_ELS = [];
(function renderEdges() {
  // Two layers so labels ALWAYS sit above ALL arrows (SVG paints in DOM
  // order — keeping every path below every label is the only way to stop
  // a later arrow from covering an earlier arrow's text).
  const pathRoot = $('edges');
  const labelRoot = $('edge-labels');

  EDGES.forEach(e => {
    // --- arrow path group (bottom layer) ---
    const g = document.createElementNS(svgNS, 'g');
    let groupCls = `edge p-${e.p}`;
    if (e.lowYield) groupCls += ' low-yield';
    g.setAttribute('class', groupCls);
    g.setAttribute('data-from', e.from);
    g.setAttribute('data-to', e.to);

    let geom = e.path;
    if (!geom) {
      const a = NODE_INDEX[e.from], b = NODE_INDEX[e.to];
      const ax = a.x + a.w/2, ay = a.y + a.h;
      const bx = b.x + b.w/2, by = b.y;
      geom = `M ${ax} ${ay} L ${bx} ${by}`;
    }
    const p = document.createElementNS(svgNS, 'path');
    let cls = `line c-${e.p}`;
    if (e.thick) cls += ' thick';
    if (e.dashed) cls += ' dashed';
    if (e.rl) cls += ' rl';
    p.setAttribute('class', cls);
    p.setAttribute('d', geom);
    if (!e.noArrow) p.setAttribute('marker-end', `url(#arr-${e.p})`);
    if (e.reversible && !e.noArrow) p.setAttribute('marker-start', `url(#arr-${e.p})`);
    g.appendChild(p);
    pathRoot.appendChild(g);

    // --- label group (top layer) ---
    const lg = document.createElementNS(svgNS, 'g');
    let lgCls = `edge-label p-${e.p}`;
    if (e.lowYield) lgCls += ' low-yield';
    lg.setAttribute('class', lgCls);

    if (e.enzyme) {
      const enzCls = e.rl ? `enz rl c-${e.p}` : `enz c-${e.p}`;
      let enzText = e.enzyme;
      if (e.enzClass && typeof ENZ_CLASS !== 'undefined' && ENZ_CLASS[e.enzClass]) {
        const word = e.classWord || findClassWord(e.enzyme, e.enzClass);
        if (word) {
          enzText = e.enzyme.replace(
            word,
            `<tspan class="ec-mark ec-${e.enzClass}">${word}</tspan>`
          );
        }
      }
      lg.appendChild(makeText(e.labelX, e.labelY, enzText, enzCls, e.anchor || 'start'));
    }
    if (e.cof) {
      lg.appendChild(makeText(e.labelX, (e.labelY||0) + 14, markCofactors(e.cof), 'cof', e.anchor || 'start'));
    }
    if (e.notes) {
      let cy = (e.labelY || 0) + 28;
      e.notes.forEach((n, i) => {
        lg.appendChild(makeText(e.labelX, cy + i*14, markCofactors(n.t), n.c || 'reg', e.anchor || 'start'));
      });
    }
    labelRoot.appendChild(lg);

    EDGE_ELS.push({ el: g, lbl: lg, from: e.from, to: e.to, edge: e });
  });
})();

// Activate / deactivate an edge entry (both its arrow group and label group).
function edgeActive(entry, on) {
  entry.el.classList.toggle('active', on);
  if (entry.lbl) entry.lbl.classList.toggle('active', on);
}
function clearEdgesActive() {
  EDGE_ELS.forEach(e => { e.el.classList.remove('active'); if (e.lbl) e.lbl.classList.remove('active'); });
}

// Paint a translucent color-coded box behind every marked tspan:
//   .ec-mark   → enzyme class (carb / dh / kin / tram / phos / red)
//   .cof-mark  → NAD-family or FAD-family substrate
// Runs once after edges render — uses getBBox() which is accurate now
// that the elements are in the live DOM.
(function paintHighlightBoxes() {
  const padX = 3, padY = 2;
  document.querySelectorAll('#edge-labels tspan.ec-mark, #edge-labels tspan.cof-mark').forEach(tspan => {
    let bb;
    try { bb = tspan.getBBox(); } catch (e) { return; }
    if (!bb || bb.width === 0) return;

    const isEc = tspan.classList.contains('ec-mark');
    const prefix = isEc ? 'ec-' : 'cof-';
    const cls = Array.from(tspan.classList).find(c => c !== prefix + 'mark' && c.indexOf(prefix) === 0);
    if (!cls) return;
    const key = cls.slice(prefix.length); // 'ec-carb' → 'carb', 'cof-nad' → 'nad'

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', bb.x - padX);
    rect.setAttribute('y', bb.y - padY);
    rect.setAttribute('width', bb.width + padX * 2);
    rect.setAttribute('height', bb.height + padY * 2);
    rect.setAttribute('rx', 3); rect.setAttribute('ry', 3);
    rect.setAttribute('class', `${prefix}bg ${prefix}bg-${key}`);

    const textEl = tspan.closest('text');
    if (textEl && textEl.parentElement) {
      textEl.parentElement.insertBefore(rect, textEl);
    }
  });
})();

// Lookup edges by their optional `id` — used for cross-reference jumps.
const EDGE_BY_ID = {};
EDGE_ELS.forEach(en => { if (en.edge.id) EDGE_BY_ID[en.edge.id] = en; });


/* ---------- 2. INTERACTION ---------- */

let SELECTED = null;
const sb = $('statusbar');
const rp = $('rightpanel');

function openPanel(kind, key) {
  let title, tag, tagColor, why, pearls, conns = [];

  if (kind === 'node') {
    const n = NODE_INDEX[key];
    if (!n) return;
    title = n.label;
    const pName = PATHWAY_NAMES[n.p] || n.p;
    tag = (n.hub ? 'HUB · ' : '') + pName;
    tagColor = PATHWAYS[n.p];
    const c = CLIN[n.id];
    if (c) { why = c.why; pearls = c.pearls; }
    EDGES.forEach(e => {
      if (e.from === key) {
        const t = NODE_INDEX[e.to];
        if (t) conns.push({ dir: '→', other: t.label, enz: e.enzyme || '', pathway: e.p });
      } else if (e.to === key && (e.reversible || e.dashed)) {
        const t = NODE_INDEX[e.from];
        if (t) conns.push({ dir: '↔', other: t.label, enz: e.enzyme || '', pathway: e.p });
      } else if (e.to === key) {
        const t = NODE_INDEX[e.from];
        if (t) conns.push({ dir: '←', other: t.label, enz: e.enzyme || '', pathway: e.p });
      }
    });
  } else if (kind === 'pathway') {
    const pName = PATHWAY_NAMES[key] || key;
    title = pName;
    tag = 'PATHWAY';
    tagColor = PATHWAYS[key];
    const c = CLIN_PATHWAY[key];
    if (c) { why = c.why; pearls = c.pearls; }
  }

  $('rp-title').textContent = title || '—';
  const tagEl = $('rp-tag');
  tagEl.textContent = tag || '';
  tagEl.style.background = (tagColor || '#2b3a5e') + '33';
  tagEl.style.color = tagColor || '#cfdcf5';
  tagEl.style.border = '1px solid ' + (tagColor || '#2b3a5e') + '55';

  let body = '';
  if (why) {
    body += `<h3>Why it matters</h3><div class="rp-why">${why}</div>`;
  }
  if (pearls && pearls.length) {
    body += `<h3>High-yield pearls</h3><ul class="pearls">`;
    pearls.forEach(p => { body += `<li class="${p.cls||''}">${p.t}</li>`; });
    body += `</ul>`;
  }
  if (kind === 'node' && conns.length) {
    body += `<h3>Connections</h3><div class="rp-conn">`;
    conns.forEach(c => {
      const col = PATHWAYS[c.pathway] || '#cad9f0';
      body += `<div><span class="arrow">${c.dir}</span><b style="color:${col}">${c.other}</b>` + (c.enz ? ` <span style="color:#9caec7"> · ${expandEnzyme(c.enz)}</span>` : '') + `</div>`;
    });
    body += `</div>`;
  }
  if (!why && !pearls) {
    body += `<div class="rp-empty">No clinical pearl card for this intermediate — it\'s a structural step. See connections below.</div>`;
  }
  $('rp-body').innerHTML = body;
  rp.classList.add('open');
  rp.setAttribute('aria-hidden', 'false');
  document.body.classList.add('rp-open');
}

window.closePanel = function() {
  rp.classList.remove('open');
  rp.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('rp-open');
};

function selectNode(id) {
  SELECTED = 'node:' + id;
  svg.classList.add('isolated');
  Object.values(NODE_ELS).forEach(el => el.classList.remove('active', 'selected'));
  clearEdgesActive();
  const target = NODE_ELS[id];
  if (!target) return;
  target.classList.add('active', 'selected');
  EDGE_ELS.forEach(e => {
    if (e.from === id || e.to === id) {
      edgeActive(e, true);
      const otherId = e.from === id ? e.to : e.from;
      const other = NODE_ELS[otherId];
      if (other) other.classList.add('active');
    }
  });
  document.querySelectorAll('#legend .row').forEach(r => r.classList.remove('active'));
  document.querySelectorAll('.vit-chip, .enzclass-chip, .disease-row').forEach(c => c.classList.remove('active'));
  showStatus(NODE_INDEX[id]);
  openPanel('node', id);
}

function selectPathway(pName) {
  SELECTED = 'pathway:' + pName;
  svg.classList.add('isolated');
  Object.values(NODE_ELS).forEach(el => el.classList.remove('active', 'selected'));
  clearEdgesActive();
  NODES.forEach(n => {
    if (n.p === pName) NODE_ELS[n.id].classList.add('active');
  });
  EDGES.forEach((e, i) => {
    if (e.p === pName) {
      edgeActive(EDGE_ELS[i], true);
      if (NODE_ELS[e.from]) NODE_ELS[e.from].classList.add('active');
      if (NODE_ELS[e.to])   NODE_ELS[e.to].classList.add('active');
    }
  });
  $('sb-title').innerHTML = `${PATHWAY_NAMES[pName] || pName}`;
  $('sb-sub').innerHTML = 'Click a node inside for pearls.';
  sb.classList.add('visible');
  document.querySelectorAll('#legend .row').forEach(r => r.classList.toggle('active', r.dataset.pathway === pName));
  document.querySelectorAll('.vit-chip, .enzclass-chip, .disease-row').forEach(c => c.classList.remove('active'));
  openPanel('pathway', pName);
}

function selectVitamin(vit) {
  SELECTED = 'vit:' + vit;
  svg.classList.add('isolated');
  Object.values(NODE_ELS).forEach(el => el.classList.remove('active', 'selected'));
  clearEdgesActive();
  EDGES.forEach((e, i) => {
    if (e.vits && e.vits.includes(vit)) {
      edgeActive(EDGE_ELS[i], true);
      if (NODE_ELS[e.from]) NODE_ELS[e.from].classList.add('active');
      if (NODE_ELS[e.to])   NODE_ELS[e.to].classList.add('active');
    }
  });
  document.querySelectorAll('.vit-chip').forEach(c => c.classList.toggle('active', c.dataset.vit === vit));
  document.querySelectorAll('#legend .row, .enzclass-chip, .disease-row').forEach(c => c.classList.remove('active'));
  openVitaminPanel(vit);
}

function openVitaminPanel(vit) {
  const v = CLIN_VITAMIN[vit];
  if (!v) return;
  $('rp-title').textContent = v.name;
  const tagEl = $('rp-tag');
  tagEl.textContent = 'VITAMIN COFACTOR  ·  ' + v.role;
  tagEl.style.background = VIT_COLOR[vit] + '22';
  tagEl.style.color = VIT_COLOR[vit];
  tagEl.style.border = '1px solid ' + VIT_COLOR[vit] + '55';

  let body = '';
  body += `<h3>What it does</h3><div class="rp-why">${v.why}</div>`;
  body += `<h3>High-yield pearls</h3><ul class="pearls">`;
  v.pearls.forEach(p => { body += `<li class="${p.cls||''}">${p.t}</li>`; });
  body += `</ul>`;

  const usages = [];
  EDGES.forEach(e => {
    if (e.vits && e.vits.includes(vit) && e.enzyme) {
      usages.push({ enz: e.enzyme, p: e.p });
    }
  });
  if (usages.length) {
    body += `<h3>Where it acts on this map</h3><div class="rp-conn">`;
    usages.forEach(u => {
      const col = PATHWAYS[u.p] || '#cad9f0';
      body += `<div><span class="arrow" style="color:${VIT_COLOR[vit]}">●</span><b style="color:${col}">${expandEnzyme(u.enz)}</b></div>`;
    });
    body += `</div>`;
  }
  $('rp-body').innerHTML = body;
  rp.classList.add('open');
  rp.setAttribute('aria-hidden', 'false');
  document.body.classList.add('rp-open');
}

function clearSelection() {
  SELECTED = null;
  svg.classList.remove('isolated');
  Object.values(NODE_ELS).forEach(el => el.classList.remove('active', 'selected'));
  clearEdgesActive();
  clearDiseaseOverlay();
  document.querySelectorAll('.shunt').forEach(s => s.classList.remove('active'));
  hideStatus();
  document.querySelectorAll('#legend .row').forEach(r => r.classList.remove('active'));
  document.querySelectorAll('.vit-chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.enzclass-chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.disease-row').forEach(r => r.classList.remove('active'));
  closePanel();
}
window.clearSelection = clearSelection;

function showStatus(n) {
  if (!n) return;
  const pName = PATHWAY_NAMES[n.p] || n.p;
  $('sb-title').innerHTML = `${n.label}  ·  <span style="color:${PATHWAYS[n.p]}">${pName}</span>`;
  $('sb-sub').innerHTML = n.sub || '';
  sb.classList.add('visible');
}
function hideStatus() { sb.classList.remove('visible'); }

$('canvas-container').addEventListener('click', (e) => {
  if (e.target.id === 'canvas-container' || e.target.id === 'map' || e.target.tagName === 'svg' || e.target === svg) {
    if (SELECTED) clearSelection();
  }
});

document.querySelectorAll('#legend .row').forEach(r => {
  r.addEventListener('click', () => {
    const p = r.dataset.pathway;
    if (SELECTED === 'pathway:' + p) clearSelection();
    else selectPathway(p);
  });
});

document.querySelectorAll('.vit-chip').forEach(c => {
  c.addEventListener('click', () => {
    const vit = c.dataset.vit;
    if (SELECTED === 'vit:' + vit) clearSelection();
    else selectVitamin(vit);
  });
});

/* ENZYME-CLASS BUCKETS — highlight all enzymes of a class + teach the bucket */
function selectEnzClass(cls) {
  SELECTED = 'enzclass:' + cls;
  svg.classList.add('isolated');
  Object.values(NODE_ELS).forEach(el => el.classList.remove('active', 'selected'));
  clearEdgesActive();
  clearDiseaseOverlay();
  document.querySelectorAll('.shunt').forEach(s => s.classList.remove('active'));
  EDGES.forEach((e, i) => {
    if (e.enzClass === cls) {
      edgeActive(EDGE_ELS[i], true);
      if (NODE_ELS[e.from]) NODE_ELS[e.from].classList.add('active');
      if (NODE_ELS[e.to])   NODE_ELS[e.to].classList.add('active');
    }
  });
  document.querySelectorAll('.enzclass-chip').forEach(c => c.classList.toggle('active', c.dataset.ec === cls));
  document.querySelectorAll('.vit-chip, .disease-row').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('#legend .row').forEach(r => r.classList.remove('active'));
  openEnzClassPanel(cls);
}

function openEnzClassPanel(cls) {
  const info = (typeof ENZ_CLASS !== 'undefined') ? ENZ_CLASS[cls] : null;
  if (!info) return;
  $('rp-title').textContent = info.name;
  const tagEl = $('rp-tag');
  tagEl.textContent = 'ENZYME CLASS  ·  ' + info.cofactor;
  tagEl.style.background = info.color + '22';
  tagEl.style.color = info.color;
  tagEl.style.border = '1px solid ' + info.color + '55';

  let body = '';
  body += `<h3>What they do</h3><div class="rp-why">${info.does}</div>`;
  body += `<h3>Cofactor (the bucket rule)</h3><div class="rp-why" style="color:${info.color};font-weight:700">${info.cofactor}</div>`;
  if (info.members && info.members.length) {
    body += `<h3>High-yield members</h3><ul class="pearls">`;
    info.members.forEach(m => { body += `<li class="">${m}</li>`; });
    body += `</ul>`;
  }
  if (info.pearls && info.pearls.length) {
    body += `<h3>Pearls</h3><ul class="pearls">`;
    info.pearls.forEach(p => { body += `<li class="${p.cls||''}">${p.t}</li>`; });
    body += `</ul>`;
  }
  $('rp-body').innerHTML = body;
  rp.classList.add('open');
  rp.setAttribute('aria-hidden', 'false');
  document.body.classList.add('rp-open');
}

document.querySelectorAll('.enzclass-chip').forEach(c => {
  c.addEventListener('click', () => {
    const ec = c.dataset.ec;
    if (SELECTED === 'enzclass:' + ec) clearSelection();
    else selectEnzClass(ec);
  });
});

/* DISEASE BROWSER — grouped, collapsible list in the sidebar */
(function renderDiseaseList() {
  const root = $('disease-list');
  if (!root || typeof DISEASES === 'undefined') return;
  const groups = (typeof DISEASE_GROUPS !== 'undefined')
    ? DISEASE_GROUPS
    : [{ label: 'All', keys: Object.keys(DISEASES) }];
  groups.forEach(g => {
    const h = document.createElement('div');
    h.className = 'disease-group-label';
    h.textContent = g.label;
    root.appendChild(h);
    g.keys.forEach(key => {
      const d = DISEASES[key];
      if (!d) return;
      const row = document.createElement('button');
      row.className = 'disease-row';
      row.dataset.disease = key;
      row.innerHTML = `<b>${d.name}</b>` + (d.enzyme ? `<span>${d.enzyme}</span>` : '');
      row.addEventListener('click', () => {
        if (SELECTED === 'disease:' + key) clearSelection();
        else openDiseasePanel(key);
      });
      root.appendChild(row);
    });
  });
})();

function toggleDiseaseList() {
  const list = $('disease-list');
  const btn = $('disease-toggle');
  if (list) list.classList.toggle('open');
  if (btn) btn.classList.toggle('open');
}
window.toggleDiseaseList = toggleDiseaseList;

/* DISEASE PANEL — opened by clicking a disease-link tspan on the map */
function openDiseasePanel(key) {
  if (typeof DISEASES === 'undefined') return;
  const d = DISEASES[key];
  if (!d) return;
  SELECTED = 'disease:' + key;

  // Reset prior highlight state
  Object.values(NODE_ELS).forEach(el => el.classList.remove('active', 'selected'));
  clearEdgesActive();
  clearDiseaseOverlay();
  document.querySelectorAll('.shunt').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('#legend .row').forEach(r => r.classList.remove('active'));
  document.querySelectorAll('.vit-chip, .enzclass-chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.disease-row').forEach(r => r.classList.toggle('active', r.dataset.disease === key));

  // If this disease maps to a blocked enzyme step: isolate the map, draw the
  // red ✗ on that reaction, highlight its endpoints + any shunt pathway.
  const blockId = (typeof DISEASE_BLOCK !== 'undefined') ? DISEASE_BLOCK[key] : null;
  if (blockId && typeof EDGE_BY_ID !== 'undefined' && EDGE_BY_ID[blockId]) {
    svg.classList.add('isolated');
    const en = EDGE_BY_ID[blockId];
    edgeActive(en, true);
    if (NODE_ELS[en.from]) NODE_ELS[en.from].classList.add('active');
    if (NODE_ELS[en.to])   NODE_ELS[en.to].classList.add('active');
    drawBlockX(en);
    SHUNT_ELS.forEach(s => { if (s.disease === key) s.el.classList.add('active'); });
  } else {
    // No mappable block — leave the full map visible behind the card.
    svg.classList.remove('isolated');
  }

  $('rp-title').textContent = d.name;
  const tagEl = $('rp-tag');
  tagEl.textContent = 'DISEASE  ·  ' + (d.enzyme || '');
  tagEl.style.background = 'rgba(255, 90, 95, 0.16)';
  tagEl.style.color = '#ffd4d6';
  tagEl.style.border = '1px solid rgba(255, 90, 95, 0.55)';

  let body = '';
  if (d.why) {
    body += `<h3>What happens</h3><div class="rp-why">${d.why}</div>`;
  }
  if (d.pearls && d.pearls.length) {
    body += `<h3>High-yield pearls</h3><ul class="pearls">`;
    d.pearls.forEach(p => { body += `<li class="${p.cls||''}">${p.t}</li>`; });
    body += `</ul>`;
  }
  $('rp-body').innerHTML = body;
  rp.classList.add('open');
  rp.setAttribute('aria-hidden', 'false');
  document.body.classList.add('rp-open');
  $('rp-body').scrollTop = 0;
}
window.openDiseasePanel = openDiseasePanel;

/* Red ✗ drawn over a blocked enzyme step (the deficient reaction) */
function clearDiseaseOverlay() {
  const o = $('disease-overlay');
  if (o) while (o.firstChild) o.removeChild(o.firstChild);
}
function drawBlockX(entry) {
  const overlay = $('disease-overlay');
  const path = entry.el.querySelector('path.line');
  if (!overlay || !path) return;
  let pt;
  try { pt = path.getPointAtLength(path.getTotalLength() / 2); }
  catch (e) { return; }
  const s = 17;
  const g = document.createElementNS(svgNS, 'g');
  g.setAttribute('class', 'block-x');
  const disc = document.createElementNS(svgNS, 'circle');
  disc.setAttribute('cx', pt.x); disc.setAttribute('cy', pt.y);
  disc.setAttribute('r', s + 7);
  disc.setAttribute('class', 'block-x-disc');
  g.appendChild(disc);
  [[-s,-s,s,s], [-s,s,s,-s]].forEach(d => {
    const l = document.createElementNS(svgNS, 'line');
    l.setAttribute('x1', pt.x + d[0]); l.setAttribute('y1', pt.y + d[1]);
    l.setAttribute('x2', pt.x + d[2]); l.setAttribute('y2', pt.y + d[3]);
    l.setAttribute('class', 'block-x-line');
    g.appendChild(l);
  });
  overlay.appendChild(g);
}

/* CROSS-REFERENCE — jump from a mention to the actual step elsewhere */
function pulseEl(el) {
  if (!el) return;
  el.classList.add('xref-pulse');
  setTimeout(() => el.classList.remove('xref-pulse'), 1700);
}

function focusXref(key) {
  // Node target → behave like clicking that metabolite, then pan + pulse
  if (NODE_INDEX[key]) {
    selectNode(key);
    focusOnNode(key, 0.9);
    pulseEl(NODE_ELS[key]);
    return;
  }
  // Edge target → isolate just that reaction, pan to it, pulse
  const en = (typeof EDGE_BY_ID !== 'undefined') ? EDGE_BY_ID[key] : null;
  if (!en) return;
  const e = en.edge;
  SELECTED = 'xref:' + key;
  svg.classList.add('isolated');
  Object.values(NODE_ELS).forEach(el => el.classList.remove('active', 'selected'));
  clearEdgesActive();
  document.querySelectorAll('#legend .row').forEach(r => r.classList.remove('active'));
  document.querySelectorAll('.vit-chip').forEach(c => c.classList.remove('active'));
  edgeActive(en, true);
  if (NODE_ELS[e.from]) NODE_ELS[e.from].classList.add('active');
  if (NODE_ELS[e.to])   NODE_ELS[e.to].classList.add('active');
  const a = NODE_INDEX[e.from], b = NODE_INDEX[e.to];
  const ca = centerOfNode(a), cb = centerOfNode(b);
  animateCameraTo((ca[0] + cb[0]) / 2, (ca[1] + cb[1]) / 2, 1.0);
  pulseEl(en.el);
}
window.focusXref = focusXref;


/* ---------- 3. MODE TOGGLE ---------- */

const compToggle = $('comp-toggle');
const modeSub = $('mode-sub');
function setMode(comprehensive) {
  if (comprehensive) {
    svg.classList.remove('essential');
    modeSub.textContent = 'ON — showing every enzyme (deeper view)';
  } else {
    svg.classList.add('essential');
    modeSub.textContent = 'OFF — showing only Step 1 high-yield enzymes';
  }
}
compToggle.addEventListener('change', () => setMode(compToggle.checked));
setMode(false); // default: essential mode


/* ---------- 4. PAN / ZOOM ---------- */

const container = $('canvas-container');
const transform = $('canvas-transform');
const zoomDisp = $('zoomdisplay');
const SVG_W = 4200, SVG_H = 3000;
const state = { x: 0, y: 0, scale: 0.4 };

function applyTransform() {
  transform.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
  zoomDisp.textContent = Math.round(state.scale * 100) + '%';
  updateZoomLabels();
}

function updateZoomLabels() {
  const s = state.scale;
  const wmFont = Math.max(22, Math.min(130, 36 / s));
  const titleFont = Math.max(30, Math.min(160, 42 / s));

  document.querySelectorAll('#watermarks .wm').forEach(el => el.setAttribute('font-size', wmFont));
  const titleEl = document.querySelector('#watermarks .title-text');
  if (titleEl) titleEl.setAttribute('font-size', titleFont);
  // Pathway box labels: keep readable at all zooms (clamped inverse scaling)
  const boxFont = Math.max(14, Math.min(60, 20 / s));
  document.querySelectorAll('#pathway-boxes text.box-label').forEach(el => el.setAttribute('font-size', boxFont));

  const detailOp = Math.max(0, Math.min(1, (s - 0.18) / 0.25));
  document.querySelectorAll('#edge-labels text.reg, #edge-labels text.note').forEach(el => el.style.opacity = detailOp);
  const cofOp = Math.max(0, Math.min(1, (s - 0.13) / 0.18));
  document.querySelectorAll('#edge-labels text.cof').forEach(el => el.style.opacity = cofOp);
  const enzOp = Math.max(0.35, Math.min(1, (s - 0.08) / 0.2));
  document.querySelectorAll('#edge-labels text.enz').forEach(el => el.style.opacity = enzOp);
  document.querySelectorAll('#nodes text.sub').forEach(el => el.style.opacity = detailOp);
  document.querySelectorAll('#panels text').forEach(el => el.style.opacity = Math.max(0, Math.min(1, (s - 0.2) / 0.2)));
}

function fitAll() {
  const cw = container.clientWidth, ch = container.clientHeight;
  const s = Math.min(cw / SVG_W, ch / SVG_H) * 0.96;
  state.scale = s;
  state.x = (cw - SVG_W * s) / 2;
  state.y = (ch - SVG_H * s) / 2;
  applyTransform();
}
window.fitAll = fitAll;

window.zoomBy = function (factor) {
  const cw = container.clientWidth, ch = container.clientHeight;
  const cx = cw / 2, cy = ch / 2;
  const newScale = Math.max(0.05, Math.min(8, state.scale * factor));
  const sf = newScale / state.scale;
  state.x = cx - sf * (cx - state.x);
  state.y = cy - sf * (cy - state.y);
  state.scale = newScale;
  applyTransform();
};

let dragging = false, dragMoved = false;
let lastX = 0, lastY = 0;
container.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  if (rp.contains(e.target)) return;
  dragging = true; dragMoved = false;
  lastX = e.clientX; lastY = e.clientY;
  container.classList.add('dragging');
});
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  if (Math.abs(dx) + Math.abs(dy) > 2) dragMoved = true;
  lastX = e.clientX; lastY = e.clientY;
  state.x += dx; state.y += dy;
  applyTransform();
});
window.addEventListener('mouseup', () => {
  dragging = false;
  container.classList.remove('dragging');
});
window.addEventListener('click', (e) => {
  if (dragMoved) { e.stopPropagation(); e.preventDefault(); dragMoved = false; }
}, true);

container.addEventListener('wheel', (e) => {
  if (rp.contains(e.target)) return;
  e.preventDefault();
  const rect = container.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  const newScale = Math.max(0.05, Math.min(8, state.scale * factor));
  const sf = newScale / state.scale;
  state.x = mx - sf * (mx - state.x);
  state.y = my - sf * (my - state.y);
  state.scale = newScale;
  applyTransform();
}, { passive: false });

let touchStart = null, touchDist = null;
container.addEventListener('touchstart', (e) => {
  if (rp.contains(e.target)) return;
  if (e.touches.length === 1) {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, sx: state.x, sy: state.y };
  } else if (e.touches.length === 2) {
    touchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY);
  }
});
container.addEventListener('touchmove', (e) => {
  if (rp.contains(e.target)) return;
  e.preventDefault();
  if (e.touches.length === 1 && touchStart) {
    state.x = touchStart.sx + (e.touches[0].clientX - touchStart.x);
    state.y = touchStart.sy + (e.touches[0].clientY - touchStart.y);
    applyTransform();
  } else if (e.touches.length === 2 && touchDist) {
    const nd = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY);
    const factor = nd / touchDist;
    touchDist = nd;
    const rect = container.getBoundingClientRect();
    const mx = (e.touches[0].clientX + e.touches[1].clientX)/2 - rect.left;
    const my = (e.touches[0].clientY + e.touches[1].clientY)/2 - rect.top;
    const newScale = Math.max(0.05, Math.min(8, state.scale * factor));
    const sf = newScale / state.scale;
    state.x = mx - sf * (mx - state.x);
    state.y = my - sf * (my - state.y);
    state.scale = newScale;
    applyTransform();
  }
}, { passive: false });
container.addEventListener('touchend', () => { touchStart = null; touchDist = null; });

window.addEventListener('load', fitAll);
fitAll();


/* ====================================================================== */
/*  5. TUTOR MODE — guided walkthrough                                     */
/* ====================================================================== */

let TUTOR_ACTIVE = false;
let TUTOR_STEP = 0;
let TUTOR_LESSONS = (typeof TUTOR !== 'undefined') ? TUTOR : [];  // current track's lessons

// Smooth animated pan/zoom to a target SVG point.
// For tutor mode, we shift the target left so the right-side card has room.
function animateCameraTo(targetX, targetY, targetScale, durMs = 550) {
  const startX = state.x, startY = state.y, startS = state.scale;
  const cw = container.clientWidth, ch = container.clientHeight;
  // right panel (tutor card or pearl card) is ~380px → shift focal point left
  const rightOffset = (TUTOR_ACTIVE || document.body.classList.contains('rp-open')) ? 380 : 0;
  const focalX = (cw - rightOffset) / 2;
  const focalY = ch / 2;
  const endX = focalX - targetX * targetScale;
  const endY = focalY - targetY * targetScale;
  const t0 = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - t0) / durMs);
    const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; // easeInOutCubic
    state.x = startX + (endX - startX) * e;
    state.y = startY + (endY - startY) * e;
    state.scale = startS + (targetScale - startS) * e;
    applyTransform();
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function centerOfNode(n) {
  if (n.shape === 'hexagon') return [n.cx, n.cy];
  return [n.x + n.w / 2, n.y + n.h / 2];
}

function focusOnNode(id, zoom = 0.85) {
  const n = NODE_INDEX[id];
  if (!n) return;
  const [tx, ty] = centerOfNode(n);
  animateCameraTo(tx, ty, zoom);
}

function focusOnPathwayNodes(pName) {
  const nodes = NODES.filter(n => n.p === pName);
  if (!nodes.length) return;
  const pts = nodes.map(centerOfNode);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  // fit width/height with some margin
  const cw = container.clientWidth - (TUTOR_ACTIVE ? 380 : 0);
  const ch = container.clientHeight;
  const pad = 220;
  const sx = cw / (maxX - minX + pad * 2);
  const sy = ch / (maxY - minY + pad * 2);
  const zoom = Math.max(0.25, Math.min(1.2, Math.min(sx, sy)));
  animateCameraTo(cx, cy, zoom);
}

// Build the track-picker menu under the "Guided tutor" button.
(function renderTourMenu() {
  const menu = $('tour-menu');
  if (!menu || typeof TOURS === 'undefined') return;
  TOURS.forEach(t => {
    const b = document.createElement('button');
    b.className = 'tour-item';
    b.innerHTML = `<b>${t.title}</b><span>${t.sub} · ${t.lessons.length} steps</span>`;
    b.addEventListener('click', () => startTour(t.id));
    menu.appendChild(b);
  });
})();

function toggleTourMenu() {
  const menu = $('tour-menu');
  if (menu) menu.classList.toggle('open');
}
window.toggleTourMenu = toggleTourMenu;

function startTour(trackId) {
  const track = (typeof TOURS !== 'undefined') ? TOURS.find(t => t.id === trackId) : null;
  TUTOR_LESSONS = track ? track.lessons : (typeof TUTOR !== 'undefined' ? TUTOR : []);
  TUTOR_ACTIVE = true;
  TUTOR_STEP = 0;
  const menu = $('tour-menu');
  if (menu) menu.classList.remove('open');
  document.body.classList.add('tutor-active');
  renderTutorStep();
}
window.startTour = startTour;

function exitTutor() {
  TUTOR_ACTIVE = false;
  document.body.classList.remove('tutor-active');
  clearSelection();
  fitAll();
}
window.exitTutor = exitTutor;

function tutorNext() {
  if (TUTOR_STEP < TUTOR_LESSONS.length - 1) {
    TUTOR_STEP++;
    renderTutorStep();
  } else {
    exitTutor();
  }
}
window.tutorNext = tutorNext;

function tutorPrev() {
  if (TUTOR_STEP > 0) {
    TUTOR_STEP--;
    renderTutorStep();
  }
}
window.tutorPrev = tutorPrev;

function renderTutorStep() {
  const lesson = TUTOR_LESSONS[TUTOR_STEP];
  if (!lesson) return;

  // Update camera + isolation focus
  if (lesson.focus) {
    const f = lesson.focus;
    // clear previous isolation state without closing the panel
    svg.classList.remove('isolated');
    Object.values(NODE_ELS).forEach(el => el.classList.remove('active', 'selected'));
    clearEdgesActive();
    document.querySelectorAll('#legend .row').forEach(r => r.classList.remove('active'));
    document.querySelectorAll('.vit-chip').forEach(c => c.classList.remove('active'));

    if (f.type === 'node') {
      svg.classList.add('isolated');
      const target = NODE_ELS[f.id];
      if (target) target.classList.add('active', 'selected');
      EDGE_ELS.forEach(e => {
        if (e.from === f.id || e.to === f.id) {
          edgeActive(e, true);
          const other = e.from === f.id ? e.to : e.from;
          if (NODE_ELS[other]) NODE_ELS[other].classList.add('active');
        }
      });
      focusOnNode(f.id, f.zoom || 0.85);
    } else if (f.type === 'pathway') {
      svg.classList.add('isolated');
      NODES.forEach(n => { if (n.p === f.id) NODE_ELS[n.id].classList.add('active'); });
      EDGES.forEach((e, i) => {
        if (e.p === f.id) {
          edgeActive(EDGE_ELS[i], true);
          if (NODE_ELS[e.from]) NODE_ELS[e.from].classList.add('active');
          if (NODE_ELS[e.to])   NODE_ELS[e.to].classList.add('active');
        }
      });
      focusOnPathwayNodes(f.id);
    } else if (f.type === 'vitamin') {
      svg.classList.add('isolated');
      EDGES.forEach((e, i) => {
        if (e.vits && e.vits.includes(f.id)) {
          edgeActive(EDGE_ELS[i], true);
          if (NODE_ELS[e.from]) NODE_ELS[e.from].classList.add('active');
          if (NODE_ELS[e.to])   NODE_ELS[e.to].classList.add('active');
        }
      });
    } else if (f.type === 'overview') {
      const cw = container.clientWidth - (TUTOR_ACTIVE ? 380 : 0);
      const ch = container.clientHeight;
      const s = Math.min(cw / SVG_W, ch / SVG_H) * 0.94;
      animateCameraTo(SVG_W / 2, SVG_H / 2, s);
    }
  }

  // Render lesson card into the right panel
  const total = TUTOR_LESSONS.length;
  $('rp-title').innerHTML = lesson.title;
  const tagEl = $('rp-tag');
  tagEl.textContent = `LESSON ${TUTOR_STEP + 1} OF ${total}`;
  tagEl.style.background = 'rgba(184,164,245,0.18)';
  tagEl.style.color = '#d6c2ff';
  tagEl.style.border = '1px solid rgba(184,164,245,0.45)';

  const isFirst = TUTOR_STEP === 0;
  const isLast = TUTOR_STEP === total - 1;
  const nextLabel = isLast ? 'Finish ✓' : 'Next →';

  $('rp-body').innerHTML = `
    <div class="tutor-card">
      <div class="lesson-content">${lesson.content}</div>
      <div class="tutor-nav">
        <button onclick="tutorPrev()" ${isFirst ? 'disabled' : ''}>← Previous</button>
        <button class="tutor-next" onclick="tutorNext()">${nextLabel}</button>
      </div>
      <div class="tutor-progress"><div class="bar" style="width:${((TUTOR_STEP + 1) / total) * 100}%"></div></div>
      <div style="text-align:center;margin-top:8px;font-size:11px"><a href="#" onclick="event.preventDefault();exitTutor()" style="color:#9caec7">Exit tutor</a></div>
    </div>
  `;
  rp.classList.add('open');
  rp.setAttribute('aria-hidden', 'false');
  document.body.classList.add('rp-open');
  $('rp-body').scrollTop = 0;
}
