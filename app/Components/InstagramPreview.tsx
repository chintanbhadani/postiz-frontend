import React, { FC } from 'react';

export const InstagramPreview: FC<{
  content: string;
  images: string[];
  integration?: { name: string; platform: string; picture?: string };
}> = ({ content, images, integration }) => {
  return (
    <div className="flex flex-col w-full max-w-sm mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm font-sans text-black">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={integration?.picture || '/no-picture.jpg'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-200"
            />
          </div>
          <span className="font-semibold text-sm tracking-tight text-gray-900">
            {integration?.name?.replace(/\s+/g, '').toLowerCase() || 'instagram_user'}
          </span>
        </div>
        <button className="p-1">
          <svg aria-label="More Options" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
        </button>
      </div>

      {/* Media Content - 4:5 Aspect Ratio (or 1:1) */}
      <div className="w-full bg-black relative flex items-center justify-center aspect-[4/5] overflow-hidden">
        {images && images.length > 0 ? (
          images[0].match(/\.(mp4|webm|mov)$/i) ? (
            <video src={images[0]} autoPlay muted loop className="w-full h-full object-cover" />
          ) : (
            <img src={images[0]} alt="Post" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
        )}
        
        {/* Pagination Dots (if multiple images) */}
        {images && images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button className="hover:opacity-50 transition">
              <svg aria-label="Like" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 2.339 1.149 3.14-.029a4.21 4.21 0 0 1 2.769-1.912z"></path></svg>
            </button>
            <button className="hover:opacity-50 transition">
              <svg aria-label="Comment" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
            </button>
            <button className="hover:opacity-50 transition">
              <svg aria-label="Share Post" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
            </button>
          </div>
          <button className="hover:opacity-50 transition">
            <svg aria-label="Save" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
          </button>
        </div>

        {/* Likes */}
        <div className="font-semibold text-sm mb-1 text-gray-900">
          0 likes
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-1 text-gray-900">
            {integration?.name?.replace(/\s+/g, '').toLowerCase() || 'instagram_user'}
          </span>
          <span className="text-gray-800 whitespace-pre-wrap break-words">{content || 'Write a caption...'}</span>
        </div>
      </div>
    </div>
  );
};
