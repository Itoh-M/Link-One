/* ===== LinkOne — Origins Network (Concept section graphic) =====
 *
 * Renders a 5-node star network around a central LINK·One· hub into any
 * element matching `[data-origins-network]`. Pure SVG, no dependencies.
 *
 * Customize per-element via data attributes:
 *   data-origins-network-color  CSS color used for the connecting lines
 *   data-origins-network-radius numeric pixel radius for the outer nodes
 */
(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  const NODES = [
    { code: 'BR', label: 'Brazil',     angle: -90, color: '#8AC53F' },
    { code: 'PA', label: 'Panama',     angle: -18, color: '#E94E2D' },
    { code: 'TW', label: 'Taiwan',     angle:  54, color: '#F4B836' },
    { code: 'ID', label: 'Indonesia',  angle: 126, color: '#2DA890' },
    { code: 'CR', label: 'Costa Rica', angle: 198, color: '#1f7a8c' },
  ];

  const VIEW = 400;
  const CENTER = VIEW / 2;

  function el(name, attrs = {}, children = []) {
    const node = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null) continue;
      node.setAttribute(k, String(v));
    }
    children.forEach(c => c && node.appendChild(c));
    return node;
  }

  function render(target) {
    const lineColor = target.dataset.originsNetworkColor || 'rgba(20,24,30,0.18)';
    const radius   = Number(target.dataset.originsNetworkRadius) || 140;

    const svg = el('svg', {
      viewBox: `0 0 ${VIEW} ${VIEW}`,
      class: 'origins-network__svg',
      'aria-hidden': 'true',
      role: 'img',
    });

    // <defs>: radial glow
    const defs = el('defs');
    const grad = el('radialGradient', { id: 'lo-net-glow', cx: '0.5', cy: '0.5', r: '0.5' });
    grad.appendChild(el('stop', { offset: '0%', 'stop-color': '#F4B836', 'stop-opacity': '0.22' }));
    grad.appendChild(el('stop', { offset: '100%', 'stop-color': '#F4B836', 'stop-opacity': '0' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Background glow + outer ring
    svg.appendChild(el('circle', {
      cx: CENTER, cy: CENTER, r: radius + 18,
      fill: 'url(#lo-net-glow)',
    }));
    svg.appendChild(el('circle', {
      cx: CENTER, cy: CENTER, r: radius,
      fill: 'none', stroke: lineColor,
      'stroke-width': '0.6', 'stroke-dasharray': '2 4',
    }));

    // Lines + nodes + country labels
    NODES.forEach((node, i) => {
      const rad = node.angle * Math.PI / 180;
      const x = CENTER + Math.cos(rad) * radius;
      const y = CENTER + Math.sin(rad) * radius;

      // Connecting line (with flow animation via dashoffset)
      svg.appendChild(el('line', {
        x1: CENTER, y1: CENTER, x2: x, y2: y,
        stroke: lineColor, 'stroke-width': '1',
        class: 'origins-network__line',
        style: `--delay:${i * 0.4}s`,
      }));

      // Node group
      const group = el('g', {
        class: 'origins-network__node',
        transform: `translate(${x} ${y})`,
        'data-country': node.label,
      });

      // Pulse ring (animated scale via CSS)
      group.appendChild(el('circle', {
        cx: 0, cy: 0, r: 8,
        fill: node.color,
        class: 'origins-network__pulse',
        style: `--delay:${i * 0.32}s`,
      }));

      // Solid dot
      group.appendChild(el('circle', {
        cx: 0, cy: 0, r: 5.5,
        fill: node.color,
      }));

      // Country code label outside the node
      const labelDist = 22;
      const lx = Math.cos(rad) * labelDist;
      const ly = Math.sin(rad) * labelDist + 4;
      group.appendChild(el('text', {
        x: lx, y: ly,
        'text-anchor': 'middle',
        'font-family': '"Playfair Display", Georgia, serif',
        'font-size': '12',
        'font-weight': '700',
        'letter-spacing': '0.06em',
        fill: node.color,
        class: 'origins-network__label',
      }, [document.createTextNode(node.code)]));

      svg.appendChild(group);
    });

    // Center hub
    const hub = el('g', {
      transform: `translate(${CENTER} ${CENTER})`,
      class: 'origins-network__hub',
    });
    hub.appendChild(el('circle', {
      cx: 0, cy: 0, r: 32,
      fill: '#fff',
      stroke: 'rgba(20,24,30,0.14)',
      'stroke-width': '1',
    }));
    hub.appendChild(el('text', {
      x: 0, y: -2,
      'text-anchor': 'middle',
      'font-family': 'system-ui, -apple-system, sans-serif',
      'font-size': '11',
      'font-weight': '900',
      'letter-spacing': '0.18em',
      fill: '#2A2D34',
    }, [document.createTextNode('LINK')]));
    hub.appendChild(el('text', {
      x: 0, y: 14,
      'text-anchor': 'middle',
      'font-family': '"Playfair Display", Georgia, serif',
      'font-style': 'italic',
      'font-size': '13',
      fill: '#E94E2D',
    }, [document.createTextNode('·One·')]));
    svg.appendChild(hub);

    target.replaceChildren(svg);
  }

  function init() {
    document.querySelectorAll('[data-origins-network]').forEach(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
