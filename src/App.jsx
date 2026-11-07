import React,{useEffect,useMemo,useState} from 'react'
import {Shield,LayoutDashboard,LogOut,Menu,ChevronRight,ClipboardCheck,Gamepad2} from 'lucide-react'
import Auth from './components/Auth'
import PublicHome from './modules/public/PublicHome'
import AdminDashboard from './modules/admin/AdminDashboard'
import DataModule,{Status} from './modules/DataModule'
import {adminModules,publicModules} from './data'
import {currentUser,signOut} from './auth'
import {loadData,saveData,logAction} from './store'
import OrganizerDashboard from './modules/organizer/OrganizerDashboard'
import PlayerTournaments from './modules/public/PlayerTournaments'
const columns={
 Tournaments:[['name','Tournament'],['game','Game'],['status','Status'],['prize','Prize pool'],['teams','Teams']],
 Matches:[['id','Match ID'],['tournament','Tournament'],['a','Team A'],['b','Team B'],['score','Score'],['status','Status']],
 Teams:[['name','Team'],['game','Game'],['players','Players'],['matches','Matches'],['wins','Wins'],['points','Points'],['status','Status']],
 Leaderboard:[['name','Team'],['game','Game'],['matches','Matches'],['wins','Wins'],['points','Points']],
 Players:[['name','Player'],['game','Game'],['team','Team'],['status','Status']],
 Registrations:[['name','Team'],['event','Tournament'],['status','Status']],
 'Community Moderation':[['author','Author'],['body','Post'],['status','Status']],
 'Reports & Safety':[['subject','Report'],['status','Status']],
 Announcements:[['title','Title'],['body','Announcement']],
 'Audit Logs':[['action','Action'],['actor','Actor'],['at','Time']]
}
const sourceFor={'Tournaments':'tournaments','Matches':'matches','Teams':'teams','Leaderboard':'teams','Players':'players','Registrations':'registrations','Community Moderation':'posts','Reports & Safety':'reports','Announcements':'announcements','Schedule':'schedule','Audit Logs':'audit'}
function Checklist(){const items=[['React + Vite','The project uses React components and Vite for development/build.'],['Module identification','Public, User, Organizer and Admin areas are identified separately.'],['Login and signup','Working demo login and signup; accounts and session stored in Local Storage.'],['Vercel deployment','Build configuration is ready; deploy the generated dist folder through Vercel.'],['GitHub repository','Source is organized for a GitHub repository.']];return <section className="module"><div className="module-head"><div><div className="eyebrow">PROJECT REVIEW 2 · NOVEMBER 2–7</div><h1>Review readiness</h1><p>Visible checklist for the requested evaluation criteria.</p></div><span className="status active">READY TO DEMONSTRATE</span></div><div className="checklist">{items.map(([t,d],i)=><div className="check-row" key={t}><span className="check-icon">✓</span><div><b>{i+1}. {t}</b><p>{d}</p></div><Status value="Implemented"/></div>)}</div><div className="notice"><b>Before the review:</b> create your GitHub repository, push this project, deploy it on Vercel, then add both URLs to your presentation/submission. Local Storage authentication is a demo only, not production-grade security.</div></section>}
export default function App(){
 const [user,setUser]=useState(currentUser),[data,setData]=useState(loadData),[active,setActive]=useState('Home'),[adminOpen,setAdminOpen]=useState(false),[toast,setToast]=useState('')
 useEffect(()=>saveData(data),[data])
 const notify=(m)=>{setToast(m);setTimeout(()=>setToast(''),2600)}
 function navigate(n){
  if(user?.role==='Organizer'||n==='Organizer Dashboard')return
  if(adminModules.includes(n)&&!publicModules.includes(n)&&user?.role!=='Admin')return
  if(!publicModules.includes(n)&&!adminModules.includes(n))return
  setActive(n);setAdminOpen(adminModules.includes(n))
 }
 function act(module,action,row){
  const key=sourceFor[module];if(!key)return
  setData(prev=>{let next={...prev,[key]:[...prev[key]]};const idx=next[key].findIndex(x=>x.id===row?.id)
   if(action==='add'){
    if(module==='Announcements'){const title=prompt('Announcement title');if(!title)return prev;const body=prompt('Announcement message')||'';next[key].unshift({id:Date.now(),title,body})}
    else if(module==='Tournaments'){const name=prompt('Tournament name');if(!name)return prev;next[key].unshift({id:Date.now(),name,game:prompt('Game')||'Valorant',status:'Upcoming',prize:'TBD',teams:0})}
    else if(module==='Players'){const name=prompt('Player name');if(!name)return prev;next[key].unshift({id:Date.now(),name,game:'Valorant',team:'Unassigned',status:'Active'})}
    else if(module==='Teams'){const name=prompt('Team name');if(!name)return prev;next[key].unshift({id:Date.now(),name,game:'Valorant',players:5,matches:0,wins:0,points:0,status:'Active'})}
   }else if(action==='approve'&&idx>=0)next[key][idx]={...next[key][idx],status:'Approved'}
   else if(action==='reject'&&idx>=0)next[key][idx]={...next[key][idx],status:'Rejected'}
   else if(action==='resolve'&&idx>=0)next[key][idx]={...next[key][idx],status:'Resolved'}
   else if(action==='hide'&&idx>=0)next[key][idx]={...next[key][idx],status:'Hidden'}
   else if(action==='activate'&&idx>=0)next[key][idx]={...next[key][idx],status:next[key][idx].status==='Suspended'?'Active':'Suspended'}
   else if(action==='delete'&&idx>=0)next[key].splice(idx,1)
   else if(action==='status'&&idx>=0){const status=prompt('Enter status (Live, Upcoming, Completed)',next[key][idx].status);if(status)next[key][idx]={...next[key][idx],status}}
   return logAction(next,`${module}: ${action}${row?.name?' — '+row.name:''}`,user?.name||'Admin')
  });notify('Changes saved locally.')
 }
 if(!user)return <Auth onLogin={u=>{setUser(u);setActive('Home')}}/>
 if(user.role==='Organizer')return <OrganizerDashboard data={data} user={user}
  onDataChange={(next,action)=>setData(prev=>logAction({...next,audit:prev.audit},action,user.email))}
  onUserUpdate={setUser}
  onLogout={()=>{signOut();setUser(null);setActive('Home')}}/>
 const isAdmin=user.role==='Admin'
 const nav=isAdmin?[...publicModules,...adminModules]:publicModules
 const rowsKey=sourceFor[active],rows=rowsKey?data[rowsKey]||[]:[]
 const isAdminPage=adminModules.includes(active)
 const moduleActions={
  Players:[{key:'activate',label:'Suspend / activate',icon:'↻'},{key:'delete',label:'Delete',icon:'×'}],
  Teams:[{key:'activate',label:'Suspend / activate',icon:'↻'}],
  Tournaments:[{key:'status',label:'Update status',icon:'↻'},{key:'delete',label:'Delete',icon:'×'}],
  Registrations:[{key:'approve',label:'Approve',icon:'✓'},{key:'reject',label:'Reject',icon:'×'}],
  Matches:[{key:'status',label:'Update status',icon:'↻'}],
  'Community Moderation':[{key:'approve',label:'Approve',icon:'✓'},{key:'hide',label:'Hide',icon:'⊘'},{key:'delete',label:'Delete',icon:'×'}],
  'Reports & Safety':[{key:'resolve',label:'Resolve',icon:'✓'}],
  Announcements:[{key:'delete',label:'Delete',icon:'×'}]
 }
 return <div className="app-shell"><header className="topbar"><button className="brand" onClick={()=>navigate('Home')}><span className="brand-icon"><Gamepad2/></span><span>ARENA <b>ELITE</b><small>COMPETITIVE PLATFORM</small></span></button><div className="top-right"><span className="user-chip">{user.name} · {user.role}</span><button className="icon-btn" onClick={()=>{signOut();setUser(null)}} title="Sign out"><LogOut size={17}/></button></div></header>
 <div className="layout">
  <aside className="sidebar">
   <div className="side-label">MAIN MENU</div>
   {publicModules.map(n=><button key={n} className={`nav-item${active===n?' active':''}`} onClick={()=>navigate(n)}><span>{n==='Home'?<LayoutDashboard size={16}/>:<ChevronRight size={16}/>}</span>{n}</button>)}
   {isAdmin&&<><div className="side-label admin-label">ADMIN CONTROL</div>{adminModules.map(n=><button key={n} className={`nav-item${active===n?' active':''}`} onClick={()=>navigate(n)}><span><Shield size={15}/></span>{n}</button>)}</>}
  </aside>
 <main className="content">{active==='Tournaments'&&user.role==='User'?<PlayerTournaments data={data} user={user} onDataChange={next=>setData(prev=>logAction({...next,audit:prev.audit},`Team registration submitted: ${next.registrations[0]?.name||'team'}`,user.email))} onNotify={notify}/>:active==='Profile'?<div className="module"><div className="eyebrow">PLAYER PROFILE</div><h1>{user.name}</h1><p className="muted">Your Arena Elite account details.</p><div className="panel"><p><b>Email:</b> {user.email}</p><p><b>Role:</b> {user.role}</p><p className="muted">Your demo session is stored in this browser's Local Storage.</p></div></div>:active==='Live Matches'?<DataModule title="Live Matches" rows={data.matches.filter(m=>m.status==='Live')} columns={columns.Matches.map(([key,label])=>({key,label}))}/>:active==='Home'?<PublicHome data={data} onNavigate={navigate} user={user}/>:active==='Review 2 Checklist'?<Checklist/>:active==='Dashboard'&&isAdmin?<AdminDashboard data={data} onNavigate={navigate} user={user}/>:active==='Analytics'?<div className="module"><div className="eyebrow">ADMIN INSIGHTS</div><h1>Analytics</h1><p className="muted">Operational overview calculated from the current Local Storage dataset.</p><div className="stats admin-stats"><div><b>{data.players.length}</b><small>Players</small></div><div><b>{data.teams.length}</b><small>Teams</small></div><div><b>{data.tournaments.length}</b><small>Tournaments</small></div><div><b>{data.matches.length}</b><small>Matches</small></div><div><b>{data.audit.length}</b><small>Audit events</small></div></div></div>:active==='Settings'?<div className="module"><div className="eyebrow">ADMIN CONFIGURATION</div><h1>Settings</h1><p className="muted">Local demo configuration and project information.</p><div className="panel"><p><b>Storage:</b> Browser Local Storage</p><p><b>Authentication:</b> Demo-only client-side accounts</p><p><b>Environment:</b> React + Vite</p><button className="btn" onClick={()=>{localStorage.removeItem('arenaEliteReview2Data');location.reload()}}>Reset demo portal data</button></div></div>:active==='Leaderboards'?<DataModule title="Leaderboards" rows={[...data.teams].sort((a,b)=>b.points-a.points).map((x,i)=>({...x,rank:i+1}))} columns={[{key:'rank',label:'Rank'},...columns.Teams.filter(x=>x[0]!=='status').map(([key,label])=>({key,label}))]}/>:active==='Community'?<DataModule title="Community" rows={data.posts} columns={columns['Community Moderation'].map(([key,label])=>({key,label}))}/>:<DataModule title={active} rows={rows} columns={(columns[active]||[]).map(([key,label])=>({key,label,render:key==='status'?r=><Status value={r[key]}/>:undefined}))} actions={isAdminPage&&isAdmin?(moduleActions[active]||[]):active==='Tournaments'&&user.role==='User'?[{key:'register',label:'Register team',icon:'Register'}]:[]} addLabel={isAdminPage&&isAdmin&&['Tournaments','Players','Teams','Announcements'].includes(active)?`Add ${active==='Announcements'?'announcement':active.slice(0,-1)}`:null} onAction={(a,r)=>{if(a==='register'){const team=prompt(`Team name for ${r.name}`);if(!team)return;const contact=prompt('Team contact details (optional)')||'';try{setData(registerTeam(data,user,r.id,team,contact));notify('Registration submitted for organizer review.')}catch(error){notify(error.message)}}else act(active,a,r)}} description={isAdminPage?'Enterprise Admin Portal · Changes are saved in this browser.':'Explore Arena Elite platform information.'}/>}</main></div>{toast&&<div className="toast">{toast}</div>}</div>
}
