import React, { useMemo, useState } from 'react'
import {
  getOrganizerMatches, getOrganizerRegistrations, getOrganizerTournaments, scheduleMatch,
  updateMatchResult, updateMatchStatus
} from './organizerData'
import { PageHeader, SearchFilter, Status } from './OrganizerShared'

export default function ManageMatches({ data, user, onChange, notify }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [scores, setScores] = useState({})
  const [schedule, setSchedule] = useState({ tournamentId: '', teamA: '', teamB: '', dateTime: '' })
  const tournaments = useMemo(() => getOrganizerTournaments(data, user), [data, user])
  const registrations = useMemo(() => getOrganizerRegistrations(data, user), [data, user])
  const matches = useMemo(() => getOrganizerMatches(data, user).filter(item =>
    (filter === 'All' || item.status === filter) &&
    `${item.tournament} ${item.a} ${item.b}`.toLowerCase().includes(query.toLowerCase())
  ), [data, user, filter, query])
  const approvedTeams = registrations.filter(item =>
    String(item.tournamentId) === String(schedule.tournamentId) && item.status === 'Approved'
  )

  function addMatch(event) {
    event.preventDefault()
    try {
      onChange(scheduleMatch(data, user, schedule.tournamentId, schedule), 'Scheduled a tournament match')
      setSchedule({ ...schedule, teamA: '', teamB: '', dateTime: '' })
      notify('Match scheduled.')
    } catch (error) { notify(error.message) }
  }

  function saveScore(match) {
    try {
      onChange(updateMatchResult(data, user, match.id, scores[match.id]?.a, scores[match.id]?.b),
        `Updated result: ${match.a} vs ${match.b}`)
      notify('Match result saved.')
    } catch (error) { notify(error.message) }
  }

  function setStatus(match, status) {
    try {
      onChange(updateMatchStatus(data, user, match.id, status), `Changed match status: ${match.id} → ${status}`)
      notify('Match status updated.')
    } catch (error) { notify(error.message) }
  }

  return <section className="module">
    <PageHeader title="Manage matches" description="Schedule matches for approved tournament teams and update results."/>
    <form className="panel organizer-form" onSubmit={addMatch}>
      <h2>Schedule match</h2>
      <div className="form-grid">
        <label>Tournament<select required value={schedule.tournamentId} onChange={event => setSchedule({ ...schedule, tournamentId: event.target.value, teamA: '', teamB: '' })}>
          <option value="">Choose your tournament</option>{tournaments.filter(item => item.status !== 'Draft').map(item =>
            <option key={item.id} value={item.id}>{item.name}</option>)}
        </select></label>
        <label>Date and time<input required type="datetime-local" value={schedule.dateTime} onChange={event => setSchedule({ ...schedule, dateTime: event.target.value })}/></label>
        <label>Team A<select required value={schedule.teamA} onChange={event => setSchedule({ ...schedule, teamA: event.target.value })}>
          <option value="">Choose team</option>{approvedTeams.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
        </select></label>
        <label>Team B<select required value={schedule.teamB} onChange={event => setSchedule({ ...schedule, teamB: event.target.value })}>
          <option value="">Choose team</option>{approvedTeams.filter(item => item.name !== schedule.teamA).map(item =>
            <option key={item.id} value={item.name}>{item.name}</option>)}
        </select></label>
      </div>
      <p className="muted">Only approved teams belonging to the selected tournament can be scheduled.</p>
      <button className="btn primary" disabled={approvedTeams.length < 2}>Schedule match</button>
    </form>
    <SearchFilter query={query} onQuery={setQuery} placeholder="Search matches..." filter={filter} onFilter={setFilter}
      options={['All', 'Scheduled', 'Live', 'Completed', 'Cancelled']}/>
    <div className="table-wrap"><table><thead><tr><th>Tournament</th><th>Teams</th><th>Date</th><th>Score</th><th>Winner</th><th>Status</th><th>Update result</th></tr></thead>
      <tbody>{matches.map(match => <tr key={match.id}>
        <td>{match.tournament}</td><td>{match.a} vs {match.b}</td>
        <td>{match.dateTime ? new Date(match.dateTime).toLocaleString() : '—'}</td>
        <td>{match.score || '—'}</td><td>{match.winner || '—'}</td>
        <td><select aria-label={`Status for ${match.id}`} value={match.status} onChange={event => setStatus(match, event.target.value)}>
          <option>Scheduled</option><option>Live</option><option>Completed</option><option>Cancelled</option>
        </select><Status value={match.status}/></td>
        <td><div className="score-entry">
          <input aria-label={`${match.a} score`} type="number" min="0" step="1" value={scores[match.id]?.a ?? ''} onChange={event =>
            setScores({ ...scores, [match.id]: { ...scores[match.id], a: event.target.value } })}/>
          <span>–</span>
          <input aria-label={`${match.b} score`} type="number" min="0" step="1" value={scores[match.id]?.b ?? ''} onChange={event =>
            setScores({ ...scores, [match.id]: { ...scores[match.id], b: event.target.value } })}/>
          <button type="button" className="btn" onClick={() => saveScore(match)}>Save</button>
        </div></td>
      </tr>)}</tbody></table>
      {!matches.length && <div className="empty">No matches match your filters.</div>}
    </div>
  </section>
}
