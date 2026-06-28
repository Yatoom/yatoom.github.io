import { nodes, links } from './data.js';

// ── COLOURS ──────────────────────────────────────────────────────────────────
export const genColors = { 1:'#f59e0b', 2:'#10b981', 3:'#3b82f6', 4:'#a855f7', 5:'#ec4899' };

// ── SETUP ────────────────────────────────────────────────────────────────────
let svg, wrap, g, gNode, zoom;
let simulation;
let currentNodesData = [];

export const W = () => wrap.clientWidth;
export const H = () => wrap.clientHeight;

export function initGraph(uiHandlers) {
  svg = d3.select('#graph-svg');
  wrap = document.querySelector('.canvas-wrap');

  const defs = svg.append('defs');
  defs.append('clipPath').attr('id', 'node-clip')
    .append('circle').attr('r', 22);

  g = svg.append('g').attr('class', 'zoom-layer');
  gNode = g.node();

  let zoomPending = false;
  let zoomTransform = { x: 0, y: 0, k: 1 };

  zoom = d3.zoom()
    .scaleExtent([0.08, 6])
    .on('zoom', e => {
      zoomTransform = e.transform;
      if (!zoomPending) {
        zoomPending = true;
        requestAnimationFrame(() => {
          const { x, y, k } = zoomTransform;
          gNode.style.transform = `translate3d(${x}px,${y}px,0) scale(${k})`;
          zoomPending = false;
        });
      }
    });
  svg.call(zoom);

  // Attach UI handlers if needed, or export functions for UI to call
  buildLayeredLayout(uiHandlers);

  window.addEventListener('resize', () => {
    if (currentNodesData.length) fitGraph(currentNodesData);
  });
}

const isMobile = () => window.innerWidth <= 600;
const nodeR = () => 22;

export function buildLayeredLayout(uiHandlers) {
  if (simulation) simulation.stop();

  const nodesCopy = nodes.map(d => ({ ...d }));
  const linksCopy = links.map(d => ({ ...d }));

  const GEN_H = 140;
  const TOP = 70;
  const NODE_GAP = 80;
  const FAMILY_GAP = 60;

  const parentOfLocal = {};
  linksCopy.forEach(l => {
    parentOfLocal[l.target] = l.source;
  });

  const generationGroups = {};
  nodesCopy.forEach(n => {
    const gen = n.gen;
    if (!generationGroups[gen]) generationGroups[gen] = {};
    const parent = parentOfLocal[n.id] || "root";
    if (!generationGroups[gen][parent]) generationGroups[gen][parent] = [];
    generationGroups[gen][parent].push(n);
  });

  const positions = {};
  Object.keys(generationGroups).forEach(gen => {
    let x = 0;
    Object.values(generationGroups[gen]).forEach(group => {
      group.forEach(n => {
        positions[n.id] = x;
        x += NODE_GAP;
      });
      x += FAMILY_GAP;
    });
  });

  nodesCopy.forEach(n => {
    n.x = positions[n.id];
    n.y = TOP + (n.gen - 1) * GEN_H;
    n.fx = n.x;
    n.fy = n.y;
  });

  simulation = d3.forceSimulation(nodesCopy)
    .force("link", d3.forceLink(linksCopy).id(d => d.id).strength(0))
    .alphaDecay(1);

  currentNodesData = nodesCopy;
  render(nodesCopy, linksCopy, simulation, true, uiHandlers);
  simulation.tick();
  setTimeout(() => fitGraph(nodesCopy), 50);
}

export function buildForceLayout(uiHandlers) {
  if (simulation) simulation.stop();

  const nodesCopy = nodes.map(d => ({ ...d }));
  const linksCopy = links.map(d => ({ ...d }));
  nodesCopy.forEach(n => { delete n.fx; delete n.fy; });

  simulation = d3.forceSimulation(nodesCopy)
    .force('link', d3.forceLink(linksCopy).id(d => d.id).distance(isMobile() ? 80 : 100).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-280))
    .force('center', d3.forceCenter(W() / 2, H() / 2))
    .force('collide', d3.forceCollide().radius(d => nodeR(d) + 18).strength(0.9));

  currentNodesData = nodesCopy;
  render(nodesCopy, linksCopy, simulation, false, uiHandlers);
  setTimeout(() => fitGraph(nodesCopy), 2000);
}

export function fitGraph(nodesData) {
  const xs = nodesData.map(n => n.x).filter(Boolean);
  const ys = nodesData.map(n => n.y).filter(Boolean);
  if (!xs.length) return;
  const pad  = isMobile() ? 40 : 60;
  const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
  const gw   = maxX - minX, gh = maxY - minY;
  const scale = Math.min(isMobile() ? 0.92 : 0.95, Math.min(W() / gw, H() / gh));
  const tx   = (W() - gw * scale) / 2 - minX * scale;
  const ty   = (H() - gh * scale) / 2 - minY * scale;

  const duration = isMobile() ? 400 : 800;
  svg.transition().duration(duration).call(
    zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale)
  );
}

export function zoomIn() { svg.transition().duration(300).call(zoom.scaleBy, 1.4); }
export function zoomOut() { svg.transition().duration(300).call(zoom.scaleBy, 0.7); }
export function fitView() { if (currentNodesData.length) fitGraph(currentNodesData); }

function render(nodesData, linksData, sim, layered, uiHandlers) {
  g.selectAll('*').remove();
  const linkGroup = g.append('g').attr('class','links');
  const R = nodeR();

  const linkSegs = linksData.map(d => {
    const sel = linkGroup.append('line').attr('class', 'link');
    const s = nodesData.find(n => n.id === (d.source.id || d.source));
    const t = nodesData.find(n => n.id === (d.target.id || d.target));
    return { sel, line: sel.node(), d, s, t };
  });

  function drawLinks() {
    linkSegs.forEach(({ line, d }) => {
      line.x1.baseVal.value = d.source.x;
      line.y1.baseVal.value = d.source.y + R;
      line.x2.baseVal.value = d.target.x;
      line.y2.baseVal.value = d.target.y - R;
    });
  }

  const node = g.append('g').attr('class', 'nodes')
    .selectAll('.node')
    .data(nodesData)
    .join('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', (e, d) => {
        if (!e.active && sim.alpha) sim.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (e, d) => {
        d.fx = e.x; d.fy = e.y;
        if (layered) { d.x = e.x; d.y = e.y; draw(); }
      })
      .on('end', (e, d) => {
        if (!e.active && sim.alphaTarget) sim.alphaTarget(0);
        if (!layered) { d.fx = null; d.fy = null; }
      })
    );

  node.append('circle')
    .attr('class', 'bg')
    .attr('r', d => nodeR(d))
    .attr('fill', d => d.photo ? 'var(--surface)' : genColors[d.gen] + '22')
    .attr('stroke', d => genColors[d.gen])
    .attr('stroke-opacity', 0.85)
    .attr('stroke-width', 2.5);

  node.each(function(d) {
    const el = d3.select(this);
    const r  = nodeR(d);
    if (d.photo) {
      el.append('image')
        .attr('href', d.photo)
        .attr('x', -r).attr('y', -r)
        .attr('width', r * 2).attr('height', r * 2)
        .attr('clip-path', 'url(#node-clip)')
        .attr('preserveAspectRatio', 'xMidYMid slice')
        .attr('decoding', 'async');
    } else {
      el.append('text')
        .attr('dy', '0.35em').attr('font-size', r * 0.65)
        .style('fill', genColors[d.gen]).attr('text-anchor', 'middle')
        .text('🐱');
    }
  });

  node.append('text')
    .attr('y', d => nodeR(d) + 13)
    .attr('text-anchor', 'middle')
    .text(d => d.name)
    .attr('font-size', 12)
    .attr('fill', 'var(--text)')
    .attr('font-weight', d => d.gen <= 2 ? 700 : 600);

  function highlightConnected(d) {
    const connectedIds = new Set([d.id]);
    linksData.forEach(l => {
      const src = l.source.id || l.source;
      const tgt = l.target.id || l.target;
      if (src === d.id) connectedIds.add(tgt);
      if (tgt === d.id) connectedIds.add(src);
    });
    node.classed('dimmed', n => !connectedIds.has(n.id));
    linkSegs.forEach(({ sel, s, t }) => {
      const dim = !(connectedIds.has(s?.id) && connectedIds.has(t?.id));
      sel.classed('dimmed', dim);
    });
  }

  function clearHighlight() {
    const hg = new Set(Array.from(document.querySelectorAll('.legend-item.dimmed')).map(x => +x.dataset.gen));
    node.classed('dimmed', d => hg.has(d.gen));
    linkSegs.forEach(({ sel, s, t }) => {
      sel.classed('dimmed', hg.has(s?.gen) || hg.has(t?.gen));
    });
  }

  // Export for UI
  uiHandlers.clearHighlight = clearHighlight;

  node.on('mouseenter', (e, d) => {
    if (!isMobile()) { uiHandlers.showTooltip(e, d); highlightConnected(d); }
  }).on('mouseleave', () => {
    if (!isMobile()) { uiHandlers.hideTooltip(); clearHighlight(); }
  }).on('click', (e, d) => {
    if (isMobile()) {
      uiHandlers.openBottomSheet(d, nodesData, linksData, panToNode);
      highlightConnected(d);
    } else {
      if (d.photo) uiHandlers.openLightbox(d);
    }
  });

  function panToNode(targetNode) {
    const t = d3.zoomTransform(svg.node());
    svg.transition().duration(500).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(W()/2 - targetNode.x * t.k, H()/2 - targetNode.y * t.k)
        .scale(t.k)
    );
  }

  const nodeEls = [];
  node.each(function(d) { nodeEls.push({ el: this, d }); });

  function draw() {
    drawLinks();
    for (let i = 0; i < nodeEls.length; i++) {
      nodeEls[i].el.setAttribute('transform', `translate(${nodeEls[i].d.x},${nodeEls[i].d.y})`);
    }
  }
  draw();
  sim.on('tick', draw);

  // Legend filter attachment
  document.querySelectorAll('.legend-item').forEach(li => {
    li.onclick = () => {
      li.classList.toggle('dimmed');
      clearHighlight();
    };
  });
}
