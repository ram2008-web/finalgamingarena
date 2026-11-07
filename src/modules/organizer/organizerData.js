function requireOrganizer(user) {
  if (!user?.id || user.role !== 'Organizer') throw new Error('Organizer access is required.')
}

function ownedTournament(data, user, tournamentId) {
  requireOrganizer(user)
  const tournament = data.tournaments.find(item => String(item.id) === String(tournamentId) && item.organizerId === user.id)
  if (!tournament) throw new Error('Tournament not found in your Organizer account.')
  return tournament
}

function makeId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
}

function validateTournament(fields) {
  if (!fields || typeof fields !== 'object') throw new Error('Tournament details are required.')
  const required = ['name', 'game', 'description', 'startDate', 'endDate', 'registrationDeadline', 'maxTeams', 'rules']
  if (required.some(key => !String(fields[key] ?? '').trim())) throw new Error('Complete all required tournament fields.')
  const start = new Date(`${fields.startDate}T00:00:00`)
  const end = new Date(`${fields.endDate}T00:00:00`)
  const deadline = new Date(`${fields.registrationDeadline}T00:00:00`)
  if ([start, end, deadline].some(date => Number.isNaN(date.getTime()))) throw new Error('Enter valid tournament dates.')
  if (end < start) throw new Error('End date must be on or after the start date.')
  if (deadline > start) throw new Error('Registration deadline must be on or before the start date.')
  const maxTeams = Number(fields.maxTeams)
  const entryFee = Number(fields.entryFee || 0)
  if (!Number.isInteger(maxTeams) || maxTeams < 2) throw new Error('Maximum teams must be a whole number of at least 2.')
  if (!Number.isFinite(entryFee) || entryFee < 0) throw new Error('Entry fee must be zero or a positive amount.')
}

export function getOrganizerTournaments(data, user) {
  requireOrganizer(user)
  return data.tournaments.filter(tournament => tournament.organizerId === user.id)
}

export function createTournament(data, user, fields, publish) {
  requireOrganizer(user)
  validateTournament(fields)
  const tournament = {
    ...fields,
    id: makeId('tournament'),
    organizerId: user.id,
    maxTeams: Number(fields.maxTeams),
    entryFee: Number(fields.entryFee || 0),
    teams: 0,
    prize: fields.entryFee ? `${fields.entryFee} entry` : 'No entry fee',
    status: publish ? 'Upcoming' : 'Draft',
    createdAt: new Date().toISOString()
  }
  return { ...data, tournaments: [tournament, ...data.tournaments] }
}

export function updateTournament(data, user, tournamentId, fields, publish) {
  const current = ownedTournament(data, user, tournamentId)
  validateTournament(fields)
  const registeredTeams = data.registrations.filter(registration =>
    registration.organizerId === user.id &&
    String(registration.tournamentId) === String(current.id) &&
    registration.status !== 'Rejected'
  ).length
  if (Number(fields.maxTeams) < registeredTeams) throw new Error('Maximum teams cannot be lower than the number of active registrations.')
  const tournaments = data.tournaments.map(tournament => tournament.id === current.id && tournament.organizerId === user.id
    ? { ...tournament, ...fields, maxTeams: Number(fields.maxTeams), entryFee: Number(fields.entryFee || 0),
      prize: fields.entryFee ? `${fields.entryFee} entry` : 'No entry fee',
      status: current.status === 'Draft' && publish ? 'Upcoming' : current.status }
    : tournament)
  return { ...data, tournaments }
}

export function updateTournamentStatus(data, user, tournamentId, status) {
  const allowed = ['Draft', 'Upcoming', 'Live', 'Completed']
  if (!allowed.includes(status)) throw new Error('Invalid tournament status.')
  const tournament = ownedTournament(data, user, tournamentId)
  return {
    ...data,
    tournaments: data.tournaments.map(item => item.id === tournament.id && item.organizerId === user.id
      ? { ...item, status }
      : item)
  }
}

export function deleteTournament(data, user, tournamentId) {
  const tournament = ownedTournament(data, user, tournamentId)
  const isRelated = item => String(item.tournamentId) === String(tournament.id)
  return {
    ...data,
    tournaments: data.tournaments.filter(item => item.id !== tournament.id || item.organizerId !== user.id),
    registrations: data.registrations.filter(item => !isRelated(item) || item.organizerId !== user.id),
    matches: data.matches.filter(item => !isRelated(item) || item.organizerId !== user.id)
  }
}

export function getOrganizerRegistrations(data, user) {
  const tournaments = getOrganizerTournaments(data, user)
  const ownedIds = new Set(tournaments.map(item => String(item.id)))
  return data.registrations.filter(registration =>
    registration.organizerId === user.id && ownedIds.has(String(registration.tournamentId))
  )
}

export function reviewRegistration(data, user, registrationId, status) {
  if (!['Approved', 'Rejected'].includes(status)) throw new Error('Invalid registration decision.')
  const registrations = getOrganizerRegistrations(data, user)
  if (!registrations.some(item => String(item.id) === String(registrationId))) throw new Error('Registration not found in your tournaments.')
  const updatedRegistrations = data.registrations.map(item =>
    String(item.id) === String(registrationId) && item.organizerId === user.id ? { ...item, status } : item
  )
  const activeCounts = new Map()
  for (const registration of updatedRegistrations) {
    if (registration.organizerId === user.id && registration.status !== 'Rejected') {
      const tournamentId = String(registration.tournamentId)
      activeCounts.set(tournamentId, (activeCounts.get(tournamentId) || 0) + 1)
    }
  }
  return {
    ...data,
    registrations: updatedRegistrations,
    tournaments: data.tournaments.map(item => item.organizerId === user.id
      ? { ...item, teams: activeCounts.get(String(item.id)) || 0 }
      : item)
  }
}

export function updateParticipant(data, user, registrationId, changes) {
  const registration = getOrganizerRegistrations(data, user)
    .find(item => String(item.id) === String(registrationId))
  if (!registration) throw new Error('Team registration not found in your tournaments.')
  const name = String(changes.name || '').trim()
  const contact = String(changes.contact || '').trim()
  if (!name) throw new Error('Team name is required.')
  const duplicate = getOrganizerRegistrations(data, user).some(item =>
    String(item.id) !== String(registrationId) &&
    String(item.tournamentId) === String(registration.tournamentId) &&
    item.name.toLowerCase() === name.toLowerCase() &&
    item.status !== 'Rejected'
  )
  if (duplicate) throw new Error('A team with this name is already registered for the tournament.')
  return {
    ...data,
    registrations: data.registrations.map(item =>
      String(item.id) === String(registrationId) && item.organizerId === user.id
        ? { ...item, name, contact, event: data.tournaments.find(tournament => String(tournament.id) === String(item.tournamentId))?.name || item.event }
        : item
    ),
    matches: data.matches.map(item => item.organizerId === user.id
      ? {
        ...item,
        a: item.a === registration.name ? name : item.a,
        b: item.b === registration.name ? name : item.b,
        winner: item.winner === registration.name ? name : item.winner
      }
      : item)
  }
}

export function registerTeam(data, user, tournamentId, teamName, contact = '') {
  if (!user?.id || user.role !== 'User') throw new Error('Player accounts are required to register a team.')
  if (typeof teamName !== 'string' || typeof contact !== 'string') throw new Error('Enter valid team registration details.')
  const tournament = data.tournaments.find(item => String(item.id) === String(tournamentId) && item.status !== 'Draft')
  if (!tournament) throw new Error('This tournament is not accepting registrations.')
  if (tournament.status === 'Completed' || (tournament.registrationDeadline && tournament.registrationDeadline < new Date().toISOString().slice(0, 10))) {
    throw new Error('The registration period for this tournament has ended.')
  }
  const registrations = data.registrations.filter(item => String(item.tournamentId) === String(tournament.id))
  if (registrations.some(item => item.userId === user.id)) throw new Error('You have already submitted a registration for this tournament.')
  if (!teamName.trim()) throw new Error('Enter a team name.')
  if (registrations.some(item => item.name.toLowerCase() === teamName.trim().toLowerCase() && item.status !== 'Rejected')) {
    throw new Error('A team with this name has already registered.')
  }
  const capacity = Number(tournament.maxTeams || tournament.teams || 0)
  if (capacity > 0 && registrations.filter(item => item.status !== 'Rejected').length >= capacity) throw new Error('This tournament has reached its team limit.')
  const newRegistration = {
    id: makeId('registration'),
    tournamentId: tournament.id,
    organizerId: tournament.organizerId,
    userId: user.id,
    name: teamName.trim(),
    contact: contact.trim(),
    event: tournament.name,
    status: 'Pending',
    registeredAt: new Date().toISOString()
  }
  return {
    ...data,
    tournaments: tournament.organizerId ? data.tournaments.map(item => item.id === tournament.id
      ? { ...item, teams: Number(item.teams || 0) + 1 }
      : item) : data.tournaments,
    registrations: [newRegistration, ...data.registrations]
  }
}

export function getOrganizerMatches(data, user) {
  const tournaments = getOrganizerTournaments(data, user)
  const ownedIds = new Set(tournaments.map(item => String(item.id)))
  return data.matches.filter(match => match.organizerId === user.id && ownedIds.has(String(match.tournamentId)))
}

export function scheduleMatch(data, user, tournamentId, fields) {
  const tournament = ownedTournament(data, user, tournamentId)
  if (!fields || !fields.dateTime || Number.isNaN(new Date(fields.dateTime).getTime())) {
    throw new Error('Enter a valid match date and time.')
  }
  const matchDate = new Date(fields.dateTime)
  if (tournament.startDate && matchDate < new Date(`${tournament.startDate}T00:00:00`)) {
    throw new Error('Match date must fall within the tournament schedule.')
  }
  if (tournament.endDate && matchDate > new Date(`${tournament.endDate}T23:59:59`)) {
    throw new Error('Match date must fall within the tournament schedule.')
  }
  const approved = getOrganizerRegistrations(data, user)
    .filter(registration => String(registration.tournamentId) === String(tournament.id) && registration.status === 'Approved')
  const teamNames = new Set(approved.map(registration => registration.name))
  if (!fields.teamA || !fields.teamB || fields.teamA === fields.teamB ||
      !teamNames.has(fields.teamA) || !teamNames.has(fields.teamB)) {
    throw new Error('Choose two different approved teams from this tournament.')
  }
  return {
    ...data,
    matches: [{
      id: makeId('match'),
      tournamentId: tournament.id,
      organizerId: user.id,
      tournament: tournament.name,
      game: tournament.game,
      a: fields.teamA,
      b: fields.teamB,
      dateTime: new Date(fields.dateTime).toISOString(),
      scoreA: null,
      scoreB: null,
      score: '—',
      winner: '',
      status: 'Scheduled'
    }, ...data.matches]
  }
}

export function updateMatchResult(data, user, matchId, scoreAValue, scoreBValue) {
  const matches = getOrganizerMatches(data, user)
  const match = matches.find(item => String(item.id) === String(matchId))
  if (!match) throw new Error('Match not found in your tournaments.')
  if (String(scoreAValue).trim() === '' || String(scoreBValue).trim() === '') {
    throw new Error('Enter both team scores.')
  }
  const scoreA = Number(scoreAValue)
  const scoreB = Number(scoreBValue)
  if (!Number.isInteger(scoreA) || !Number.isInteger(scoreB) || scoreA < 0 || scoreB < 0 || scoreA === scoreB) {
    throw new Error('Enter non-negative whole-number scores with no tie.')
  }
  return {
    ...data,
    matches: data.matches.map(item => String(item.id) === String(matchId) && item.organizerId === user.id ? {
      ...item,
      scoreA,
      scoreB,
      score: `${scoreA} - ${scoreB}`,
      winner: scoreA > scoreB ? item.a : item.b,
      status: 'Completed'
    } : item)
  }
}

export function updateMatchStatus(data, user, matchId, status) {
  if (!['Scheduled', 'Live', 'Completed', 'Cancelled'].includes(status)) throw new Error('Invalid match status.')
  const match = getOrganizerMatches(data, user).find(item => String(item.id) === String(matchId))
  if (!match) throw new Error('Match not found in your tournaments.')
  if (status === 'Completed' && !match.winner) throw new Error('Enter a valid match result before completing the match.')
  return {
    ...data,
    matches: data.matches.map(item =>
      String(item.id) === String(matchId) && item.organizerId === user.id ? { ...item, status } : item
    )
  }
}

export function getLeaderboard(data, user, tournamentId) {
  const tournament = ownedTournament(data, user, tournamentId)
  const registrations = getOrganizerRegistrations(data, user)
    .filter(item => String(item.tournamentId) === String(tournament.id) && item.status === 'Approved')
  const standings = new Map(registrations.map(item => [item.name, { name: item.name, played: 0, wins: 0, losses: 0, points: 0 }]))
  const matches = getOrganizerMatches(data, user).filter(item =>
    String(item.tournamentId) === String(tournament.id) && item.status === 'Completed' && item.winner
  )
  for (const match of matches) {
    for (const teamName of [match.a, match.b]) {
      if (!standings.has(teamName)) standings.set(teamName, { name: teamName, played: 0, wins: 0, losses: 0, points: 0 })
      standings.get(teamName).played += 1
    }
    const winner = standings.get(match.winner)
    const loser = standings.get(match.winner === match.a ? match.b : match.a)
    winner.wins += 1
    winner.points += 3
    loser.losses += 1
  }
  return [...standings.values()]
    .sort((a, b) => b.points - a.points || b.wins - a.wins || a.name.localeCompare(b.name))
    .map((team, index) => ({ ...team, rank: index + 1 }))
}
