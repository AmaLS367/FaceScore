import type { AnalysisReport, Recommendation } from '../domain/analysis';

interface ReportViewProps {
  report: AnalysisReport;
}

const priorityLabel: Record<Recommendation['priority'], string> = {
  high: 'High impact',
  medium: 'Medium impact',
  low: 'Low impact',
};

export function ReportView({ report }: ReportViewProps) {
  return (
    <section className="report-surface printable-report" aria-label="FaceScore analysis report">
      <div className="score-hero">
        <div>
          <p className="eyebrow">Overall FaceScore</p>
          <h2>{report.overallScore.label}</h2>
          <p>{report.overallScore.summary}</p>
        </div>
        <div className="score-orbit" aria-label={`Overall score ${report.overallScore.value} out of 100`}>
          <span>{report.overallScore.value}</span>
          <small>/100</small>
        </div>
      </div>

      <div className="score-grid">
        {report.scoreCategories.map((category) => (
          <article className="score-card" key={category.id}>
            <div className="score-card__header">
              <h3>{category.label}</h3>
              <span>{category.value}</span>
            </div>
            <p>{category.summary}</p>
            <ul>
              {category.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="report-columns">
        <section>
          <h3>Strengths</h3>
          <ul className="check-list">
            {report.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Recommendations</h3>
          <div className="recommendation-stack">
            {report.recommendations.map((recommendation) => (
              <article className="recommendation" key={recommendation.title}>
                <span>{priorityLabel[recommendation.priority]}</span>
                <h4>{recommendation.title}</h4>
                <p>{recommendation.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
