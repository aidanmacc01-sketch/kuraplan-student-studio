/**
 * NavBar – top header with branding, breadcrumb nav, and user avatar.
 * Matches wireframe 3 layout: icon + "Kuraplan" | divider | "Student Studio Beta" | breadcrumb | avatar
 */
export default function NavBar({ breadcrumbs = [] }) {
    return (
        <header className="navbar">
            {/* Brand */}
            <div className="navbar-brand">
                <div className="brand-icon">
                    <span className="material-symbols-outlined">school</span>
                </div>
                <span className="brand-name">Kuraplan</span>
                <div className="brand-divider" />
                <span className="brand-module">Student Studio</span>
                <span className="brand-badge">Beta</span>
            </div>

            {/* Breadcrumb */}
            <nav className="navbar-breadcrumb">
                <span>Dashboard</span>
                <span className="material-symbols-outlined sep" style={{ fontSize: '1rem', color: 'var(--text-300)' }}>chevron_right</span>
                {breadcrumbs.map((crumb, i) => (
                    <span key={i}>
                        {i > 0 && <span className="material-symbols-outlined sep" style={{ fontSize: '1rem', color: 'var(--text-300)', marginRight: 4 }}>chevron_right</span>}
                        <span className={crumb.active ? 'active' : ''}>{crumb.label}</span>
                    </span>
                ))}
            </nav>

            {/* Actions */}
            <div className="navbar-actions">
                <button className="avatar-btn icon" title="Notifications" aria-label="Notifications">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="avatar-btn user" title="Account" aria-label="Account">
                    JD
                </button>
            </div>
        </header>
    );
}
