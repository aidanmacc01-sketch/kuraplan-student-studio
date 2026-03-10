/**
 * PanelInput – Panel 1: Input content via tabs (My notes / Textbook / Worksheet).
 * Matches wireframe 1 and 3 panel layout.
 */
const TABS = [
    { id: 'notes', label: 'My notes' },
    { id: 'textbook', label: 'Textbook' },
    { id: 'worksheet', label: 'Worksheet' },
];

const PLACEHOLDERS = {
    notes: 'Paste your syllabus notes, essay drafts, or revision summaries here...',
    textbook: 'Paste textbook excerpts or article text here...',
    worksheet: 'Paste a teacher worksheet here to base your questions on...',
};

export default function PanelInput({ tab, onTabChange, text, onTextChange }) {
    return (
        <section className="panel">
            <div className="panel-header">
                <span className="material-symbols-outlined">edit_note</span>
                <h3>Input your content</h3>
            </div>

            {/* Tabs */}
            <div className="panel-tabs">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        id={`tab-${t.id}`}
                        className={`panel-tab ${tab === t.id ? 'active' : ''}`}
                        onClick={() => onTabChange(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Textarea */}
            <div className="panel-body" style={{ padding: 'var(--s4)' }}>
                <textarea
                    id="input-textarea"
                    className="form-textarea"
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    placeholder={PLACEHOLDERS[tab]}
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                />
            </div>
        </section>
    );
}
