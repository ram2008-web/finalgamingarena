import React, { useMemo, useState } from 'react'
import { CalendarDays, ClipboardList, LayoutDashboard, LogOut, Settings, Shield, Swords, Trophy, Users } from 'lucide-react'
import { updatePassword, updateProfile } from '../../auth'
import { getOrganizerMatches, getOrganizerRegistrations, getOrganizerTournaments } from './organizerData'
import ManageTournaments from './ManageTournaments'
import ManageRegistrations from './ManageRegistrations'
import ManageMatches from './ManageMatches'
import ManageTeams from './ManageTeams'
import OrganizerReports from './OrganizerReports'
import { PageHeader, Status } from './OrganizerShared'
import './organizer.css'

const menu = [
  ['Dashboard', LayoutDashboard], ['Manage Tournaments', Trophy], ['Manage Registrations', ClipboardList],
  ['Manage Matches', Swords], ['Manage Teams', Users], ['Reports', CalendarDays], ['Profile & Settings', Settings]
]

export default function OrganizerDashboard({ data, user, onDataChange, onUserUpdate, onLogout }) {
  const [active, setActive] = useState('Dashboard')
  const [toast, setToast] = useState('')
  const [profile, setProfile] = useState({ name: user.name, contact: user.contact || '' })
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const tournaments = useMemo(() => getOrganizerTournaments(data, user), [data, user])
  const registrations = useMemo(() => getOrganizerRegistrations(data, user), [data, user])
  const matches = useMemo(() => getOrganizerMatches(data, user), [data, user])
  const teams = registrations.filter(item => item.status === 'Approved')
  const upcoming = matches.filter(match => ['Scheduled', 'Upcoming'].includes(match.status))
  const recent = (data.audit || []).filter(item => item.actor === user.email).slice(0, 6)

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 3000)
  }

  function commit(next, activity) {
    onDataChange(next, activity)
  }

  function saveProfile(event) {
    event.preventDefault()
    try {
      onUserUpdate(updateProfile(user.id, profile))
      notify('Profile updated.')
    } catch (error) { notify(error.message) }
  }

  function savePassword(event) {
    event.preventDefault()
    if (password.next !== password.confirm) return notify('New passwords do not match.')
    try {
      updatePassword(user.id, password.current, password.next)
      setPassword({ current: '', next: '', confirm: '' })
      notify('Password updated.')
    } catch (error) { notify(error.message) }
  }

  function renderOverview() {
    return <section className="module">
      <PageHeader title={`Welcome, ${user.name}`} description="Your tournaments and operations overview."
        action={<button className="btn primary" onClick={() => setActive('Manage Tournaments')}>Create tournament</button>}/>
      <div className="stats organizer-stats">
        <div><Trophy/><b>{tournaments.length}</b><small>Total tournaments managed</small></div>
        <div><ClipboardList/><b>{registrations.filter(item => item.status === 'Pending').length}</b><small>Pending registrations</small></div>
        <div><Users/><b>{teams.length}</b><small>Participating teams</small></div>
        <div><Swords/><b>{upcoming.length}</b><small>Upcoming matches</small></div>
      </div>
      <div className="organizer-quick-nav">
        {menu.slice(1, 6).map(([label, Icon]) => <button className="panel" key={label} onClick={() => setActive(label)}>
          <Icon/><b>{label}</b><span>Open module →</span>
        </button>)}
      </div>
      <div className="dashboard-grid">
        <section className="panel"><h2>My tournaments</h2>
          {tournaments.slice(0, 5).map(tournament => <div className="organizer-list-row" key={tournament.id}>
            <div><b>{tournament.name}</b><small>{tournament.game} · {tournament.startDate || 'Dates not set'}</small></div>
            <Status value={tournament.status}/>
          </div>)}
          {!tournaments.length && <div className="empty">Create a tournament to get started.</div>}
        </section>
        <section className="panel"><h2>Recent organizer activity</h2>
          {recent.map(item => <div className="audit-item" key={item.id}><b>{item.action}</b><small>{item.at}</small></div>)}
          {!recent.length && <div className="empty">Organizer activity will appear here.</div>}
        </section>
      </div>
    </section>
  }

  const page = {
    Dashboard: renderOverview,
    'Manage Tournaments': () => <ManageTournaments data={data} user={user} onChange={commit} notify={notify}/>,
    'Manage Registrations': () => <ManageRegistrations data={data} user={user} onChange={commit} notify={notify}/>,
    'Manage Matches': () => <ManageMatches data={data} user={user} onChange={commit} notify={notify}/>,
    'Manage Teams': () => <ManageTeams data={data} user={user} onChange={commit} notify={notify}/>,
    Reports: () => <OrganizerReports data={data} user={user}/>,
    'Profile & Settings': () => <section className="module">
      <PageHeader title="Profile & settings" description="Update your contact details and account password."/>
      <div className="profile-grid">
        <form className="panel organizer-form" onSubmit={saveProfile}><h2>Profile information</h2>
          <label>Name<input required value={profile.name} onChange={event => setProfile({ ...profile, name: event.target.value })}/></label>
          <label>Email<input value={user.email} readOnly/></label>
          <label>Contact information<input value={profile.contact} onChange={event => setProfile({ ...profile, contact: event.target.value })}/></label>
          <button className="btn primary">Save profile</button>
        </form>
        <form className="panel organizer-form" onSubmit={savePassword}><h2>Update password</h2>
          <label>Current password<input type="password" required value={password.current} onChange={event => setPassword({ ...password, current: event.target.value })}/></label>
          <label>New password<input type="password" minLength="6" required value={password.next} onChange={event => setPassword({ ...password, next: event.target.value })}/></label>
          <label>Confirm new password<input type="password" minLength="6" required value={password.confirm} onChange={event => setPassword({ ...password, confirm: event.target.value })}/></label>
          <button className="btn primary">Update password</button>
        </form>
      </div>
      <p className="muted">Demo authentication uses browser Local Storage and is not production-secure.</p>
    </section>
  }[active]()

  return <div className="app-shell organizer-shell">
    <header className="topbar"><div className="brand"><span className="brand-icon"><Trophy/></span>
      <span>ARENA <b>ELITE</b><small>ORGANIZER PORTAL</small></span></div>
      <div className="top-right"><span className="user-chip">{user.name} · Organizer</span>
        <button className="icon-btn" title="Logout" onClick={onLogout}><LogOut size={17}/></button>
      </div>
    </header>
    <div className="layout">
      <aside className="sidebar organizer-sidebar"><div className="side-label">ORGANIZER MENU</div>
        {menu.map(([label, Icon]) => <button key={label} className={`nav-item${active === label ? ' active' : ''}`}
          onClick={() => setActive(label)}><span><Icon size={16}/></span>{label}</button>)}
        <button className="nav-item organizer-logout" onClick={onLogout}><span><LogOut size={16}/></span>Logout</button>
      </aside>
      <main className="content">{page}</main>
    </div>
    {toast && <div className="toast">{toast}</div>}
  </div>
}
