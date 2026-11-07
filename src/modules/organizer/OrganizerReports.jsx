import React, { useMemo } from 'react'
import { getOrganizerMatches, getOrganizerRegistrations, getOrganizerTournaments } from './organizerData'
import { PageHeader, Status } from './OrganizerShared'

export default function OrganizerReports({ data, user }) {
  const tournaments = useMemo(() => getOrganizerTournaments(data, user), [data, user])
  const registrations = useMemo(() => getOrganizerRegistrations(data, user), [data, user])
  const matches = useMemo(() => getOrganizerMatches(data, user), [data, user])
  const approved = registrations.filter(item => item.status === 'Approved')
  const completed = matches.filter(item => item.status === 'Completed')
  const winCounts = new Map()
  completed.forEach(match => winCounts.set(match.winner, (winCounts.get(match.winner) || 0) + 1))
  const topTeams = [...winCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  return <section className="module">
    <PageHeader title="Organizer reports" description="Operational summaries based only on your tournaments and their activity."/>
    <div className="stats organizer-stats">
      <div><b>{tournaments.length}</b><small>Tournaments managed</small></div>
      <div><b>{registrations.filter(item => item.status === 'Pending').length}</b><small>Pending applications</small></div>
      <div><b>{approved.length}</b><small>Approved participating teams</small></div>
      <div><b>{matches.filter(item => ['Scheduled', 'Upcoming'].includes(item.status)).length}</b><small>Upcoming matches</small></div>
    </div>
    <div className="dashboard-grid">
      <section className="panel"><h2>Tournament summary</h2>
        <div className="table-wrap"><table><thead><tr><th>Tournament</th><th>Status</th><th>Registered</th><th>Approved</th><th>Matches</th><th>Completed</th></tr></thead>
          <tbody>{tournaments.map(tournament => {
            const tournamentRegistrations = registrations.filter(item => String(item.tournamentId) === String(tournament.id))
            const tournamentMatches = matches.filter(item => String(item.tournamentId) === String(tournament.id))
            return <tr key={tournament.id}><td>{tournament.name}</td><td><Status value={tournament.status}/></td>
              <td>{tournamentRegistrations.length}</td>
              <td>{tournamentRegistrations.filter(item => item.status === 'Approved').length}</td>
              <td>{tournamentMatches.length}</td>
              <td>{tournamentMatches.filter(item => item.status === 'Completed').length}</td>
            </tr>
          })}</tbody></table>
          {!tournaments.length && <div className="empty">Create a tournament to start generating reports.</div>}
        </div>
      </section>
      <section className="panel"><h2>Top teams by wins</h2>
        {topTeams.map(([team, wins], index) => <div className="organizer-list-row" key={team}>
          <div><b>#{index + 1} {team}</b><small>{wins} completed match wins</small></div>
        </div>)}
        {!topTeams.length && <div className="empty">Completed match results will appear here.</div>}
      </section>
    </div>
    <section className="panel organizer-report-activity"><h2>Recent organizer activity</h2>
      {(data.audit || []).filter(item => item.actor === user.email).slice(0, 10).map(item =>
        <div className="audit-item" key={item.id}><b>{item.action}</b><small>{item.at}</small></div>
      )}
      {!data.audit?.some(item => item.actor === user.email) && <div className="empty">No activity recorded yet.</div>}
    </section>
  </section>
}
