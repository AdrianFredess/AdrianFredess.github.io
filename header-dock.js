/**
 * Dock magnification for header contact icons (vanilla port of the Dock/DockIcon effect).
 */
(function initHeaderDock() {
  const dock = document.querySelector('.nav-actions.header-dock');
  if (!dock) return;

  const icons = Array.from(dock.querySelectorAll('.icon-btn'));
  if (!icons.length) return;

  const BASE = 40;
  const MAGNIFICATION = 56;
  const DISTANCE = 120;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (reduceMotion || !finePointer) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const scaleFromDistance = (distance) => {
    if (!Number.isFinite(distance)) return BASE;
    const t = clamp(Math.abs(distance) / DISTANCE, 0, 1);
    // Ease similar to the dock transform curve
    const eased = 1 - t * t * (3 - 2 * t);
    return BASE + (MAGNIFICATION - BASE) * eased;
  };

  const setSize = (icon, size) => {
    icon.style.width = `${size}px`;
    icon.style.height = `${size}px`;
    const media = icon.querySelector('img, svg');
    if (media) {
      const inner = Math.round(size * 0.55);
      media.style.width = `${inner}px`;
      media.style.height = `${inner}px`;
    }
  };

  const reset = () => {
    icons.forEach((icon) => setSize(icon, BASE));
  };

  dock.addEventListener('mousemove', (event) => {
    icons.forEach((icon) => {
      const bounds = icon.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const distance = event.clientX - centerX;
      setSize(icon, scaleFromDistance(distance));
    });
  });

  dock.addEventListener('mouseleave', reset);
  reset();
})();
