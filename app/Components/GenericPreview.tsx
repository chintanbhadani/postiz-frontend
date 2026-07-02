import React, { FC } from 'react';

const PLATFORM_STYLES: Record<string, { bg: string, text: string, name: string, iconUrl?: string }> = {
  twitter: { bg: '#000000', text: '#ffffff', name: 'X (Twitter)', iconUrl: 'https://abs.twimg.com/favicons/twitter.2.ico' },
  facebook: { bg: '#ffffff', text: '#050505', name: 'Facebook', iconUrl: 'https://www.facebook.com/favicon.ico' },
  instagram: { bg: '#ffffff', text: '#262626', name: 'Instagram', iconUrl: 'https://www.instagram.com/favicon.ico' },
  telegram: { bg: '#242F3D', text: '#ffffff', name: 'Telegram', iconUrl: 'https://telegram.org/favicon.ico' },
  default: { bg: '#ffffff', text: '#1f2937', name: 'Social Post' }
};

export const GenericPreview: FC<{
  content: string;
  images: string[];
  integration?: { name: string; platform: string; picture?: string };
}> = ({ content, images, integration }) => {
  const platformStr = integration?.platform?.toLowerCase() || 'default';
  const style = PLATFORM_STYLES[platformStr] || PLATFORM_STYLES.default;

  const isDark = style.bg === '#000000' || style.bg === '#242F3D';
  const subtextColor = isDark ? '#71767b' : '#65676B';
  const borderColor = isDark ? '#2f3336' : '#e5e7eb';

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto rounded-xl overflow-hidden border shadow-sm transition-all" style={{ backgroundColor: style.bg, borderColor }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={integration?.picture || '/no-picture.jpg'}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover bg-gray-200"
        />
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px]" style={{ color: style.text }}>
              {integration?.name || 'Your Name'}
            </span>
            {platformStr === 'twitter' && (
              <svg viewBox="0 0 24 24" aria-label="Verified account" role="img" className="w-[18px] h-[18px]" fill="#1d9bf0"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.78 2.73 1.942 3.4-.064.282-.095.57-.095.87 0 2.21 1.71 4 3.918 4 .527 0 1.03-.118 1.49-.33.626 1.135 1.83 1.9 3.208 1.9s2.583-.765 3.208-1.9c.46.212.963.33 1.49.33 2.21 0 3.918-1.79 3.918-4 0-.3-.03-.588-.095-.87 1.162-.67 1.942-1.94 1.942-3.4zM10.824 16.5l-3.364-3.36 1.414-1.41 1.95 1.95 5.586-5.58 1.414 1.41-7 7z"></path></g></svg>
            )}
          </div>
          <span className="text-[13px]" style={{ color: subtextColor }}>
            {platformStr === 'twitter' ? `@${integration?.name?.replace(/\s+/g, '').toLowerCase() || 'handle'} · Just now` : 'Just now'}
          </span>
        </div>
        {style.iconUrl && (
          <img src={style.iconUrl} className="w-4 h-4 opacity-70" alt="Platform Icon" />
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3 text-[15px] whitespace-pre-wrap break-words" style={{ color: style.text }}>
        {content || 'What is happening?!'}
      </div>

      {/* Media */}
      {images && images.length > 0 && (
        <div className={`mt-2 ${images.length === 1 ? 'px-4 pb-4' : 'px-0 pb-0'}`}>
          <div className={`overflow-hidden ${images.length === 1 ? 'rounded-2xl border' : ''} ${images.length > 1 ? 'grid grid-cols-2 gap-[1px]' : ''}`} style={{ borderColor }}>
            {images.slice(0, 4).map((img, i) => (
              <div key={i} className={`relative bg-gray-100 ${images.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                {img.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={img} autoPlay muted loop className="w-full h-full object-cover" />
                ) : (
                  <img src={img} alt="Media" className="w-full h-full object-cover" />
                )}
                {images.length > 4 && i === 3 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-2xl">
                    +{images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fake Footer / Engagement Bar */}
      <div className="flex justify-between px-4 py-3 mt-2" style={{ borderTop: `1px solid ${borderColor}`, color: subtextColor }}>
        <div className="flex items-center gap-2 hover:text-[#1d9bf0] cursor-pointer transition">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
          <span className="text-xs">0</span>
        </div>
        <div className="flex items-center gap-2 hover:text-[#00ba7c] cursor-pointer transition">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
          <span className="text-xs">0</span>
        </div>
        <div className="flex items-center gap-2 hover:text-[#f91880] cursor-pointer transition">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
          <span className="text-xs">0</span>
        </div>
        <div className="flex items-center gap-2 hover:text-[#1d9bf0] cursor-pointer transition">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
          <span className="text-xs">0</span>
        </div>
      </div>
    </div>
  );
};
