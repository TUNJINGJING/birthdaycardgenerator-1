// 卡片风格配置
export const CARD_STYLES = {
  minimalist: {
    name: "Minimalist",
    container: "bg-white text-black flex flex-col justify-center items-center text-center p-12 border-4 border-double border-gray-100",
    nameFont: "font-serif italic",
    msgFont: "font-sans uppercase tracking-widest text-xs mt-8",
    accentColor: "text-gray-400",
    nameAlign: "center" as const
  },
  playful: {
    name: "Playful",
    container: "bg-[#FFEB3B] text-black flex flex-col justify-center items-center text-center p-8",
    nameFont: "font-sans font-black uppercase tracking-tighter leading-none",
    msgFont: "font-serif font-bold text-lg mt-6 bg-black text-white px-4 py-1 inline-block",
    accentColor: "text-black",
    nameAlign: "center" as const
  },
  elegant: {
    name: "Elegant",
    container: "bg-[#111] text-white flex flex-col justify-between items-start text-left p-16",
    nameFont: "font-serif font-normal italic leading-[1.2]",
    msgFont: "font-sans font-light text-sm opacity-70 tracking-wide border-t border-gray-700 pt-4 mt-8 w-full text-left",
    accentColor: "text-gray-500",
    nameAlign: "left" as const
  }
} as const;

export type CardStyleKey = keyof typeof CARD_STYLES;

// 更智能的字号计算算法 - 考虑单词长度和画布宽度
export const calculateFontSize = (text: string, styleKey: CardStyleKey): number => {
  const len = text.length;

  // 找出最长的单词
  const words = text.split(/\s+/);
  const longestWord = Math.max(...words.map(w => w.length));

  // 基础字号
  let baseSize = 42;

  // 如果有超长单词（>15个字符），需要特别处理
  if (longestWord > 15) {
    if (len <= 20) baseSize = 38;
    else if (len <= 30) baseSize = 32;
    else baseSize = 28;
  }
  // 如果有较长单词（>10个字符），稍微减小字号
  else if (longestWord > 10) {
    if (len <= 15) baseSize = 50;
    else if (len <= 25) baseSize = 42;
    else baseSize = 36;
  }
  // 正常情况的字号计算
  else {
    if (len <= 3) baseSize = 140;
    else if (len <= 6) baseSize = 110;
    else if (len <= 9) baseSize = 90;
    else if (len <= 12) baseSize = 75;
    else if (len <= 15) baseSize = 58;
    else if (len <= 20) baseSize = 48;
    else baseSize = 40;
  }

  // Playful 风格因为是全大写且粗体，字号需要减小防止溢出
  if (styleKey === 'playful') {
    baseSize = baseSize * 0.85;
  }

  return baseSize;
};

