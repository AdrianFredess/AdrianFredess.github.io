/**
 * Dock magnification (macOS-style) for header contact icons.
 * Uses spring + scale so the effect is clearly visible.
 */
(function initHeaderDock() {
  const dock = document.querySelector(".nav-actions.header-dock");
  if (!dock) return;

  const icons = Array.from(dock.querySelectorAll(".icon-btn"));
  if (!icons.length) return;

  const BASE_SCALE = 1;
  const MAX_SCALE = 1.55;
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

  const scaleFromMouse = (clientX, icon) => {
    if (!Number.isFinite(clientX)) return BASE_SCALE;
    const bounds = icon.getBoundingClientRect();
    const distance = clientX - (bounds.left + bounds.width / 2);
    const left = interpolate(distance, -DISTANCE, 0, BASE_SCALE, MAX_SCALE);
    const right = interpolate(distance, 0, DISTANCE, MAX_SCALE, BASE_SCALE);
    return distance < 0 ? left : right;
  };

  const state = icons.map(() => ({
    current: BASE_SCALE,
    target: BASE_SCALE,
    velocity: 0,
  }));

  const applyScale = (icon, scale, index) => {
    const lift = (scale - 1) * -10;
    icon.style.transform = `translateY(${lift}px) scale(${scale})`;
    icon.style.zIndex = String(Math.round(scale * 10) + index);
  };

  let mouseX = Infinity;
  let raf = 0;

  const tick = () => {
    let moving = false;
    const dt = 1 / 60;

    icons.forEach((icon, i) => {
      const s = state[i];
      s.target = scaleFromMouse(mouseX, icon);

      const force = -SPRING.stiffness * (s.current - s.target);
      const damping = -SPRING.damping * s.velocity;
      const acceleration = (force + damping) / SPRING.mass;
      s.velocity += acceleration * dt;
      s.current += s.velocity * dt;

      if (Math.abs(s.current - s.target) > 0.002 || Math.abs(s.velocity) > 0.002) {
        moving = true;
      } else {
        s.current = s.target;
        s.velocity = 0;
      }

      applyScale(icon, clamp(s.current, BASE_SCALE, MAX_SCALE + 0.05), i);
    });

    if (moving || Number.isFinite(mouseX)) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };

  const ensureTick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  dock.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    ensureTick();
  });

  dock.addEventListener("mouseleave", () => {
    mouseX = Infinity;
    ensureTick();
  });

  icons.forEach((icon, i) => applyScale(icon, BASE_SCALE, i));
})();
