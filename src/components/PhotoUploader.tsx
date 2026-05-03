import { useRef, useState } from 'react';
import { formatFileSize, validateImageFile } from '../lib/imageFiles';

interface PhotoUploaderProps {
  file: File | null;
  onClear: () => void;
  onError: (message: string) => void;
  onSelect: (file: File) => void;
  previewUrl: string | null;
}

export function PhotoUploader({ file, onClear, onError, onSelect, previewUrl }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(candidate: File | undefined) {
    if (!candidate) return;

    const validation = await validateImageFile(candidate);
    if (!validation.ok) {
      onError(validation.message);
      return;
    }

    onSelect(candidate);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <div
        className={`upload-zone${previewUrl ? ' has-image' : ''}${dragging ? ' dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={!previewUrl ? () => fileInputRef.current?.click() : undefined}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Uploaded portrait" />
            <div className="upload-overlay">
              <button 
                className="upload-change-btn" 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                type="button"
              >
                Change Photo
              </button>
            </div>
          </>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-glyph">◎</div>
            <div className="upload-label">Drop portrait here</div>
            <div className="upload-sub">JPG · PNG · WebP · max 5 MB</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])}
        aria-label="Choose face photo"
      />

      {file && (
        <div className="file-strip">
          <div className="file-strip-meta">
            <div className="file-strip-name">{file.name}</div>
            <div className="file-strip-size">{formatFileSize(file.size)}</div>
          </div>
          <button className="file-strip-remove" onClick={onClear} title="Remove" type="button">×</button>
        </div>
      )}
    </>
  );
}
