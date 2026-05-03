import { useEffect, useState, useCallback } from 'react';
import './App.css';
import { ApiKeySettings } from './components/ApiKeySettings';
import { PhotoUploader } from './components/PhotoUploader';
import { ReportView } from './components/ReportView';
import type { AnalysisReport } from './domain/analysis';
import { clearApiKey, loadApiKey, saveApiKey } from './lib/apiKeyStore';
import { toClaudeImagePayload } from './lib/imageFiles';
import { analyzeFace } from './services/anthropicClient';

type AnalysisStatus = 'idle' | 'uploaded' | 'analyzing' | 'success' | 'error' | 'invalid';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => loadApiKey());
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Sync dark mode with document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.setProperty('--ink', '#f0ece6');
      document.documentElement.style.setProperty('--ink-light', '#b8b0a6');
      document.documentElement.style.setProperty('--ink-muted', '#6a6460');
      document.documentElement.style.setProperty('--rule', '#2e2a28');
      document.documentElement.style.setProperty('--rule-light', '#232020');
      document.documentElement.style.setProperty('--bg', '#0f0d0c');
      document.documentElement.style.setProperty('--card', '#181614');
    } else {
      document.documentElement.style.setProperty('--ink', '#0a0a0a');
      document.documentElement.style.setProperty('--ink-light', '#3a3a3a');
      document.documentElement.style.setProperty('--ink-muted', '#888');
      document.documentElement.style.setProperty('--rule', '#d8d8d8');
      document.documentElement.style.setProperty('--rule-light', '#efefef');
      document.documentElement.style.setProperty('--bg', '#fafafa');
      document.documentElement.style.setProperty('--card', '#ffffff');
    }
  }, [darkMode]);

  async function runAnalysis() {
    if (!selectedFile || !apiKey || status === 'analyzing') {
      return;
    }

    setStatus('analyzing');
    setAnalysisError(null);

    try {
      const image = await toClaudeImagePayload(selectedFile);
      const nextReport = await analyzeFace({ apiKey, image });
      setReport(nextReport);
      setStatus('success');
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed.');
      setStatus('error');
    }
  }

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setUploadError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setReport(null);
    setStatus('idle');
  }, [previewUrl]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setUploadError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStatus('uploaded');
    setReport(null);
  }, []);

  const statusMap: Record<AnalysisStatus, { dot: string; text: string; cls: string }> = {
    idle: { dot: '', text: 'Awaiting image', cls: '' },
    uploaded: { dot: 'active', text: 'Image ready', cls: 'active' },
    analyzing: { dot: 'pulse active', text: 'Analyzing...', cls: 'analyzing' },
    success: { dot: 'active', text: 'Analysis complete', cls: 'active' },
    error: { dot: 'error', text: analysisError || 'API error', cls: 'error' },
    invalid: { dot: 'error', text: uploadError || 'Invalid file', cls: 'error' },
  };

  const st = statusMap[status] || statusMap.idle;

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-name">FaceScore</span>
          <span className="topbar-version">Analysis System</span>
        </div>
        <div className="topbar-actions">
          <button className="topbar-btn" onClick={() => setShowSettings(true)}>API Key</button>
          <button className="topbar-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <div className="workspace">
        {showSettings ? (
          <section className="settings-page">
            <div className="settings-topbar">
              <button className="settings-back-btn" onClick={() => setShowSettings(false)}>
                ← Back to Analysis
              </button>
              <span className="settings-topbar-title">Settings</span>
              <div style={{ width: 120 }}></div>
            </div>
            <div className="settings-layout">
              <div className="settings-content">
                <div className="settings-section-title">Claude <em>API Settings</em></div>
                <div className="settings-section-desc">Configure your Anthropic API key to enable vision analysis.</div>
                
                <div className="sfield-group">
                  <div className="sfield-group-label">API Configuration</div>
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
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <aside className="panel-left">
              <div className="panel-block">
                <div className="panel-label">Portrait</div>
                <PhotoUploader
                  file={selectedFile}
                  onClear={handleReset}
                  onError={(msg) => {
                    setUploadError(msg);
                    setStatus('invalid');
                  }}
                  onSelect={handleFileSelect}
                  previewUrl={previewUrl}
                />
                
                <div className="status-row">
                  <div className={`status-dot ${st.dot}`}></div>
                  <span className={`status-text ${st.cls}`}>{st.text}</span>
                </div>
              </div>

              <div className="panel-block">
                <div className="panel-label">Analysis</div>
                <button
                  className="btn-primary"
                  onClick={runAnalysis}
                  disabled={!selectedFile || !apiKey || status === 'analyzing'}
                >
                  {status === 'analyzing' ? (
                    <><div className="spinner"></div>Analyzing</>
                  ) : 'Analyze Face'}
                </button>
                {report && (
                  <button className="btn-secondary" onClick={handleReset}>
                    New Analysis
                  </button>
                )}
                {!apiKey && (
                  <div className="api-nudge">
                    <div className="api-nudge-text">
                      Add your Anthropic API key to enable analysis.{' '}
                      <button className="api-nudge-link" onClick={() => setShowSettings(true)}>Set key →</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="panel-block" style={{ padding: '16px 22px', borderBottom: 'none' }}>
                <div className="privacy-note">
                  Photos are processed privately. No image data is stored or transmitted beyond the Anthropic API endpoint.
                </div>
              </div>
            </aside>

            <main className="panel-right">
              {status === 'analyzing' && (
                <div className="analyzing-state">
                  <div className="analyzing-ring"></div>
                  <div>
                    <div className="analyzing-title">Analyzing<br /><em>portrait...</em></div>
                  </div>
                  <div className="analyzing-sub">Evaluating structure, skin & presentation</div>
                  <div className="analyzing-progress"><div className="analyzing-progress-fill"></div></div>
                </div>
              )}

              {!report && status !== 'analyzing' && (
                <div className="empty-state">
                  <div className="empty-glyph">◎</div>
                  <div className="empty-title">Appearance &amp;<br /><em>Presentation Report</em></div>
                  <div className="empty-desc">Upload a clear portrait photograph to generate a structured analysis covering facial balance, proportions, skin quality, grooming, and long-term improvement potential.</div>
                  <div className="empty-steps">
                    {["Upload a portrait (JPG, PNG or WebP)", "Add your Anthropic API key in Settings", "Click Analyze Face to generate report", "Export the finished report to PDF"].map((s, i) => (
                      <div key={i} className="empty-step">
                        <div className="empty-step-n">{i + 1}</div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report && (
                <ReportView report={report} imageUrl={previewUrl} onReset={handleReset} />
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
