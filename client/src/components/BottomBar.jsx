/**
 * BottomBar – status bar with last-generated timestamp and action buttons.
 * Matches wireframe 1 footer layout.
 */
export default function BottomBar({ lastGenerated, hasResults, onDownloadPDF, onCopyClipboard }) {
    const timeLabel = lastGenerated
        ? `Last generated: ${lastGenerated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : 'Last generated: --';

    return (
        <footer className="bottom-bar">
            <div className="bottom-bar-left">
                <span className={`status-dot ${hasResults ? 'green' : 'gray'}`} />
                <span style={{ color: 'var(--text-400)' }}>{timeLabel}</span>
                <span style={{ color: 'var(--border-dark)' }}>|</span>
                <span>NSW Curriculum v2.0</span>
            </div>

            <div className="bottom-bar-actions">
                <button
                    id="btn-download-pdf"
                    className="btn btn-ghost btn-sm"
                    onClick={onDownloadPDF}
                    disabled={!hasResults}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>download</span>
                    Download PDF
                </button>
                <button
                    id="btn-copy"
                    className="btn btn-ghost btn-sm"
                    onClick={onCopyClipboard}
                    disabled={!hasResults}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>content_copy</span>
                    Copy to clipboard
                </button>
                <button
                    className="btn btn-ghost btn-sm"
                    disabled
                    title="Coming soon"
                    style={{ opacity: 0.35 }}
                >
                    Share to teacher
                    <span className="badge badge-gray" style={{ marginLeft: 4 }}>Soon</span>
                </button>
            </div>
        </footer>
    );
}
