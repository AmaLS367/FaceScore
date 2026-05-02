import './App.css';
import { ReportView } from './components/ReportView';
import { fixtureReport } from './domain/fixtureReport';

function App() {
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
          <div className="placeholder-box">Upload and API controls are next in the MVP flow.</div>
        </aside>

        <ReportView report={fixtureReport} />
      </div>
    </main>
  );
}

export default App;
