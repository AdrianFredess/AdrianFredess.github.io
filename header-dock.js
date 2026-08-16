/**
 * Dock magnification for header icons (spring like framer-motion Dock).
 * Vanilla so icons always render without CDN React.
 */
(function initHeaderDock() {
  const dock = document.querySelector(".nav-actions.header-dock");
  if (!dock) return;

  const icons = Array.from(dock.querySelectorAll(".icon-btn"));
  if (!icons.length) return;

  const BASE = 40;
  const MAGNIFICATION = 60;
  const DISTANCE = 140;
  const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduceMotion || !finePointer) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const interpolate = (value, inMin, inMax, outMin, outMax) => {
    if (value <= inMin) return outMin;
    if (value >= inMax) return outMax;
    const t = (value - inMin) / (inMax - inMin);
    return outMin + (outMax - outMin) * t;
  };

  const widthFromMouse = (pageX, icon) => {
    if (!Number.isFinite(pageX)) return BASE;
    const bounds = icon.getBoundingClientRect();
    const distance = pageX - bounds.x - bounds.width / 2;
    const left = interpolate(distance, -DISTANCE, 0, BASE, MAGNIFICATION);
    const right = interpolate(distance, 0, DISTANCE, MAGNIFICATION, BASE);
    return distance < 0 ? left : right;
  };

  const state = icons.map(() => ({
    current: BASE,
    target: BASE,
    velocity: 0,
  }));

  const applySize = (icon, size) => {
    icon.style.width = `${size}px`;
    icon.style.height = `${size}px`;
  };

  let mousePageX = Infinity;
  let raf = 0;

  const tick = () => {
    let moving = false;
    const dt = 1 / 60;

    icons.forEach((icon, i) => {
      const s = state[i];
      s.target = widthFromMouse(mousePageX, icon);

      const force = -SPRING.stiffness * (s.current - s.target);
      const damping = -SPRING.damping * s.velocity;
      const acceleration = (force + damping) / SPRING.mass;
      s.velocity += acceleration * dt;
      s.current += s.velocity * dt;

      if (Math.abs(s.current - s.target) > 0.15 || Math.abs(s.velocity) > 0.15) {
        moving = true;
      } else {
        s.current = s.target;
        s.velocity = 0;
      }

      applySize(icon, clamp(s.current, BASE, MAGNIFICATION + 4));
    });

    if (moving || Number.isFinite(mousePageX)) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };

  const ensureTick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  dock.addEventListener("mousemove", (event) => {
    mousePageX = event.pageX;
    ensureTick();
  });

  dock.addEventListener("mouseleave", () => {
    mousePageX = Infinity;
    ensureTick();
  });

  icons.forEach((icon) => applySize(icon, BASE));
})();
