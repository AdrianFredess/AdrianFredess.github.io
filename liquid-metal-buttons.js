/**
 * Liquid Metal buttons — versión vanilla del componente Paper Shaders.
 * Usa @paper-design/shaders (mismo shader que el demo React).
 */
(async function initLiquidMetalButtons() {
  const sources = Array.from(document.querySelectorAll('.btn-liquid'));
  if (!sources.length) return;

  let ShaderMount;
  let liquidMetalFragmentShader;

  try {
    const mod = await import('https://esm.sh/@paper-design/shaders@0.0.71');
    ShaderMount = mod.ShaderMount;
    liquidMetalFragmentShader = mod.liquidMetalFragmentShader;
  } catch (error) {
    console.error('No se pudo cargar @paper-design/shaders:', error);
    return;
  }

  const measureLabelWidth = (label) => {
    const probe = document.createElement('span');
    probe.textContent = label;
    probe.style.cssText =
      'position:absolute;visibility:hidden;white-space:nowrap;font-size:14px;font-weight:400;font-family:Poppins,system-ui,sans-serif;';
    document.body.appendChild(probe);
    const width = Math.ceil(probe.getBoundingClientRect().width) + 48;
    probe.remove();
    return Math.max(142, width);
  };

  const mountButton = (source) => {
    if (source.dataset.liquidMounted === '1') return;

    const label = (source.textContent || 'Contactar').trim();
    const isBlock = source.classList.contains('btn-solution') ||
      Boolean(source.closest('#servicios'));
    const width = isBlock ? null : measureLabelWidth(label);

    const root = document.createElement('div');
    root.className = 'liquid-metal-root' + (isBlock ? ' is-block' : '');

    root.innerHTML = `
      <div class="liquid-metal-perspective">
        <div class="liquid-metal-scene"${width ? ` style="width:${width}px"` : ''}>
          <div class="liquid-metal-label">${label}</div>
          <div class="liquid-metal-inner">
            <div class="liquid-metal-inner-fill"></div>
          </div>
          <div class="liquid-metal-shader-shell">
            <div class="liquid-metal-shader"></div>
          </div>
        </div>
      </div>
    `;

    const hit = document.createElement('a');
    hit.className = 'liquid-metal-hit';
    hit.href = source.getAttribute('href') || '#';
    hit.setAttribute('aria-label', label);
    if (source.target) hit.target = source.target;
    if (source.rel) hit.rel = source.rel;
    if (source.hasAttribute('download')) {
      hit.setAttribute('download', source.getAttribute('download') || '');
    }

    root.querySelector('.liquid-metal-scene').appendChild(hit);
    source.replaceWith(root);
    source.dataset.liquidMounted = '1';

    const shaderHost = root.querySelector('.liquid-metal-shader');
    let shader = null;
    let hovered = false;

    try {
      shader = new ShaderMount(
        shaderHost,
        liquidMetalFragmentShader,
        {
          u_isImage: false,
          u_shape: 1,
          u_repetition: 4,
          u_softness: 0.35,
          u_shiftRed: 0.4,
          u_shiftBlue: 0.35,
          u_distortion: 0.12,
          u_contour: 0.25,
          u_angle: 45,
          u_scale: 1.6,
          u_fit: 2,
          u_offsetX: 0,
          u_offsetY: 0,
          u_colorBack: [0, 0, 0, 0],
          u_colorTint: [1, 1, 1, 1],
        },
        undefined,
        0.85
      );
    } catch (error) {
      console.error('Error montando liquid metal shader:', error);
      return;
    }

    hit.addEventListener('mouseenter', () => {
      hovered = true;
      root.classList.add('is-hovered');
      shader?.setSpeed?.(1.4);
    });

    hit.addEventListener('mouseleave', () => {
      hovered = false;
      root.classList.remove('is-hovered', 'is-pressed');
      shader?.setSpeed?.(0.85);
    });

    hit.addEventListener('mousedown', () => {
      root.classList.add('is-pressed');
    });

    hit.addEventListener('mouseup', () => {
      root.classList.remove('is-pressed');
    });

    hit.addEventListener('click', (e) => {
      if (shader?.setSpeed) {
        shader.setSpeed(2.8);
        window.setTimeout(() => {
          shader?.setSpeed?.(hovered ? 1.4 : 0.85);
        }, 300);
      }

      const rect = hit.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'liquid-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      hit.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 600);
    });
  };

  sources.forEach(mountButton);
})();
