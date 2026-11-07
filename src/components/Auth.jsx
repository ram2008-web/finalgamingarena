import React,{useState} from 'react'
import {Shield,Eye,EyeOff} from 'lucide-react'
import {signIn,signUp} from '../auth'
export default function Auth({onLogin}){
 const organizerRoute=window.location.hash==='#/organizer/login'
 const [mode,setMode]=useState(organizerRoute?'organizer-login':'login'),[portal,setPortal]=useState(organizerRoute),[name,setName]=useState(''),[username,setUsername]=useState(''),[email,setEmail]=useState(organizerRoute?'':'user@arenaelite.gg'),[password,setPassword]=useState(organizerRoute?'':'User@123'),[show,setShow]=useState(false),[error,setError]=useState('')
 const signup=mode==='signup'||mode==='organizer-signup'
 function submit(e){e.preventDefault();setError('');try{onLogin(signup?signUp(name,email,password,portal?'Organizer':'User',portal?username:''):signIn(email,password,portal?'Organizer':undefined))}catch(err){setError(err.message)}}
 function switchPortal(value){window.history.replaceState(null,'',value?'#/organizer/login':'/');setPortal(value);setMode(value?'organizer-login':'login');setError('');setName('');setUsername('');setEmail(value?'':'user@arenaelite.gg');setPassword(value?'':'User@123')}
 return <div className="auth-wrap"><div className="auth-card"><div className="brand-mark"><Shield/></div><div className="eyebrow">ARENA ELITE · COMPETITIVE PLATFORM</div><h1>{portal?(signup?'Organizer signup':'Organizer login'):(signup?'Create your account':'Welcome back')}</h1><p className="muted">{portal?'Sign in to manage tournaments in your Organizer workspace.':'Sign in to access your Arena Elite workspace.'}</p>
 {!portal&&<div className="tabs"><button className={mode==='login'?'selected':''} onClick={()=>setMode('login')}>Login</button><button className={mode==='signup'?'selected':''} onClick={()=>setMode('signup')}>Sign up</button></div>}
 {portal&&<div className="tabs"><button className={mode==='organizer-login'?'selected':''} onClick={()=>setMode('organizer-login')}>Login</button><button className={signup?'selected':''} onClick={()=>setMode('organizer-signup')}>Sign up</button></div>}
 <form onSubmit={submit}>{signup&&<label>Full name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}
 {portal&&mode==='organizer-signup'&&<label>Username<input required minLength="3" maxLength="24" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Choose a username"/></label>}
 <label>{portal?(signup?'Organizer email':'Organizer email or username'):'Email address'}<input required type={portal&&!signup?'text':'email'} value={email} onChange={e=>setEmail(e.target.value)} autoComplete={signup?'email':'username'}/></label>
 <label>Password<div className="password-field"><input required minLength="6" type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={signup?'new-password':'current-password'}/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>
 {error&&<div className="error">{error}</div>}<button className="btn primary wide">{signup?'Create account':'Sign in'}</button></form>
 {!portal&&<div className="demo-box"><b>Demo accounts</b><span>Admin: admin@arenaelite.gg / Admin@123</span><span>User: user@arenaelite.gg / User@123</span><button className="text-btn" onClick={()=>{setMode('login');setEmail('admin@arenaelite.gg');setPassword('Admin@123')}}>Use admin demo account</button></div>}
 <button className="text-btn organizer-auth-link" type="button" onClick={()=>switchPortal(!portal)}>{portal?'← Back to Player / Admin login':'Organizer? Open the Organizer portal'}</button>
 </div></div>
}
