import { nodes, links } from './data.js';
import { genColors, W, H } from './graph.js';

const parentOf = {};
links.forEach(l => {
  if (!parentOf[l.target]) parentOf[l.target] = [];
  parentOf[l.target].push(l.source);
});

// ── BOTTOM SHEET ─────────────────────────────────────────────────────────────
const bottomSheet = document.getElementById('bottom-sheet');
let sheetOpenCat = null;
let _uiHandlers = null;

export function openBottomSheet(d, nodesData, linksData, panToNode) {
  sheetOpenCat = d;
  const genCol = genColors[d.gen];

  const photoEl = document.getElementById('sheet-photo');
  photoEl.innerHTML = d.photo
    ? `<img src="${d.photo}" alt="${d.name}" style="cursor:zoom-in" id="sheet-img-inner">`
    : `<div class="no-photo-sm">🐱</div>`;

  if (d.photo) {
    document.getElementById('sheet-img-inner').onclick = () => openLightbox(d);
  }

  document.getElementById('sheet-name').textContent = d.name;
  const genBadge = document.getElementById('sheet-gen');
  genBadge.textContent = `Gen ${d.gen}`;
  genBadge.style.background = genCol + '22';
  genBadge.style.color = genCol;
  genBadge.style.boxShadow = `0 0 0 1px ${genCol}44`;

  const birthRow = document.getElementById('sheet-birth');
  const birthText = document.getElementById('sheet-birth-text');
  if (d.birth) {
    birthText.textContent = d.birth;
    birthRow.style.display = 'flex';
  } else {
    birthRow.style.display = 'none';
  }

  const photoBtn = document.getElementById('sheet-photo-btn');
  if (d.photo) {
    photoBtn.style.display = 'flex';
    photoBtn.onclick = () => openLightbox(d);
  } else {
    photoBtn.style.display = 'none';
  }

  const parentsBtn = document.getElementById('sheet-parents-btn');
  const parents = (parentOf[d.id] || []);
  if (parents.length) {
    parentsBtn.style.display = 'flex';
    parentsBtn.onclick = () => {
      const firstParent = nodesData.find(n => n.id === parents[0]);
      if (firstParent) {
        closeBottomSheet();
        openBottomSheet(firstParent, nodesData, linksData, panToNode);
        panToNode(firstParent);
      }
    };
  } else {
    parentsBtn.style.display = 'none';
  }

  bottomSheet.classList.add('open');
}

export function closeBottomSheet() {
  bottomSheet.classList.remove('open');
  if (_uiHandlers && _uiHandlers.clearHighlight) _uiHandlers.clearHighlight();
  sheetOpenCat = null;
}

// ── TOOLTIP ──────────────────────────────────────────────────────────────────
const tooltip = document.getElementById('tooltip');
let ttTimer;

export function showTooltip(e, d) {
  clearTimeout(ttTimer);
  const genCol = genColors[d.gen];
  tooltip.innerHTML = `
    ${d.photo
      ? `<img src="${d.photo}" alt="${d.name}" id="tt-img" style="cursor:zoom-in">`
      : `<div class="no-photo"><i class="material-icons" style="font-size:40px">pets</i></div>`}
    <h3>${d.name}</h3>
    <span class="gen-badge" style="background:${genCol}22;color:${genCol};box-shadow:0 0 0 1px ${genCol}44">
      Gen ${d.gen}
    </span>
    ${d.birth ? `<div class="birth"><i class="material-icons" style="font-size:11px">calendar_today</i>${d.birth}</div>` : ''}
  `;

  if (d.photo) {
    document.getElementById('tt-img').ondblclick = () => openLightbox(d);
  }

  const rect = document.querySelector('.canvas-wrap').getBoundingClientRect();
  let x = e.clientX - rect.left + 16;
  let y = e.clientY - rect.top + 16;
  if (x + 190 > W()) x = e.clientX - rect.left - 196;
  if (y + 230 > H()) y = e.clientY - rect.top - 240;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
  tooltip.classList.add('show');
}

export function hideTooltip() {
  ttTimer = setTimeout(() => tooltip.classList.remove('show'), 120);
}

// ── LIGHTBOX ─────────────────────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbName = document.getElementById('lb-name');

export function openLightbox(d) {
  if (!d.photo) return;
  lbImg.src = d.photo; lbImg.alt = d.name;
  lbName.textContent = d.name;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function initUI(uiHandlers) {
  _uiHandlers = uiHandlers;
  document.getElementById('sheet-close').onclick = closeBottomSheet;

  let touchStartY = 0;
  bottomSheet.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  bottomSheet.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (dy > 60) closeBottomSheet();
  }, { passive: true });

  document.getElementById('lb-close').onclick = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        closeBottomSheet();
      }
    }
  });

  const legendPanel = document.getElementById('legend-panel');
  const legendToggleBtn = document.getElementById('legend-toggle-btn');
  legendToggleBtn.onclick = () => {
    legendPanel.classList.toggle('visible');
  };

  document.addEventListener('click', e => {
    if (!legendPanel.contains(e.target) && e.target !== legendToggleBtn) {
      legendPanel.classList.remove('visible');
    }
  });

  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const setThemeIcon = () => {
    themeIcon.textContent = document.documentElement.classList.contains('dark') ? 'light_mode' : 'dark_mode';
  };
  setThemeIcon();
  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
    setThemeIcon();
  });
}
