/**
 * Magic UI Dock (React + framer-motion) — same spring/magnification as the original component.
 * Plain JS so GitHub Pages can load it without a build step.
 */
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
} from "https://esm.sh/react@18.3.1";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "https://esm.sh/framer-motion@11.18.2?deps=react@18.3.1,react-dom@18.3.1";

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

export const Dock = forwardRef(function Dock(
  {
    className = "",
    children,
    magnification = DEFAULT_MAGNIFICATION,
    distance = DEFAULT_DISTANCE,
    direction = "middle",
    ...props
  },
  ref,
) {
  const mouseX = useMotionValue(Infinity);

  const renderChildren = () =>
    Children.map(children, (child) => {
      if (isValidElement(child) && child.type === DockIcon) {
        return cloneElement(child, {
          mouseX,
          magnification,
          distance,
        });
      }
      return child;
    });

  const directionClass =
    direction === "top"
      ? "items-start"
      : direction === "bottom"
        ? "items-end"
        : "items-center";

  return React.createElement(
    motion.div,
    {
      ref,
      onMouseMove: (e) => mouseX.set(e.pageX),
      onMouseLeave: () => mouseX.set(Infinity),
      className: ["dock", directionClass, className].filter(Boolean).join(" "),
      ...props,
    },
    renderChildren(),
  );
});

Dock.displayName = "Dock";

export function DockIcon({
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className = "",
  children,
  ...props
}) {
  const ref = useRef(null);
  const fallbackMouseX = useMotionValue(Infinity);
  const activeMouseX = mouseX ?? fallbackMouseX;

  const distanceCalc = useTransform(activeMouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40],
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return React.createElement(
    motion.div,
    {
      ref,
      style: { width },
      className: ["dock-icon", className].filter(Boolean).join(" "),
      ...props,
    },
    children,
  );
}

DockIcon.displayName = "DockIcon";
