import { useState, useEffect } from 'react';

export default function LeadDetailModal({ lead, stages, onUpdate, onDelete, onClose }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const startEditing = () => {
    setForm({
      first_name: lead.first_name || '',
      last_name: lead.last_name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      role: lead.role || '',
      website: lead.website || '',
      notes: lead.notes || '',
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setForm({});
  };

  const saveEdit = () => {
    onUpdate(lead.id, form);
    setEditing(false);
    setForm({});
  };

  // Stage changes go through immediately (not editable from the pill UI).
  // If the user is in the middle of editing other fields, we block stage
  // changes until they save or cancel — otherwise the merged update can
  // overwrite their in-progress edits on the next save.
  const handleStageChange = (newStage) => {
    if (editing) {
      alert('Save or cancel your edits before changing stage.');
      return;
    }
    if (newStage === lead.stage) return;
    onUpdate(lead.id, { stage: newStage });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content lead-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        {/* Header */}
        <div className="ld-header">
          <div className="ld-avatar">
            {(lead.first_name || '?')[0]}{(lead.last_name || '?')[0]}
          </div>
          <div>
            <h2 className="ld-name">{lead.first_name} {lead.last_name}</h2>
            <p className="ld-meta">{lead.role ? `${lead.role} at ` : ''}{lead.company || 'Unknown Company'}</p>
          </div>
          {lead.archetype_code && (
            <div className="ld-archetype">
              <span className="archetype-badge lg">{lead.archetype_code}</span>
              <span className="ld-archetype-name">{lead.archetype_name}</span>
            </div>
          )}
        </div>

        {/* Stage pipeline */}
        <div className="ld-section">
          <h3 className="ld-section-title">Pipeline Stage</h3>
          <div className="ld-stage-pills">
            {stages.map((s) => (
              <button
                key={s.id}
                className={`ld-stage-pill ${lead.stage === s.id ? 'active' : ''}`}
                style={{ '--pill-color': s.color }}
                onClick={() => handleStageChange(s.id)}
              >
                <span className="ld-stage-dot" style={{ background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact info (view / edit) */}
        <div className="ld-section">
          <div className="ld-section-header">
            <h3 className="ld-section-title">Contact Information</h3>
            {!editing ? (
              <button className="ld-edit-btn" onClick={startEditing}>Edit</button>
            ) : (
              <div className="ld-edit-actions">
                <button className="ld-save-btn" onClick={saveEdit}>Save</button>
                <button className="ld-cancel-btn" onClick={cancelEditing}>Cancel</button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="ld-fields">
              <Field label="Email" value={lead.email} />
              <Field label="Phone" value={lead.phone} />
              <Field label="Company" value={lead.company} />
              <Field label="Role" value={lead.role} />
              <Field label="Website" value={lead.website} />
              <Field label="Expert Call" value={lead.expert_call ? 'Yes' : 'No'} />
              <Field label="Email Sent" value={lead.email_sent ? 'Yes' : 'No'} />
            </div>
          ) : (
            <div className="ld-edit-form">
              {[
                { key: 'first_name', label: 'First Name' },
                { key: 'last_name', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'company', label: 'Company' },
                { key: 'role', label: 'Role / Title' },
                { key: 'website', label: 'Website' },
              ].map(({ key, label }) => (
                <div className="ld-edit-row" key={key}>
                  <label>{label}</label>
                  <input
                    type="text"
                    value={form[key] || ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="ld-edit-row ld-edit-full">
                <label>Notes</label>
                <textarea
                  rows={3}
                  value={form.notes || ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Internal notes about this lead..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Quiz profiling data */}
        <div className="ld-section">
          <h3 className="ld-section-title">Quiz Profile</h3>
          <div className="ld-fields">
            <Field label="Industry" value={lead.industry} />
            <Field label="Company Size" value={lead.company_size} />
            <Field label="Team Size" value={lead.team_size} />
            <Field label="Pain Points" value={Array.isArray(lead.pain_points) ? lead.pain_points.join(', ') : lead.pain_points} />
            <Field label="Driver" value={lead.driver} />
            <Field label="Timeline" value={lead.timeline} />
            <Field label="Time Lost" value={lead.time_lost} />
            <Field label="Scope" value={lead.scope} />
            <Field label="Decision Maker" value={lead.decision_maker} />
          </div>
        </div>

        {/* Workflow ratings */}
        {lead.workflow_ratings && typeof lead.workflow_ratings === 'object' && Object.keys(lead.workflow_ratings).length > 0 && (
          <div className="ld-section">
            <h3 className="ld-section-title">Workflow Ratings</h3>
            <div className="ld-wf-grid">
              {Object.entries(lead.workflow_ratings).map(([area, rating]) => (
                <div className="ld-wf-item" key={area}>
                  <span className="ld-wf-area">{area}</span>
                  <span className={`ld-wf-rating ld-wf-${rating}`}>{rating}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {lead.notes && !editing && (
          <div className="ld-section">
            <h3 className="ld-section-title">Notes</h3>
            <p className="ld-notes">{lead.notes}</p>
          </div>
        )}

        {/* Scores */}
        {lead.percentages && typeof lead.percentages === 'object' && Object.keys(lead.percentages).length > 0 && (
          <div className="ld-section">
            <h3 className="ld-section-title">Dimension Scores</h3>
            <div className="ld-scores">
              {Object.entries(lead.percentages).map(([dim, pct]) => (
                <div className="ld-score-row" key={dim}>
                  <span className="ld-score-label">{dim}</span>
                  <div className="ld-score-bar-track">
                    <div className="ld-score-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="ld-score-pct">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="ld-footer">
          <span className="ld-timestamp">
            Created {formatDateTime(lead.created_at)} &middot; Updated {formatDateTime(lead.updated_at)}
          </span>
          <button className="ld-delete-btn" onClick={() => onDelete(lead.id)}>
            Delete Lead
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="ld-field">
      <span className="ld-field-label">{label}</span>
      <span className="ld-field-value">{value || '—'}</span>
    </div>
  );
}

function formatDateTime(str) {
  if (!str) return '—';
  const d = new Date(str.replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return str;
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}
