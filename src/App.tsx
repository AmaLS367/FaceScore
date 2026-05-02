import { useEffect, useState } from 'react';
import './App.css';
import { PhotoUploader } from './components/PhotoUploader';
import { ReportView } from './components/ReportView';
import { fixtureReport } from './domain/fixtureReport';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <main className="app-shell">
      <div className="workspace">
        <aside className="control-panel" aria-label="FaceScore controls">
          <span className="brand-mark">FS</span>
          <h1>FaceScore</h1>
          <p>
            Upload a face photo, analyze it with Claude Vision, and turn the result into a structured
            grooming and style report.
          </p>
          <PhotoUploader
            error={uploadError}
            file={selectedFile}
            onClear={() => {
              setSelectedFile(null);
              setUploadError(null);
              setPreviewUrl(null);
            }}
            onError={(message) => setUploadError(message)}
            onSelect={(file) => {
              setSelectedFile(file);
              setUploadError(null);
              setPreviewUrl(URL.createObjectURL(file));
            }}
          />
          {previewUrl ? (
            <figure className="preview-card">
              <img alt="Selected face preview" src={previewUrl} />
            </figure>
          ) : null}
        </aside>

        <ReportView report={fixtureReport} />
      </div>
    </main>
  );
}

export default App;
