import React, { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { registerTeam } from '../organizer/organizerData'
import './PlayerTournaments.css'

export default function PlayerTournaments({ data, user, onDataChange, onNotify }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [contact, setContact] = useState('')
  const tournaments = useMemo(() => data.tournaments.filter(item =>
    item.status !== 'Draft' &&
    `${item.name} ${item.game} ${item.description || ''}`.toLowerCase().includes(query.toLowerCase())
  ), [data.tournaments, query])

  function submit(event, tournament) {
    event.preventDefault()
    try {
      onDataChange(registerTeam(data, user, tournament.id, teamName, contact))
      onNotify(`Registration submitted for ${tournament.name}.`)
      setSelectedId(null)
      setTeamName('')
      setContact('')
    } catch (error) {
      onNotify(error.message)
    }
  }

  function openRegistration(tournament) {
    setSelectedId(tournament.id)
    setTeamName('')
    setContact('')
  }

  return <section className="module">
    <div className="module-head"><div><div className="eyebrow">ARENA ELITE / TOURNAMENTS</div><h1>Tournaments</h1><p>Browse events and register your team for an open tournament.</p></div></div>
    <div className="toolbar"><div className="search"><Search size={16}/><input aria-label="Search tournaments" placeholder="Search tournaments..." value={query} onChange={event => setQuery(event.target.value)}/></div><span className="muted">{tournaments.length} tournaments</span></div>
    <div className="cards player-tournament-cards">
      {tournaments.map(tournament => {
        const registration = data.registrations.find(item => item.tournamentId === tournament.id && item.userId === user.id)
        const registeredTeams = data.registrations.filter(item =>
          item.tournamentId === tournament.id && item.status !== 'Rejected'
        ).length
        const accepting = tournament.status !== 'Completed' &&
          (!tournament.registrationDeadline || tournament.registrationDeadline >= new Date().toISOString().slice(0, 10))
        return <article className="feature-card player-tournament-card" key={tournament.id}>
          <div className="eyebrow">{tournament.game} · {tournament.status}</div>
          <h3>{tournament.name}</h3>
          <p>{tournament.description || 'Tournament details will be shared by the organizer.'}</p>
          <small>{tournament.startDate || 'Dates to be announced'} · Registration deadline {tournament.registrationDeadline || '—'}</small>
          <small>Teams registered: {registeredTeams} · Maximum teams: {tournament.maxTeams || tournament.teams || '—'} · Entry fee: {tournament.entryFee ? tournament.entryFee : 'None'}</small>
          {registration ? <span className={`status ${registration.status.toLowerCase()}`}>Registration {registration.status}</span> :
            <button className="btn primary" disabled={!accepting} onClick={() => openRegistration(tournament)}>{accepting ? 'Register a team' : 'Registration closed'}</button>}
          {selectedId === tournament.id && <form className="player-registration-form" onSubmit={event => submit(event, tournament)}>
            <label>Team name<input required value={teamName} onChange={event => setTeamName(event.target.value)} maxLength="60"/></label>
            <label>Team contact<input value={contact} onChange={event => setContact(event.target.value)} placeholder="Email or phone" maxLength="120"/></label>
            <div className="form-actions"><button type="button" className="btn" onClick={() => setSelectedId(null)}>Cancel</button><button className="btn primary">Submit registration</button></div>
          </form>}
        </article>
      })}
      {!tournaments.length && <div className="empty">No tournaments match your search.</div>}
    </div>
  </section>
}
