import React, { useMemo, useState } from 'react'
import { getOrganizerRegistrations, getOrganizerTournaments, reviewRegistration } from './organizerData'
import { PageHeader, SearchFilter, Status } from './OrganizerShared'

export default function ManageRegistrations({ data, user, onChange, notify }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const tournaments = useMemo(() => getOrganizerTournaments(data, user), [data, user])
  const rows = useMemo(() => getOrganizerRegistrations(data, user).filter(item =>
    (filter === 'All' || item.status === filter) &&
    `${item.name} ${item.event} ${item.contact || ''}`.toLowerCase().includes(query.toLowerCase())
  ), [data, user, filter, query])

  function review(registration, status) {
    try {
      onChange(reviewRegistration(data, user, registration.id, status), `${status} registration: ${registration.name}`)
      notify(`Registration ${status.toLowerCase()}.`)
    } catch (error) { notify(error.message) }
  }

  const columns = [
    { key: 'name', label: 'Team' },
    { key: 'tournament', label: 'Tournament', render: item =>
      tournaments.find(tournament => String(tournament.id) === String(item.tournamentId))?.name || item.event },
    { key: 'contact', label: 'Contact' },
    { key: 'date', label: 'Registered', render: item => item.registeredAt ? new Date(item.registeredAt).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', render: item => <Status value={item.status}/> },
    { key: 'actions', label: 'Actions', render: item => <div className="row-actions">
      <button disabled={item.status === 'Approved'} onClick={() => review(item, 'Approved')}>Approve</button>
      <button disabled={item.status === 'Rejected'} onClick={() => review(item, 'Rejected')}>Reject</button>
    </div> }
  ]

  return <section className="module">
    <PageHeader title="Manage registrations" description="Review applications associated with your tournaments."/>
    <SearchFilter query={query} onQuery={setQuery} placeholder="Search teams or tournaments..." filter={filter} onFilter={setFilter}
      options={['All', 'Pending', 'Approved', 'Rejected']}/>
    <div className="table-wrap"><table><thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead>
      <tbody>{rows.map(item => <tr key={item.id}>{columns.map(column =>
        <td key={column.key}>{column.render ? column.render(item) : item[column.key] || '—'}</td>
      )}</tr>)}</tbody></table>
      {!rows.length && <div className="empty">No registrations match your filters.</div>}
    </div>
  </section>
}
