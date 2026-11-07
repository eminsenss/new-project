import { Easing } from "remotion";

// Logo renklerinden türetilmiş palet (logo mavi #021FDD, bordo #760101)
export const C = {
  black: "#08090B",
  anthracite: "#16181C",
  graphite: "#22252B",
  offWhite: "#F2EEE7",
  soft: "rgba(242,238,231,0.72)",
  blue: "#1E3FE6",
  blueGlow: "rgba(40,80,255,0.55)",
  maroon: "#8A1616",
  maroonDeep: "#5E0B0B",
  whatsapp: "#25D366",
};

export const FONT_HEAD = "'Inter Tight', 'Inter', sans-serif";
export const FONT_BODY = "'Inter', sans-serif";

// Instagram Reels güvenli alanı (1080x1920): üstte ~250px, altta ~420px, sağda ~120px arayüz
export const SAFE = { top: 270, bottom: 1480, left: 72, right: 1008 };

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
