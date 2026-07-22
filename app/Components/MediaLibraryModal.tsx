import { useEffect, useState } from "react";
import { uploadsApi } from "../../lib/api";

interface MediaItem {
  id: string;
  url: string;
  type: string;
  createdAt: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
}

export const MediaLibraryModal = ({ isOpen, onClose, onSelect }: MediaLibraryModalProps) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const loadMedia = () => {
    setLoading(true);
    uploadsApi.listMedia()
      .then((res) => setMediaList(res.data))
      .catch((err) => console.error("Failed to load media", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadMedia();
      setSelectedUrls([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--main-background)] rounded-2xl w-full max-w-3xl shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--primary)]">Media Library</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors p-2 hover:bg-[var(--border)] rounded-full"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading && mediaList.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <span className="text-[var(--text-muted)] animate-pulse">Loading media...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              
              {/* Upload New File Button */}
              <label className="relative aspect-square rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--secondary)] overflow-hidden cursor-pointer group bg-[var(--main-background)]/30 flex flex-col items-center justify-center p-2 text-center transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  disabled={uploading}
                  onChange={async (e) => {
                    if (!e.target.files?.length) return;
                    setUploading(true);
                    try {
                      for (let i = 0; i < e.target.files.length; i++) {
                        await uploadsApi.upload(e.target.files[i]);
                      }
                      loadMedia(); // Refresh list after upload
                    } catch (err) {
                      console.error("Failed to upload media", err);
                    } finally {
                      setUploading(false);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
                {uploading ? (
                  <span className="text-xs text-[var(--secondary)] animate-pulse">Uploading...</span>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--secondary)] transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] leading-tight font-medium text-[var(--text-secondary)]">
                      Upload <br/><span className="text-[var(--secondary)] underline">new file</span>
                    </span>
                  </>
                )}
              </label>
              {mediaList.map((item) => {
                const isSelected = selectedUrls.includes(item.url);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setSelectedUrls(prev => 
                        prev.includes(item.url) 
                          ? prev.filter(url => url !== item.url)
                          : [...prev, item.url]
                      );
                    }}
                    className={`relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer group ${
                      isSelected 
                        ? 'border-[var(--secondary)]' 
                        : 'border-[var(--border)] hover:border-[var(--secondary)] bg-black/5'
                    }`}
                  >
                    {item.type === "video" ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                    )}
                    
                    {/* Overlay on hover or selected */}
                    <div className={`absolute inset-0 transition-opacity flex items-center justify-center ${
                      isSelected ? 'bg-[var(--secondary)]/20 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'
                    }`}>
                      {isSelected ? (
                        <div className="bg-[var(--secondary)] rounded-full p-1.5 shadow-lg animate-in zoom-in duration-200">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <span className="bg-white/90 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                          Select
                        </span>
                      )}
                    </div>

                  {/* Video icon indicator */}
                  {item.type === "video" && (
                    <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md backdrop-blur-md">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedUrls.length > 0 && (
          <div className="p-4 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--main-background)] mt-auto z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => setSelectedUrls([])}
              className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
            >
              Clear Selection
            </button>
            <button 
              onClick={() => {
                onSelect(selectedUrls);
                onClose();
              }}
              className="px-5 py-2 bg-[var(--secondary)] text-white text-sm font-bold rounded-xl shadow-lg shadow-[var(--shadow-rose)] hover:bg-[var(--secondary)]/90 transition-colors flex items-center gap-2"
            >
              Insert {selectedUrls.length} File{selectedUrls.length !== 1 && 's'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
