import { useEffect, useState } from 'react';
import './App.css';
import { ApiKeySettings } from './components/ApiKeySettings';
import { PhotoUploader } from './components/PhotoUploader';
import { ReportView } from './components/ReportView';
import type { AnalysisReport } from './domain/analysis';
import { clearApiKey, loadApiKey, saveApiKey } from './lib/apiKeyStore';
import { toClaudeImagePayload } from './lib/imageFiles';
import { analyzeFace } from './services/anthropicClient';

type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => loadApiKey());
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function runAnalysis() {
    if (!selectedFile || !apiKey || analysisStatus === 'loading') {
      return;
    }

    setAnalysisStatus('loading');
    setAnalysisError(null);

    try {
      const image = await toClaudeImagePayload(selectedFile);
      const nextReport = await analyzeFace({ apiKey, image });
      setReport(nextReport);
      setAnalysisStatus('success');
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed.');
      setAnalysisStatus('error');
    }
  }

  const canAnalyze = Boolean(apiKey && selectedFile && analysisStatus !== 'loading');

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
          <ApiKeySettings
            apiKey={apiKey}
            onChange={(nextApiKey) => {
              setApiKey(nextApiKey);
              if (nextApiKey) {
                saveApiKey(nextApiKey);
              } else {
                clearApiKey();
              }
            }}
          />
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
          <button className="analyze-button" disabled={!canAnalyze} onClick={runAnalysis} type="button">
            {analysisStatus === 'loading' ? 'Analyzing...' : 'Analyze face'}
          </button>
          {analysisError ? <p className="field-error">{analysisError}</p> : null}
        </aside>

        <section className="report-stage" aria-live="polite">
          {report ? <ReportView report={report} /> : <EmptyReportState status={analysisStatus} />}
        </section>
      </div>
    </main>
  );
}

function EmptyReportState({ status }: { status: AnalysisStatus }) {
  return (
    <div className="empty-report">
      <p className="eyebrow">Analysis report</p>
      <h2>{status === 'loading' ? 'Analyzing your photo' : 'Upload a photo and save an API key'}</h2>
      <p>
        {status === 'loading'
          ? 'Claude is reading the image and preparing a structured report.'
          : 'Your FaceScore report will appear here after the first successful Claude Vision analysis.'}
      </p>
    </div>
  );
}

export default App;
