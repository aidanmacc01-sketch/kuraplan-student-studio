/**
 * PanelOutcomes – Panel 2: Target syllabus outcomes.
 * Shows outcome chips, difficulty slider, and question type checkboxes.
 * Matches wireframe 1 Panel 2 layout.
 */
export default function PanelOutcomes({
    availableOutcomes,
    chosenOutcomes, onToggleOutcome,
    difficulty, onDifficultyChange, difficultyLabels,
    options, onToggleOption,
    subject,
}) {
    const hasOutcomes = availableOutcomes.length > 0;

    return (
        <section className="panel">
            <div className="panel-header">
                <span className="material-symbols-outlined">checklist</span>
                <h3>Target syllabus outcomes</h3>
            </div>

            <div className="panel-scroll">
                {/* Empty state when no subject selected */}
                {!subject && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <span className="material-symbols-outlined">auto_awesome_motion</span>
                        </div>
                        <h4>Select a subject to see syllabus points</h4>
                        <p>Relevant outcomes will appear here to help focus your study set generation.</p>
                    </div>
                )}

                {/* Outcome chips */}
                {hasOutcomes && (
                    <div style={{ marginBottom: 'var(--s5)' }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-400)', marginBottom: 'var(--s3)' }}>
                            Select focus points
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s2)' }}>
                            {availableOutcomes.map((outcome) => {
                                const code = outcome.split(':')[0].trim();
                                const selected = chosenOutcomes.includes(outcome);
                                return (
                                    <button
                                        key={outcome}
                                        id={`outcome-${code}`}
                                        className={`outcome-chip ${selected ? 'selected' : ''}`}
                                        onClick={() => onToggleOutcome(outcome)}
                                        title={outcome}
                                    >
                                        {code}
                                    </button>
                                );
                            })}
                        </div>
                        {chosenOutcomes.length > 0 && (
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-400)', marginTop: 'var(--s2)' }}>
                                {chosenOutcomes.length} outcome{chosenOutcomes.length !== 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>
                )}

                {/* Difficulty slider */}
                {hasOutcomes && (
                    <div style={{ marginBottom: 'var(--s5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
                            <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-400)' }}>
                                Difficulty
                            </p>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-800)' }}>
                                {difficultyLabels[difficulty]}
                            </span>
                        </div>
                        <input
                            id="difficulty-slider"
                            type="range"
                            min={0} max={2} step={1}
                            value={difficulty}
                            onChange={(e) => onDifficultyChange(Number(e.target.value))}
                            className="difficulty-slider"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-400)', marginTop: 'var(--s1)' }}>
                            <span>Foundation</span>
                            <span>Advanced</span>
                        </div>
                    </div>
                )}

                {/* Question types */}
                {hasOutcomes && (
                    <div>
                        <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-400)', marginBottom: 'var(--s3)' }}>
                            Question Types
                        </p>

                        <label className="checkbox-row" htmlFor="opt-worked">
                            <input
                                id="opt-worked"
                                type="checkbox"
                                checked={options.includeWorkedExamples}
                                onChange={() => onToggleOption('includeWorkedExamples')}
                            />
                            <div>
                                <div className="checkbox-row-label">Worked examples (Step-by-step)</div>
                            </div>
                        </label>

                        <label className="checkbox-row" htmlFor="opt-mcq">
                            <input
                                id="opt-mcq"
                                type="checkbox"
                                checked={options.includeMCQ}
                                onChange={() => onToggleOption('includeMCQ')}
                            />
                            <div>
                                <div className="checkbox-row-label">Multiple choice</div>
                            </div>
                        </label>

                        <label className="checkbox-row" htmlFor="opt-short">
                            <input
                                id="opt-short"
                                type="checkbox"
                                checked={options.includeShortAnswer}
                                onChange={() => onToggleOption('includeShortAnswer')}
                            />
                            <div>
                                <div className="checkbox-row-label">Short answer</div>
                            </div>
                        </label>

                        <label className="checkbox-row" htmlFor="opt-extended">
                            <input
                                id="opt-extended"
                                type="checkbox"
                                checked={options.includeExtendedResponse}
                                onChange={() => onToggleOption('includeExtendedResponse')}
                            />
                            <div>
                                <div className="checkbox-row-label">Extended response / Essay Qs</div>
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </section>
    );
}
