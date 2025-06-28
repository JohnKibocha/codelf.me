import React, { useRef } from 'react';
import { Loader2, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function BannerInput({
  bannerPreview,
  bannerLoading,
  showBannerUrlInput,
  formBanner,
  onBannerUpload,
  onBannerUrlChange,
  onRemoveBanner,
  onToggleBannerUrlInput,
  setFileInputRef,
}) {
  const fileInputRef = useRef();

  // Pass ref up for parent to trigger file input
  React.useEffect(() => {
    if (setFileInputRef) setFileInputRef(fileInputRef);
  }, [setFileInputRef]);

  return (
    <div className="mb-4">
      {/* Remove Banner Button - moved to top right of preview */}
      <div className="relative mb-2 w-full h-48 bg-[var(--input-bg)] rounded-lg overflow-hidden transition-colors duration-300 flex items-center justify-center">
        {formBanner && (
          <button
            onClick={onRemoveBanner}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 dark:bg-[var(--input-bg)] shadow-md border border-gray-200 dark:border-gray-700 hover:bg-red-100 dark:hover:bg-red-900 text-gray-500 hover:text-red-700 dark:text-gray-300 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-150 z-10"
            aria-label="Remove banner"
            type="button"
          >
            <X size={18} />
          </button>
        )}
        {bannerLoading ? (
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        ) : (
          <img src={bannerPreview} alt="Preview" className="object-cover w-full h-full" />
        )}
        <input type="file" ref={fileInputRef} className="hidden" onChange={onBannerUpload} />
      </div>

      {/* Upload/Type URL Buttons Row */}
      <div className="flex flex-row gap-4 mb-2">
        <Button
          type="button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className="flex-1 !bg-[var(--button-bg)] !text-[var(--button-fg)] hover:!bg-[var(--button-bg-hover)] !shadow-lg !px-3 !py-2 !rounded-lg !font-semibold !flex !items-center !gap-2 transition-colors duration-200"
        >
          <ImageIcon size={18} />
          <span className="hidden sm:inline">Upload</span>
        </Button>
        <Button
          type="button"
          onClick={onToggleBannerUrlInput}
          className="flex-1 !bg-gradient-to-r !from-green-400 !to-blue-400 dark:!from-blue-700 dark:!to-green-700 !text-white !shadow-lg !px-3 !py-2 !rounded-lg !font-semibold !flex !items-center !gap-2 transition-colors duration-200"
        >
          <LinkIcon size={18} />
          <span className="hidden sm:inline">Type URL</span>
        </Button>
      </div>

      {/* Banner URL Input */}
      {showBannerUrlInput && (
        <Input label="Banner URL" value={formBanner} onChange={onBannerUrlChange} placeholder="Paste banner image URL" />
      )}
    </div>
  );
}
