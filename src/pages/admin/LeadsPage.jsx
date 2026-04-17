import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadDetailModal from './LeadDetailModal';

const STAGES = [];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [stages, setStages] = useState(STAGES);
  const [stats, setStats] = useState({ total: 0, recent: 0, byStage: [] });
  const [filterStage, setFilterStage] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stage definitions once
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

  // Reload leads + stats whenever filter or search changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (filterStage && filterStage !== 'all') params.set('stage', filterStage);
    if (search.trim()) params.set('search', search.trim());
    params.set('limit', '200');

    Promise.all([
      fetch(`/api/leads?${params}`).then((r) => r.json()),
      fetch('/api/leads/stats').then((r) => r.json()),
    ])
      .then(([leadsData, statsData]) => {
        if (cancelled) return;
        setLeads(leadsData.leads || []);
        setStats(statsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch leads:', err);
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filterStage, search]);

  const handleUpdateLead = async (id, updates) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      setSelectedLead(updated);
      // Refresh stats by bumping search trigger
      setSearch((s) => s);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setSelectedLead(null);
      setSearch((s) => s);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const getStageInfo = (stageId) => stages.find((s) => s.id === stageId) || { label: stageId, color: '#999' };

  const stageCountMap = {};
  (stats.byStage || []).forEach((s) => { stageCountMap[s.stage] = s.count; });

  return (
    <div className="admin-page">
      <nav className="nav">
        <Link to="/" className="nav-logo">AutoWorkflows.ai</Link>
        <span className="admin-badge">Admin</span>
      </nav>

      <div className="admin-container">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Lead Management</h1>
            <p className="admin-subtitle">{stats.total} total leads &middot; {stats.recent} this week</p>
          </div>
        </header>

        {/* Stage pipeline cards */}
        <div className="pipeline-cards">
          <button
            className={`pipeline-card ${filterStage === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStage('all')}
          >
            <span className="pipeline-count">{stats.total}</span>
            <span className="pipeline-label">All Leads</span>
          </button>
          {stages.map((s) => (
            <button
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

        {/* Search */}
        <div className="admin-toolbar">
          <input
            type="text"
            className="admin-search"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Leads table */}
        {loading ? (
          <div className="admin-loading">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="admin-empty">
            <p>No leads found. {filterStage !== 'all' && 'Try a different stage filter.'}</p>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const stage = getStageInfo(lead.stage);
                  return (
                    <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="lead-row">
                      <td className="lead-name">
                        {lead.first_name} {lead.last_name}
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
                      <td>{lead.email_sent ? '\u2705' : '\u274C'}</td>
                      <td className="lead-date">{formatDate(lead.created_at)}</td>
                      <td>
                        <button
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
  const d = new Date(str + 'Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
