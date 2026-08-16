/**
 * Mounts the real framer-motion Dock on the header contact icons.
 */
import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { Dock, DockIcon } from "./components/ui/dock.js";

const LINKS = [
  {
    href: "https://wa.me/5492612084544",
    label: "WhatsApp",
    className: "wa",
    icon: React.createElement("img", {
      src: "iconos/580b57fcd9996e24bc43c543.png",
      alt: "WhatsApp",
      width: 24,
      height: 24,
    }),
  },
  {
    href: "https://www.linkedin.com/in/adrian-fredes-8b57922b7",
    label: "LinkedIn",
    className: "li",
    icon: React.createElement("img", {
      src: "iconos/b1351064-f24b-4d0e-ba5a-2d9ef2cbc1e8.png",
      alt: "LinkedIn",
      width: 24,
      height: 24,
    }),
  },
  {
    href: "https://github.com/adrianfredes10",
    label: "GitHub",
    className: "gh",
    icon: React.createElement(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "currentColor",
        width: 24,
        height: 24,
        "aria-hidden": true,
      },
      React.createElement("path", {
        d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
      }),
    ),
  },
  {
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=adrianfredes12@gmail.com",
    label: "Escribir por Gmail",
    className: "gm",
    icon: React.createElement(
      "svg",
      {
        viewBox: "0 0 48 48",
        width: 24,
        height: 24,
        "aria-hidden": true,
      },
      React.createElement("path", {
        fill: "#4CAF50",
        d: "M45 16.2 40 18.95 35 23.7V40h7c1.657 0 3-1.343 3-3V16.2z",
      }),
      React.createElement("path", {
        fill: "#1E88E5",
        d: "M3 16.2 6.614 17.91 13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z",
      }),
      React.createElement("path", {
        fill: "#E53935",
        d: "M35 11.2 24 19.45 13 11.2 12 17l1 6.7 11 8.25 11-8.25 1-6.7z",
      }),
      React.createElement("path", {
        fill: "#C62828",
        d: "M3 12.298V16.2l10 7.5V11.2L9.876 8.859A3.3 3.3 0 0 0 7.298 8C4.924 8 3 9.924 3 12.298z",
      }),
      React.createElement("path", {
        fill: "#FBC02D",
        d: "M45 12.298V16.2l-10 7.5V11.2l3.124-2.341A3.3 3.3 0 0 1 40.702 8C43.076 8 45 9.924 45 12.298z",
      }),
    ),
  },
];

function HeaderDock() {
  return React.createElement(
    Dock,
    { direction: "middle", magnification: 60, distance: 140 },
    LINKS.map((item) =>
      React.createElement(
        DockIcon,
        { key: item.label },
        React.createElement(
          "a",
          {
            className: `icon-btn dock-link ${item.className}`,
            href: item.href,
            target: "_blank",
            rel: "noopener",
            "aria-label": item.label,
          },
          item.icon,
        ),
      ),
    ),
  );
}

const rootEl = document.getElementById("header-dock-root");
if (rootEl) {
  createRoot(rootEl).render(React.createElement(HeaderDock));
}
