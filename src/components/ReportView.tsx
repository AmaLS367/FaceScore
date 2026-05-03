import type { AnalysisReport, Recommendation } from '../domain/analysis';
import { useState } from 'react';

interface ReportViewProps {
  report: AnalysisReport;
  imageUrl: string | null;
  onReset: () => void;
}

const priorityLabel: Record<Recommendation['priority'], string> = {
  high: 'High impact',
  medium: 'Medium impact',
  low: 'Low impact',
};

const glyphs = ['✧', '◇', '◎', '▽', '○'];

export function ReportView({ report, imageUrl, onReset }: ReportViewProps) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2400);
    window.print();
  };

  const [reportId] = useState(() => `FA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`);
  const [dateStr] = useState(() => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

  // Mocking potential since it's not in the domain yet
  const potentialScore = report.overallScore.value + 12 > 100 ? 100 : report.overallScore.value + 12;

  return (
    <div className="report-wrap">
      <div className="report-body">
        {/* Header */}
        <div className="report-header">
          <div>
            <div className="report-header-brand">Appearance Analysis System</div>
            <div className="report-header-title">Appearance<br /><em>Report</em></div>
          </div>
          <div className="report-header-right">
            <div className="report-header-id">Report № {reportId}</div>
            <div className="report-header-date">{dateStr}</div>
          </div>
        </div>

        {/* Hero */}
        <div className="hero-grid">
          <div className="face-card">
            <div className="face-card-label">Subject Analysis</div>
            {imageUrl ? (
              <img src={imageUrl} className="face-card-thumb" alt="Subject portrait" />
            ) : (
              <div className="face-card-thumb" style={{ background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--rule)' }}>
                ◎
              </div>
            )}
            <div className="face-card-sub">Analysis depth: Standard</div>
          </div>
          <div className="hero-right">
            <div className="overall-block">
              <div className="overall-block-label">Overall Presentation Score</div>
              <div className="overall-big-score">
                {(report.overallScore.value / 10).toFixed(1)}<span>/10</span>
              </div>
              <div className="overall-tier">Tier: {report.overallScore.label}</div>
              <div className="overall-desc">{report.overallScore.summary}</div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="section-title">Detailed Analysis</div>
        <div className="metrics-grid">
          {report.scoreCategories.map((category) => (
            <div key={category.id} className="metric-card">
              <div className="metric-name">{category.label}</div>
              <div className="metric-score-row">
                <div className="metric-score">{(category.value / 10).toFixed(1)}</div>
                <div className="metric-denom">/10</div>
              </div>
              <div className="metric-bar-bg">
                <div className="metric-bar-fill" style={{ width: `${category.value}%` }}></div>
              </div>
              <div className="metric-note">{category.summary}</div>
            </div>
          ))}
        </div>

        {/* Strengths & Improvements */}
        <div className="section-title">Strengths & Areas of Focus</div>
        <div className="two-col">
          <div className="list-card">
            <div className="list-card-title">Strengths</div>
            {report.strengths.slice(0, 4).map((strength, i) => (
              <div key={i} className="list-item">
                <div className="list-dot"></div>
                <div className="list-text">{strength}</div>
              </div>
            ))}
          </div>
          <div className="list-card">
            <div className="list-card-title">Improvement Opportunities</div>
            {report.recommendations.filter(r => r.priority === 'high').concat(report.recommendations.filter(r => r.priority !== 'high')).slice(0, 4).map((rec, i) => (
              <div key={i} className="list-item">
                <div className="list-dot hollow"></div>
                <div className="list-text"><strong>{rec.title}</strong></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="section-title">Care & Style Recommendations</div>
        <div className="rec-grid">
          {report.recommendations.slice(0, 4).map((rec, i) => (
            <div key={rec.title} className="rec-card">
              <div className="rec-card-glyph">{glyphs[i % glyphs.length]}</div>
              <div className="rec-card-title">{rec.title}</div>
              <ul className="rec-list">
                <li><span className="rec-arrow">→</span>{rec.detail}</li>
                <li><span className="rec-arrow">→</span>Priority: {priorityLabel[rec.priority]}</li>
              </ul>
            </div>
          ))}
        </div>

        {/* Potential */}
        <div className="section-title">12-Month Potential</div>
        <div className="potential-card">
          <div>
            <div className="potential-label">Projection: 12 months</div>
            <div className="potential-title">Strategic Enhancement Path</div>
            <div className="potential-body">
              By following the recommended grooming and style adjustments consistently over the next year, 
              there is significant opportunity to enhance facial balance and presentation quality.
              {report.groomingNotes?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong>Grooming Focus:</strong> {report.groomingNotes.join(' ')}
                </div>
              )}
              {report.styleNotes?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Style Alignment:</strong> {report.styleNotes.join(' ')}
                </div>
              )}
            </div>
          </div>
          <div className="potential-score">
            <div className="potential-score-num">{(potentialScore / 10).toFixed(1)}</div>
            <div className="potential-score-label">Potential</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="report-disclaimer">
          <strong>Disclaimer.</strong> This analysis is generated by AI and is for informational and aesthetic guidance purposes only. 
          It does not constitute medical advice or a definitive assessment of character or health.
        </div>
      </div>

      {/* Export bar */}
      <div className="export-bar no-print">
        <div className="export-bar-info">
          <strong>Report ready for export</strong>
          Appearance Report · {reportId} · {dateStr}
        </div>
        <div className="export-bar-actions">
          <button className="btn-new" onClick={onReset}>New Analysis</button>
          <button className="btn-export" onClick={handleExport}>
            {exported ? "Exported ✓" : "↓ Export PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
