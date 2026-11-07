import React, { useMemo, useState } from 'react'
import { getOrganizerTournaments, createTournament, updateTournament, updateTournamentStatus, deleteTournament } from './organizerData'
import { PageHeader, SearchFilter, Status } from './OrganizerShared'

const emptyForm = {
  name: '', game: '', description: '', startDate: '', endDate: '', registrationDeadline: '',
  maxTeams: '16', entryFee: '0', rules: ''
}

export default function ManageTournaments({ data, user, onChange, notify }) {
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [details, setDetails] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const tournaments = useMemo(() => getOrganizerTournaments(data, user).filter(item =>
    (filter === 'All' || item.status === filter) &&
    `${item.name} ${item.game}`.toLowerCase().includes(query.toLowerCase())
  ), [data, user, query, filter])

  function save(event, publish) {
    event.preventDefault()
    try {
      const next = editing
        ? updateTournament(data, user, editing.id, form, publish)
        : createTournament(data, user, form, publish)
      onChange(next, `${editing ? 'Updated' : publish ? 'Published' : 'Saved draft'} tournament: ${form.name.trim()}`)
      setForm(emptyForm)
      setEditing(null)
      notify('Tournament saved.')
    } catch (error) { notify(error.message) }
  }

  function edit(tournament) {
    setEditing(tournament)
    setForm({
      name: tournament.name, game: tournament.game, description: tournament.description || '',
      startDate: tournament.startDate || '', endDate: tournament.endDate || '',
      registrationDeadline: tournament.registrationDeadline || '',
      maxTeams: String(tournament.maxTeams || 16), entryFee: String(tournament.entryFee || 0),
      rules: tournament.rules || ''
    })
  }

  const columns = [
    { key: 'name', label: 'Tournament' }, { key: 'game', label: 'Game' },
    { key: 'dates', label: 'Dates', render: item => `${item.startDate || '—'} – ${item.endDate || '—'}` },
    { key: 'teams', label: 'Teams', render: item => `${item.teams || 0} / ${item.maxTeams || '—'}` },
    { key: 'status', label: 'Status', render: item => <Status value={item.status}/> },
    { key: 'actions', label: 'Actions', render: item => <div className="row-actions">
      <button onClick={() => setDetails(details === item.id ? null : item.id)}>View</button>
      <button onClick={() => edit(item)}>Edit</button>
      <select aria-label={`Status for ${item.name}`} value={item.status} onChange={event => {
        try { onChange(updateTournamentStatus(data, user, item.id, event.target.value), `Changed status: ${item.name} → ${event.target.value}`); notify('Tournament status updated.') }
        catch (error) { notify(error.message) }
      }}><option>Draft</option><option>Upcoming</option><option>Live</option><option>Completed</option></select>
      <button onClick={() => {
        if (window.confirm(`Delete "${item.name}" and its registrations and matches?`)) {
          try { onChange(deleteTournament(data, user, item.id), `Deleted tournament: ${item.name}`); notify('Tournament deleted.') }
          catch (error) { notify(error.message) }
        }
      }}>Delete</button>
    </div> }
  ]
  const visibleRows = tournaments.flatMap(item => details === item.id
    ? [item, { id: `${item.id}-details`, _detail: item }]
    : [item])
  const tableColumns = columns.map(column => column.key === 'name'
    ? { ...column, render: row => row._detail ? <div className="organizer-tournament-details">
      <b>Description</b><p>{row._detail.description || 'No description provided.'}</p>
      <b>Rules</b><p>{row._detail.rules || 'No rules provided.'}</p>
      <small>Deadline {row._detail.registrationDeadline || '—'} · Entry fee {row._detail.entryFee || 0}</small>
    </div> : row.name }
    : column)
  const renderRow = row => row._detail
    ? <tr key={row.id}><td colSpan={tableColumns.length}><div className="organizer-tournament-details">
      <b>Description</b><p>{row._detail.description || 'No description provided.'}</p><b>Rules</b>
      <p>{row._detail.rules || 'No rules provided.'}</p><small>Deadline {row._detail.registrationDeadline || '—'} · Entry fee {row._detail.entryFee || 0}</small>
    </div></td></tr>
    : <tr key={row.id}>{tableColumns.map(column => <td key={column.key}>{column.render ? column.render(row) : row[column.key] ?? '—'}</td>)}</tr>

  return <section className="module">
    <PageHeader title="Manage tournaments" description="Create and manage only tournaments owned by your account."
      action={<button className="btn" type="button" onClick={() => { setEditing(null); setForm(emptyForm) }}>New tournament</button>}/>
    <form className="panel organizer-form" onSubmit={event => save(event, true)}>
      <h2>{editing ? `Edit ${editing.name}` : 'Create tournament'}</h2>
      <div className="form-grid">
        <label>Tournament name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })}/></label>
        <label>Game / sport<input required value={form.game} onChange={event => setForm({ ...form, game: event.target.value })}/></label>
        <label>Start date<input type="date" required value={form.startDate} onChange={event => setForm({ ...form, startDate: event.target.value })}/></label>
        <label>End date<input type="date" required value={form.endDate} onChange={event => setForm({ ...form, endDate: event.target.value })}/></label>
        <label>Registration deadline<input type="date" required value={form.registrationDeadline} onChange={event => setForm({ ...form, registrationDeadline: event.target.value })}/></label>
        <label>Maximum teams<input type="number" min="2" step="1" required value={form.maxTeams} onChange={event => setForm({ ...form, maxTeams: event.target.value })}/></label>
        <label>Entry fee<input type="number" min="0" step="0.01" value={form.entryFee} onChange={event => setForm({ ...form, entryFee: event.target.value })}/></label>
        <label className="span-two">Description<textarea required rows="3" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })}/></label>
        <label className="span-two">Tournament rules<textarea required rows="3" value={form.rules} onChange={event => setForm({ ...form, rules: event.target.value })}/></label>
      </div>
      <div className="form-actions"><button type="button" className="btn" onClick={event => save(event, false)}>Save as draft</button>
        <button className="btn primary">{editing ? 'Save changes' : 'Publish tournament'}</button>
        {editing && <button type="button" className="btn" onClick={() => { setEditing(null); setForm(emptyForm) }}>Cancel edit</button>}
      </div>
    </form>
    <SearchFilter query={query} onQuery={setQuery} placeholder="Search tournaments..." filter={filter} onFilter={setFilter}
      options={['All', 'Draft', 'Upcoming', 'Live', 'Completed']}/>
    <div className="table-wrap"><table><thead><tr>{tableColumns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead>
      <tbody>{visibleRows.map(renderRow)}</tbody></table>
      {!visibleRows.length && <div className="empty">No tournaments match your filters.</div>}
    </div>
  </section>
}
