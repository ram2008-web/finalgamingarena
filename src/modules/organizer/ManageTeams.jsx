import React, { useMemo, useState } from 'react'
import { getOrganizerRegistrations, getOrganizerTournaments, reviewRegistration, updateParticipant } from './organizerData'
import { PageHeader, SearchFilter, Status } from './OrganizerShared'

export default function ManageTeams({ data, user, onChange, notify }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', contact: '' })
  const tournaments = useMemo(() => getOrganizerTournaments(data, user), [data, user])
  const teams = useMemo(() => getOrganizerRegistrations(data, user).filter(item =>
    (filter === 'All' || item.status === filter) &&
    `${item.name} ${item.event} ${item.contact || ''}`.toLowerCase().includes(query.toLowerCase())
  ), [data, user, filter, query])

  function beginEdit(team) {
    setEditing(team.id)
    setForm({ name: team.name, contact: team.contact || '' })
  }

  function saveEdit(event) {
    event.preventDefault()
    try {
      onChange(updateParticipant(data, user, editing, form), `Updated participating team: ${form.name}`)
      setEditing(null)
      notify('Team details updated.')
    } catch (error) { notify(error.message) }
  }

  function updateStatus(team, status) {
    try {
      onChange(reviewRegistration(data, user, team.id, status), `${status} team: ${team.name}`)
      notify(`Team marked ${status.toLowerCase()}.`)
    } catch (error) { notify(error.message) }
  }

  return <section className="module">
    <PageHeader title="Manage teams" description="View and maintain teams registered for your tournaments."/>
    <SearchFilter query={query} onQuery={setQuery} placeholder="Search teams or tournaments..." filter={filter} onFilter={setFilter}
      options={['All', 'Pending', 'Approved', 'Rejected']}/>
    <div className="table-wrap"><table><thead><tr><th>Team</th><th>Tournament</th><th>Contact</th><th>Players</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{teams.map(team => <tr key={team.id}>
        <td>{editing === team.id
          ? <form className="team-edit" onSubmit={saveEdit}>
            <input aria-label="Team name" required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })}/>
            <input aria-label="Team contact" value={form.contact} onChange={event => setForm({ ...form, contact: event.target.value })}/>
            <button className="btn primary">Save</button><button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>
          </form>
          : team.name}
        </td>
        <td>{tournaments.find(item => String(item.id) === String(team.tournamentId))?.name || team.event}</td>
        <td>{team.contact || '—'}</td><td>{team.players ?? '—'}</td><td><Status value={team.status}/></td>
        <td><div className="row-actions">
          {editing !== team.id && <button onClick={() => beginEdit(team)}>Edit details</button>}
          {team.status !== 'Approved' && <button onClick={() => updateStatus(team, 'Approved')}>Approve</button>}
          {team.status !== 'Rejected' && <button onClick={() => updateStatus(team, 'Rejected')}>Reject</button>}
        </div></td>
      </tr>)}</tbody></table>
      {!teams.length && <div className="empty">No teams match your filters.</div>}
    </div>
  </section>
}
