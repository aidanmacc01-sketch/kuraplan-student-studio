import { useState } from 'react';

/**
 * PanelResults – Panel 3: Generate study set.
 * Shows generate button, loading state, then three collapsible sections:
 *   - Questions (MCQ, Short Answer, Extended)
 *   - Worked Examples
 *   - Worksheet Preview (printable HTML)
 *
 * Clicking the worksheet section header opens WorksheetDetails view.
 */

function CollapseSection({ id, title, count, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="result-section">
            <div
                id={`section-${id}`}
                className={`result-section-header ${open ? 'open' : ''}`}
                onClick={() => setOpen((o) => !o)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
            >
                <span className="result-section-title">
                    {title}{count != null ? ` (${count})` : ''}
                </span>
                <span className="result-section-toggle">{open ? '−' : '+'}</span>
            </div>
            {open && <div className="result-section-body">{children}</div>}
        </div>
    );
}

function QuestionCard({ q, index }) {
    const typeClass = q.type === 'MCQ' ? 'mcq' : q.type === 'Short Answer' ? 'short' : 'extended';
    const badgeClass = q.type === 'MCQ' ? 'badge-orange' : q.type === 'Short Answer' ? 'badge-blue' : 'badge-amber';

    return (
        <div className={`q-result-card ${typeClass} fade-in`}>
            <div className="q-meta">
                <span className={`badge ${badgeClass}`}>{q.type}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-400)' }}>{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-400)' }}>· {q.outcomeCode}</span>
            </div>
            <p className="q-text"><span style={{ fontWeight: 700, marginRight: 4 }}>Q{index + 1}.</span>{q.question}</p>
            {q.options && (
                <ul className="mcq-list">
                    {q.options.map((o, i) => <li key={i}>{o}</li>)}
                </ul>
            )}
            <div className="q-answer">
                <strong>Model answer:</strong> {q.answer}
            </div>
        </div>
    );
}

function WorkedExampleCard({ we }) {
    return (
        <div className="q-result-card worked fade-in">
            <div className="q-meta">
                <span className="badge badge-green">Worked Example</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-400)' }}>· {we.outcomeCode}</span>
            </div>
            <p className="q-text" style={{ fontWeight: 600 }}>{we.title}</p>
            <ul className="we-steps">
                {we.steps.map((step, i) => (
                    <li key={i} className="we-step">
                        <span className="we-step-num">{i + 1}</span>
                        <span>{step}</span>
                    </li>
                ))}
            </ul>
            {we.tip && <div className="we-tip">💡 {we.tip}</div>}
        </div>
    );
}

export default function PanelResults({
    subject, canGenerate, isLoading, results, error, onGenerate, onOpenDetails,
}) {
    return (
        <section className="panel">
            <div className="panel-header">
                <span className="material-symbols-outlined">smart_toy</span>
                <h3>Generate study set</h3>
            </div>

            <div className="panel-scroll">
                {/* Generate button */}
                <button
                    id="btn-generate"
                    className="btn btn-primary btn-block btn-lg"
                    style={{ marginBottom: 'var(--s5)' }}
                    disabled={!canGenerate}
                    onClick={onGenerate}
                >
                    {isLoading
                        ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Generating…</>
                        : <><span className="material-symbols-outlined">bolt</span> Generate study questions</>}
                </button>

                {/* Error */}
                {error && (
                    <div style={{ padding: 'var(--s3)', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--r)', fontSize: '0.82rem', color: 'var(--danger)', marginBottom: 'var(--s4)' }}>
                        ⚠ {error}
                    </div>
                )}

                {/* Prompt / empty placeholder */}
                {!results && !isLoading && !error && (
                    <div>
                        <div className="result-section" style={{ marginBottom: 'var(--s3)' }}>
                            <div className="result-section-header">
                                <span className="result-section-title">Quiz Generation</span>
                                <span className="result-section-toggle">+</span>
                            </div>
                        </div>
                        <div className="result-section" style={{ marginBottom: 'var(--s3)' }}>
                            <div className="result-section-header">
                                <span className="result-section-title">Worked Examples</span>
                                <span className="result-section-toggle">+</span>
                            </div>
                        </div>
                        <div className="result-section">
                            <div className="result-section-header">
                                <span className="result-section-title">Worksheet Preview</span>
                                <span className="result-section-toggle">+</span>
                            </div>
                        </div>
                        {!subject && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-400)', textAlign: 'center', marginTop: 'var(--s3)' }}>
                                Complete setup and select outcomes to enable generation
                            </p>
                        )}
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="loading-state">
                        <div className="spinner" />
                        <p className="loading-label">Generating your personalised study set…</p>
                    </div>
                )}

                {/* Results */}
                {results && !isLoading && (
                    <div className="fade-in">
                        {/* Questions */}
                        <CollapseSection
                            id="questions"
                            title="Questions"
                            count={results.questions.length}
                            defaultOpen={true}
                        >
                            {results.questions.map((q, i) => (
                                <QuestionCard key={q.id} q={q} index={i} />
                            ))}
                        </CollapseSection>

                        {/* Worked examples */}
                        {results.workedExamples.length > 0 && (
                            <CollapseSection
                                id="worked"
                                title="Worked Examples"
                                count={results.workedExamples.length}
                                defaultOpen={false}
                            >
                                {results.workedExamples.map((we) => (
                                    <WorkedExampleCard key={we.id} we={we} />
                                ))}
                            </CollapseSection>
                        )}

                        {/* Worksheet preview */}
                        <CollapseSection id="worksheet" title="Worksheet View (Printable)" defaultOpen={false}>
                            <button
                                id="btn-open-details"
                                className="btn btn-primary btn-block"
                                onClick={onOpenDetails}
                                style={{ marginBottom: 'var(--s3)' }}
                            >
                                <span className="material-symbols-outlined">open_in_full</span>
                                Open Worksheet Editor
                            </button>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-400)', textAlign: 'center' }}>
                                View the full worksheet canvas with question editing and PDF export.
                            </div>
                        </CollapseSection>
                    </div>
                )}
            </div>
        </section>
    );
}
