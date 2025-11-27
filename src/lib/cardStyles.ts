// 卡片风格配置
export const CARD_STYLES = {
  minimalist: {
    name: "Minimalist",
    container: "bg-white text-black flex flex-col justify-center items-center text-center p-12 border-4 border-double border-gray-100",
    nameFont: "font-serif italic",
    msgFont: "font-sans uppercase tracking-widest text-xs mt-8",
    accentColor: "text-gray-400"
  },
  playful: {
    name: "Playful",
    container: "bg-[#FFEB3B] text-black flex flex-col justify-center items-center text-center p-8 rotate-1",
    nameFont: "font-sans font-black uppercase tracking-tighter leading-none transform -rotate-2",
    msgFont: "font-serif font-bold text-lg mt-6 bg-black text-white px-4 py-1 transform rotate-1",
    accentColor: "text-black"
  },
  elegant: {
    name: "Elegant",
    container: "bg-[#111] text-white flex flex-col justify-between items-start text-left p-16",
    nameFont: "font-serif font-normal italic leading-snug",
    msgFont: "font-sans font-light text-sm opacity-70 tracking-wide border-t border-gray-700 pt-4 w-full text-left",
    accentColor: "text-gray-500"
  }
} as const;

export type CardStyleKey = keyof typeof CARD_STYLES;

// 优化后的字号计算算法
export const calculateFontSize = (text: string): number => {
  const len = text.length;

  // 更细致的分段，使字号变化更平滑
  if (len <= 3) return 150;
  if (len <= 6) return 120;
  if (len <= 9) return 100;
  if (len <= 12) return 80;
  if (len <= 15) return 60;
  return 45; // 兜底最小字号
};
