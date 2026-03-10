/**
 * SidebarSetup – Left sidebar with three numbered steps:
 * 1. State / Region
 * 2. Year Level
 * 3. Subject
 * Matches wireframe 3's sidebar layout.
 */
export default function SidebarSetup({
    states,
    selectedState, onStateChange,
    year, onYearChange,
    subjects, subject, onSubjectChange,
}) {
    return (
        <aside className="sidebar">
            <div>
                <p className="sidebar-section-title">Initial Setup</p>

                {/* Step 1: State */}
                <div className="sidebar-step">
                    <label className="sidebar-step-label">
                        <span className="step-num">1</span>
                        State / Region
                    </label>
                    <select
                        id="select-state"
                        className="form-select"
                        value={selectedState}
                        onChange={(e) => onStateChange(e.target.value)}
                    >
                        {states.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Step 2: Year */}
                <div className="sidebar-step">
                    <label className="sidebar-step-label">
                        <span className="step-num">2</span>
                        Year Level
                    </label>
                    <select
                        id="select-year"
                        className="form-select"
                        value={year}
                        onChange={(e) => onYearChange(e.target.value)}
                    >
                        <option value={12}>Year 12</option>
                        <option value={11}>Year 11</option>
                    </select>
                </div>

                {/* Step 3: Subject */}
                <div className="sidebar-step">
                    <label className="sidebar-step-label">
                        <span className="step-num">3</span>
                        Subject
                    </label>
                    <select
                        id="select-subject"
                        className="form-select"
                        value={subject}
                        onChange={(e) => onSubjectChange(e.target.value)}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Step 4: Content hint */}
                <div className="sidebar-step">
                    <label className="sidebar-step-label">
                        <span className="step-num">4</span>
                        Add Content
                    </label>
                    <p className="sidebar-hint">Use the "Input" panel to paste study material.</p>
                </div>

                {/* Step 5: Generate hint */}
                <div className="sidebar-step">
                    <label className="sidebar-step-label">
                        <span className="step-num">5</span>
                        Generate
                    </label>
                    <p className="sidebar-hint">Configure target outcomes and hit Generate.</p>
                </div>
            </div>

            <div className="sidebar-footer">
                <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Powered by Kuraplan AI
                </p>
                <p>Aligned to Australian Curriculum standards for 2024/25.</p>
            </div>
        </aside>
    );
}
