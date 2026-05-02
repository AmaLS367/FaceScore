import { formatFileSize, validateImageFile } from '../lib/imageFiles';

interface PhotoUploaderProps {
  error: string | null;
  file: File | null;
  onClear: () => void;
  onError: (message: string) => void;
  onSelect: (file: File) => void;
}

export function PhotoUploader({ error, file, onClear, onError, onSelect }: PhotoUploaderProps) {
  function handleFile(candidate: File | undefined) {
    if (!candidate) {
      return;
    }

    const validation = validateImageFile(candidate);
    if (!validation.ok) {
      onError(validation.message);
      return;
    }

    onSelect(candidate);
  }

  return (
    <section
      className="upload-zone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        handleFile(event.dataTransfer.files[0]);
      }}
    >
      <div>
        <h2>Photo</h2>
        <p>Drop a JPG, PNG, or WebP face photo here.</p>
      </div>

      <label className="file-button">
        Choose face photo
        <input
          accept="image/jpeg,image/png,image/webp"
          aria-label="Choose face photo"
          onChange={(event) => handleFile(event.currentTarget.files?.[0])}
          type="file"
        />
      </label>

      {file ? (
        <div className="selected-file">
          <div>
            <strong>{file.name}</strong>
            <span>
              {file.type} · {formatFileSize(file.size)}
            </span>
          </div>
          <button aria-label="Clear selected photo" onClick={onClear} type="button">
            Clear
          </button>
        </div>
      ) : null}

      {error ? <p className="field-error">{error}</p> : null}
    </section>
  );
}
