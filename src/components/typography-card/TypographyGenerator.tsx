"use client";

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

// 定义三种风格的配置
const STYLES = {
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
};

export default function TypographyGenerator() {
  // 状态管理
  const [name, setName] = useState('Alex');
  const [message, setMessage] = useState('Wishing you the best.');
  const [styleKey, setStyleKey] = useState<keyof typeof STYLES>('minimalist');
  const [fontSize, setFontSize] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // 动态计算字号的算法
  useEffect(() => {
    const length = name.length;

    if (length <= 4) setFontSize(140);
    else if (length <= 8) setFontSize(100);
    else if (length <= 12) setFontSize(70);
    else setFontSize(50);
  }, [name]);

  // 等待字体加载
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.fonts.ready.then(() => {
        console.log('All fonts loaded');
      });
    }
  }, []);

  const currentStyle = STYLES[styleKey];

  // 下载功能
  const handleDownload = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    try {
      // 确保字体已加载
      await document.fonts.ready;

      // 等待一小段时间让样式完全应用
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(canvasRef.current, {
        scale: 3, // 3倍分辨率，确保高清
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      // 转换为图片并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `birthday-card-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
          link.click();
          URL.revokeObjectURL(url);
          toast.success('Card downloaded successfully!');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download card');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
      {/* 左侧控制器 */}
      <div className="space-y-12 pt-4 md:col-span-5 lg:col-span-4">
        <div className="space-y-10">
          {/* 01 / Recipient */}
          <div className="group space-y-2">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
              01 / Recipient
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-serif w-full bg-transparent py-2 text-3xl font-bold placeholder-gray-300 border-b border-gray-300 focus:border-black focus:outline-none transition-colors"
              placeholder="Name Here"
            />
          </div>

          {/* 02 / Style */}
          <div className="group space-y-2">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
              02 / Style
            </label>
            <div className="flex gap-2">
              {(Object.keys(STYLES) as Array<keyof typeof STYLES>).map((key) => (
                <button
                  key={key}
                  onClick={() => setStyleKey(key)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    styleKey === key
                      ? 'bg-black text-white border border-black'
                      : 'border border-gray-300 text-gray-500 hover:border-black hover:text-black'
                  }`}
                >
                  {STYLES[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* 03 / Message */}
          <div className="group space-y-2">
            <label className="text-xs font-bold tracking-widest text-gray-400 uppercase transition-colors group-hover:text-black">
              03 / Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] w-full resize-none bg-transparent py-2 text-xl leading-relaxed placeholder-gray-300 border-b border-gray-300 focus:border-black focus:outline-none transition-colors"
              placeholder="Type your wish..."
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>

          {/* Download Button */}
          <div className="pt-8">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="group flex items-center gap-4 text-xl font-bold transition-all hover:gap-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-black transition-colors group-hover:bg-black group-hover:text-white group-disabled:bg-gray-300 group-disabled:border-gray-300">
                ↓
              </span>
              {isGenerating ? 'Generating...' : 'Download Card'}
            </button>
          </div>
        </div>
      </div>

      {/* 右侧预览画布 */}
      <div className="md:col-span-7 lg:col-span-8">
        <div className="relative flex min-h-[650px] flex-col justify-between overflow-hidden bg-white p-10 shadow-2xl md:p-12">
          {/* Top Meta Bar */}
          <div className="mb-4 flex w-full justify-between border-b border-gray-100 pb-4 font-mono text-xs tracking-widest text-gray-400 uppercase">
            <span>Canvas — Preview</span>
            <span>1080 x 1350 px (4:5)</span>
          </div>

          {/* 画布容器 */}
          <div className="flex-grow flex items-center justify-center">
            <div
              ref={canvasRef}
              className={`relative w-[400px] h-[500px] shadow-2xl transition-all duration-500 ease-in-out overflow-hidden ${currentStyle.container}`}
            >
              {/* 名字区域：应用动态字号 */}
              <div className="flex-grow flex items-center justify-center w-full z-10">
                <h1
                  className={`${currentStyle.nameFont} break-words w-full px-4`}
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.1 }}
                >
                  {name}
                  <span className="text-[#FF4500]">.</span>
                </h1>
              </div>

              {/* 祝福语区域 */}
              <div className={`z-10 mb-8 ${styleKey === 'elegant' ? 'w-full' : 'max-w-[80%] mx-auto'}`}>
                <p className={currentStyle.msgFont}>
                  {message}
                </p>
              </div>

              {/* 装饰水印 */}
              <div className={`absolute -bottom-10 -right-10 text-[10rem] font-serif opacity-10 pointer-events-none select-none ${currentStyle.accentColor}`}>
                Aa
              </div>
            </div>
          </div>

          {/* Bottom Meta Bar */}
          <div className="mt-4 flex w-full justify-between border-t border-gray-100 pt-4 font-mono text-xs text-gray-400">
            <span>Status: Ready to download</span>
            <span>Output: PNG (High-Res)</span>
          </div>

          {/* Background Decoration */}
          <div className="font-serif pointer-events-none absolute -right-12 -bottom-12 text-[14rem] text-gray-50 italic opacity-60 select-none leading-none">
            Aa
          </div>
        </div>
      </div>
    </div>
  );
}
