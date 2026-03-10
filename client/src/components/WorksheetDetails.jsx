import { useState } from 'react';

/**
 * WorksheetDetails – Full-page worksheet editor.
 * Layout: TopBar | (30% question list + 70% canvas) | Footer
 *
 * Matches wireframe 2 exactly:
 * - Left: scrollable question list with filter chips, selected item highlighted
 * - Right: A4-ish canvas with hover action toolbar (edit, duplicate, regenerate, delete)
 * - Answer toggle: "Questions only" vs "Show answers/marking guide"
 * - Footer: Download PDF / Download DOCX / Send to Teacher (soon)
 */

const TYPE_FILTER_ALL = 'All';
const TYPE_FILTERS = [TYPE_FILTER_ALL, 'MCQ', 'Short Answer', 'Extended Response'];

// Which CSS left-border colour to use per type
function typeBadgeClass(type) {
    if (type === 'MCQ') return 'badge-orange';
    if (type === 'Short Answer') return 'badge-blue';
    if (type === 'Extended Response') return 'badge-amber';
    if (type === 'Worked Example') return 'badge-green';
    return 'badge-gray';
}

function QuestionBlock({ q, index, showAnswers }) {
    const isMCQ = q.type === 'MCQ';
    const isShort = q.type === 'Short Answer';

    return (
        <div className="wd-q-block">
            {/* Hover action toolbar */}
            <div className="wd-q-actions">
                <button className="wd-action-btn" title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="wd-action-btn" title="Duplicate">
                    <span className="material-symbols-outlined">content_copy</span>
                </button>
                <button className="wd-action-btn" title="Regenerate similar">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
                <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 2px' }} />
                <button className="wd-action-btn danger" title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </div>

            {/* Question text */}
            <div className="wd-q-content">
                <p style={{ marginBottom: isMCQ ? 'var(--s3)' : 'var(--s4)' }}>
                    <strong>Question {index + 1}.</strong>{' '}
                    {q.question.replace(/^\[.*?\]\s*/, '')}{' '}
                    <span style={{ color: 'var(--text-500)', fontWeight: 400 }}>({q.marks} mark{q.marks !== 1 ? 's' : ''})</span>
                </p>

                {/* MCQ options */}
                {isMCQ && q.options && (
                    <div className="wd-mcq-grid">
                        {q.options.map((opt, i) => {
                            const letter = ['A', 'B', 'C', 'D'][i];
                            const isCorrect = showAnswers && letter === q.answer;
                            return (
                                <div key={i} className="wd-mcq-opt" style={isCorrect ? { fontWeight: 700 } : {}}>
                                    <div className={`wd-radio ${isCorrect ? 'correct' : ''}`}>
                                        {isCorrect && '✓'}
                                    </div>
                                    {opt}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Short answer lines */}
                {isShort && (
                    <div className="wd-answer-lines">
                        <div className="wd-answer-line" />
                        <div className="wd-answer-line" />
                        <div className="wd-answer-line" />
                    </div>
                )}

                {/* Extended response space */}
                {q.type === 'Extended Response' && (
                    <div className="wd-answer-lines">
                        {[...Array(5)].map((_, i) => <div key={i} className="wd-answer-line" />)}
                    </div>
                )}
            </div>

            {/* Marking guide */}
            {showAnswers && (
                <div className="wd-answer-guide">
                    <p className="wd-answer-guide-label">Marking Guide / Answer</p>
                    <div className="wd-answer-guide-text">{q.answer}</div>
                </div>
            )}
        </div>
    );
}

export default function WorksheetDetails({
    results,
    subject,
    year,
    selectedState,
    selectedQuestionId,
    onSelectQuestion,
    onBack,
    onDownload,
}) {
    const [showAnswers, setShowAnswers] = useState(false);
    const [activeFilter, setActiveFilter] = useState(TYPE_FILTER_ALL);

    const allQuestions = results?.questions ?? [];

    const filteredQuestions =
        activeFilter === TYPE_FILTER_ALL
            ? allQuestions
            : allQuestions.filter((q) => q.type === activeFilter);

    const totalMarks = allQuestions.reduce((s, q) => s + (q.marks || 0), 0);

    // For the canvas, always show all questions (filter only affects the list highlight)
    const canvasQuestions = allQuestions;

    return (
        <div className="wd-shell">
            {/* ── Top bar ── */}
            <header className="wd-topbar">
                <div className="wd-topbar-left">
                    <button className="wd-back-btn" onClick={onBack} id="btn-back-to-studio">
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_back</span>
                        Back to generator
                    </button>
                    <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
                    <h1 className="wd-title">
                        Worksheet for{' '}
                        <span>{subject} · Year {year} ({selectedState})</span>
                    </h1>
                </div>

                <div className="wd-topbar-right">
                    {/* Answer toggle */}
                    <div className="wd-answer-toggle">
                        <button
                            className={`wd-toggle-opt ${!showAnswers ? 'active' : ''}`}
                            onClick={() => setShowAnswers(false)}
                        >
                            Questions only
                        </button>
                        <button
                            className={`wd-toggle-opt ${showAnswers ? 'active' : ''}`}
                            onClick={() => setShowAnswers(true)}
                        >
                            Show answers / marking guide
                        </button>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onBack}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>refresh</span>
                        Regenerate all
                    </button>
                </div>
            </header>

            {/* ── Main split ── */}
            <main className="wd-main">
                {/* Left: Question list */}
                <aside className="wd-list">
                    <div className="wd-list-header">
                        <h2>Questions <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-400)' }}>({allQuestions.length} · {totalMarks} marks)</span></h2>
                        <div className="wd-filter-chips">
                            {TYPE_FILTERS.map((f) => (
                                <button
                                    key={f}
                                    className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="wd-list-scroll">
                        {filteredQuestions.map((q) => (
                            <div
                                key={q.id}
                                id={`list-q-${q.id}`}
                                className={`wd-q-item ${selectedQuestionId === q.id ? 'selected' : ''}`}
                                onClick={() => onSelectQuestion(q.id)}
                            >
                                <div className="wd-q-item-meta">
                                    <span className={`wd-q-item-type`}>{q.type}</span>
                                    <span className="wd-q-item-marks">{q.marks} Mark{q.marks !== 1 ? 's' : ''}</span>
                                </div>
                                <p className="wd-q-item-text">
                                    {q.question.replace(/^\[.*?\]\s*/, '')}
                                </p>
                            </div>
                        ))}

                        {filteredQuestions.length === 0 && (
                            <div style={{ padding: 'var(--s5)', textAlign: 'center', color: 'var(--text-400)', fontSize: '0.82rem' }}>
                                No questions of this type.
                            </div>
                        )}
                    </div>
                </aside>

                {/* Right: Canvas */}
                <section className="wd-canvas-area">
                    <div className="wd-canvas" id="worksheet-canvas">
                        {/* Canvas heading */}
                        <div className="wd-canvas-heading">
                            <div className="wd-canvas-heading-row">
                                <div>
                                    <h2>{subject}</h2>
                                    <p className="wd-canvas-student">Student Name: ________________________________</p>
                                </div>
                                <div className="wd-canvas-meta">
                                    <p>Year {year} · {selectedState}</p>
                                    <p>Total: {totalMarks} marks</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-400)', marginTop: 4 }}>
                                        Worksheet · {new Date().toLocaleDateString('en-AU')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Questions on canvas */}
                        {canvasQuestions.map((q, i) => (
                            <QuestionBlock
                                key={q.id}
                                q={q}
                                index={i}
                                showAnswers={showAnswers}
                            />
                        ))}

                        {canvasQuestions.length === 0 && (
                            <p style={{ color: 'var(--text-400)', fontStyle: 'italic', textAlign: 'center', paddingTop: 'var(--s7)' }}>
                                No questions to display.
                            </p>
                        )}
                    </div>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="wd-footer">
                <div className="wd-footer-info">
                    <span className="material-symbols-outlined">info</span>
                    Draft saved automatically at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="wd-footer-actions">
                    <button id="btn-wd-download-pdf" className="btn btn-secondary" onClick={onDownload}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>download</span>
                        Download as PDF
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => alert('DOCX export coming soon!')}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>description</span>
                        Download as DOCX
                    </button>
                    <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        Send to Kuraplan Teacher Account
                        <span className="badge badge-gray" style={{ marginLeft: 8, background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'transparent' }}>Soon</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}
