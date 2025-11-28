"use client";

import React, { useState, useEffect, useRef } from 'react';
import { snapdom } from '@zumer/snapdom';
import { toast } from 'sonner';
import { CARD_STYLES, CardStyleKey, calculateFontSize } from '@/lib/cardStyles';

export default function TypographyGenerator() {
  // 状态管理
  const [name, setName] = useState('Alex');
  const [message, setMessage] = useState('Wishing you the best.');
  const [styleKey, setStyleKey] = useState<CardStyleKey>('minimalist');
  const [fontSize, setFontSize] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // 动态计算字号的算法（优化版）
  useEffect(() => {
    setFontSize(calculateFontSize(name, styleKey));
  }, [name, styleKey]);

  // 等待字体加载
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.fonts.ready.then(() => {
        console.log('All fonts loaded');
      });
    }
  }, []);

  const currentStyle = CARD_STYLES[styleKey];

  // 点击下载按钮 - 弹出选择对话框
  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  // 免费下载（有水印）
  const handleFreeDownload = async () => {
    setShowDownloadModal(false);
    if (!canvasRef.current) return;

    setIsGenerating(true);
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 300));

      const img = await snapdom.toPng(canvasRef.current, {
        width: 1200,
        height: 1500,
        quality: 1.0
      });

      const link = document.createElement('a');
      link.href = img.src;
      link.download = `birthday-card-${name.toLowerCase().replace(/\s+/g, '-')}-free.png`;
      link.click();

      toast.success('Card downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download card');
    } finally {
      setIsGenerating(false);
    }
  };

  // 付费去水印（$2.99）
  const handleRemoveWatermark = () => {
    setShowDownloadModal(false);
    toast.info('Payment integration coming soon!');
    // TODO: 集成 Stripe 支付
  };

  // 跳转到 Pro 订阅页面
  const handleGoPro = () => {
    setShowDownloadModal(false);
    window.location.href = '/pricing';
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
              {(Object.keys(CARD_STYLES) as Array<CardStyleKey>).map((key) => (
                <button
                  key={key}
                  onClick={() => setStyleKey(key)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    styleKey === key
                      ? 'bg-black text-white border border-black'
                      : 'border border-gray-300 text-gray-500 hover:border-black hover:text-black'
                  }`}
                >
                  {CARD_STYLES[key].name}
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

          {/* 画布容器 - 添加响应式缩放 */}
          <div className="flex-grow flex items-center justify-center w-full overflow-hidden p-4">
            {/* 缩放容器：移动端自动缩小，桌面端原始大小 */}
            <div className="origin-center transform scale-[0.7] sm:scale-[0.85] md:scale-100 transition-transform">
              <div
                ref={canvasRef}
                className={`card-canvas relative w-[400px] h-[500px] shadow-2xl transition-all duration-500 ease-in-out overflow-hidden ${currentStyle.container}`}
                style={{
                  backgroundColor: currentStyle.backgroundColor,
                  color: currentStyle.textColor
                }}
              >
                {/* 名字区域：根据风格调整对齐和换行 */}
                <div className={`flex-grow flex items-center w-full z-10 ${
                  styleKey === 'elegant' ? 'justify-start' : 'justify-center'
                }`}>
                  <h1
                    className={`${currentStyle.nameFont} ${
                      styleKey === 'playful' ? 'transform -rotate-2' : ''
                    } ${
                      styleKey === 'elegant' ? 'text-left' : 'text-center'
                    } w-full px-4 max-w-full`}
                    style={{
                      fontSize: `${fontSize}px`,
                      lineHeight: styleKey === 'elegant' ? 1.2 : 1.1,
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {name}
                    <span className="text-[#FF4500]">.</span>
                  </h1>
                </div>

                {/* 祝福语区域 - 根据风格调整样式 */}
                <div className={`z-10 ${styleKey === 'elegant' ? 'w-full' : 'max-w-[80%] mx-auto text-center'} ${
                  styleKey === 'playful' ? 'flex justify-center' : ''
                }`}>
                  <p
                    className={`${currentStyle.msgFont} ${
                      styleKey === 'playful' ? 'transform rotate-1' : ''
                    }`}
                    style={{
                      whiteSpace: 'pre-wrap',
                      backgroundColor: currentStyle.messageBgColor,
                      color: currentStyle.messageTextColor
                    }}
                  >
                    {message}
                  </p>
                </div>
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

      {/* Download Options Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-lg bg-white border-2 border-black">
            {/* Close Button */}
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="p-8 md:p-12">
              <h2 className="font-serif mb-3 text-3xl font-bold">
                Love this design?
              </h2>
              <p className="mb-8 text-gray-600">
                Choose how you want to download your birthday card
              </p>

              {/* Options */}
              <div className="space-y-4">
                {/* Option 1: Free Download */}
                <button
                  onClick={handleFreeDownload}
                  className="w-full border-2 border-gray-300 bg-white p-6 text-left transition-all hover:border-black hover:shadow-lg"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold">Free Download</h3>
                    <span className="font-serif text-2xl font-bold">$0</span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Standard quality (1200x1500px)</li>
                    <li>• With watermark</li>
                    <li>• PNG format</li>
                  </ul>
                </button>

                {/* Option 2: Remove Watermark */}
                <button
                  onClick={handleRemoveWatermark}
                  className="w-full border-2 border-black bg-white p-6 text-left transition-all hover:bg-gray-50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold">Remove Watermark</h3>
                    <span className="font-serif text-2xl font-bold">$2.99</span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• High-resolution (4K)</li>
                    <li>• No watermark</li>
                    <li>• PNG + PDF formats</li>
                  </ul>
                </button>

                {/* Option 3: Go Pro */}
                <button
                  onClick={handleGoPro}
                  className="w-full border-2 border-black bg-black p-6 text-left text-white transition-all hover:bg-gray-800"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-serif text-xl font-bold">Go Pro</h3>
                    <span className="font-serif text-2xl font-bold">$19.9<span className="text-sm font-normal">/mo</span></span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>• 30 AI cards per month</li>
                    <li>• All tools without watermarks</li>
                    <li>• Priority support</li>
                  </ul>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
