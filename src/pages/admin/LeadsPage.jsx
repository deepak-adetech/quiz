import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadDetailModal from './LeadDetailModal';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [stages, setStages] = useState([]);
  const [stats, setStats] = useState({ total: 0, recent: 0, byStage: [] });
  const [filterStage, setFilterStage] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  // Distinguish initial load from silent refresh so the table doesn't flash
  const [initialLoading, setInitialLoading] = useState(true);
  // Monotonic counter — bump to trigger a re-fetch of leads + stats
  const [refreshToken, setRefreshToken] = useState(0);
  const refresh = () => setRefreshToken((n) => n + 1);

  // ── Debounce the search input (300ms) ──
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ── Load stage definitions once ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/leads/stages');
        const data = await res.json();
        if (!cancelled) setStages(data.stages || []);
      } catch (e) { console.error(e); }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Fetch leads + stats whenever filter, debounced search, or refresh token changes ──
  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams();
    if (filterStage && filterStage !== 'all') params.set('stage', filterStage);
    if (debouncedSearch) params.set('search', debouncedSearch);
    params.set('limit', '200');

    Promise.all([
      fetch(`/api/leads?${params}`).then((r) => r.json()),
      fetch('/api/leads/stats').then((r) => r.json()),
    ])
      .then(([leadsData, statsData]) => {
        if (cancelled) return;
        setLeads(leadsData.leads || []);
        setStats(statsData);
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch leads:', err);
        if (!cancelled) setInitialLoading(false);
      });

    return () => { cancelled = true; };
  }, [filterStage, debouncedSearch, refreshToken]);

  // ── CRUD handlers ──
  const handleUpdateLead = async (id, updates) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      // Keep the open modal in sync
      setSelectedLead((prev) => (prev && prev.id === id ? updated : prev));
      // Refresh stats/pipeline counts
      refresh();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update lead. Please try again.');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this lead permanently? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setSelectedLead((prev) => (prev && prev.id === id ? null : prev));
      refresh();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete lead. Please try again.');
    }
  };

  const getStageInfo = (stageId) =>
    stages.find((s) => s.id === stageId) || { label: stageId || '—', color: '#999' };

  const stageCountMap = {};
  (stats.byStage || []).forEach((s) => { stageCountMap[s.stage] = s.count; });

  return (
    <div className="admin-page">
      <nav className="nav">
        <Link to="/" className="nav-logo">Comet Lab</Link>
        <span className="admin-badge">Admin</span>
      </nav>

      <div className="admin-container">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Lead Management</h1>
            <p className="admin-subtitle">
              {stats.total} total lead{stats.total === 1 ? '' : 's'}
              {' · '}
              {stats.recent} this week
            </p>
          </div>
        </header>

        {/* Stage pipeline cards */}
        <div className="pipeline-cards">
          <button
            type="button"
            className={`pipeline-card ${filterStage === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStage('all')}
          >
            <span className="pipeline-count">{stats.total}</span>
            <span className="pipeline-label">All Leads</span>
          </button>
          {stages.map((s) => (
            <button
              type="button"
              key={s.id}
              className={`pipeline-card ${filterStage === s.id ? 'active' : ''}`}
              onClick={() => setFilterStage(s.id)}
              style={{ '--pipe-color': s.color }}
            >
              <span className="pipeline-dot" style={{ background: s.color }} />
              <span className="pipeline-count">{stageCountMap[s.id] || 0}</span>
              <span className="pipeline-label">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <input
            type="text"
            className="admin-search"
            placeholder="Search by name, email, or company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && search !== debouncedSearch && (
            <span className="admin-search-status">Searching…</span>
          )}
        </div>

        {/* Leads table (keeps previous data visible during silent refreshes) */}
        {initialLoading ? (
          <div className="admin-loading">Loading leads…</div>
        ) : leads.length === 0 ? (
          <div className="admin-empty">
            <p>
              No leads found.
              {(filterStage !== 'all' || debouncedSearch) && ' Try clearing the filters.'}
            </p>
          </div>
        ) : (
          <div className="leads-table-wrap">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Archetype</th>
                  <th>Stage</th>
                  <th>Email Sent</th>
                  <th>Created</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const stage = getStageInfo(lead.stage);
                  return (
                    <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="lead-row">
                      <td className="lead-name">
                        {lead.first_name || lead.last_name
                          ? `${lead.first_name} ${lead.last_name}`.trim()
                          : '(no name)'}
                      </td>
                      <td className="lead-email">{lead.email}</td>
                      <td>{lead.company || '—'}</td>
                      <td>
                        {lead.archetype_code ? (
                          <span className="archetype-badge">{lead.archetype_code}</span>
                        ) : '—'}
                      </td>
                      <td>
                        <span className="stage-badge" style={{ background: stage.color }}>
                          {stage.label}
                        </span>
                      </td>
                      <td>{lead.email_sent ? '\u2705' : '\u2014'}</td>
                      <td className="lead-date">{formatDate(lead.created_at)}</td>
                      <td>
                        <button
                          type="button"
                          className="lead-delete-btn"
                          title="Delete lead"
                          onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id); }}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          stages={stages}
          onUpdate={handleUpdateLead}
          onDelete={handleDeleteLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

function formatDate(str) {
  if (!str) return '—';
  // SQLite stores timestamps in UTC without a Z suffix — append one so JS parses correctly
  const d = new Date(str.replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return str;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
