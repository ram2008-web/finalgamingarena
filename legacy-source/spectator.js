const DATA={
  matches:[
    {id:"M-114",game:"Valorant",tournament:"Valorant Champions Cup",a:"Shadow Titans",b:"Phoenix Squad",sa:13,sb:10,viewers:8420,status:"live",progress:78,time:"10:00 AM"},
    {id:"M-115",game:"CS2",tournament:"CS2 Masters",a:"Night Wolves",b:"Apex Legends",sa:8,sb:6,viewers:5610,status:"live",progress:62,time:"12:30 PM"},
    {id:"M-116",game:"PUBG",tournament:"PUBG Battleground Series",a:"Titan Force",b:"Cyber Knights",sa:0,sb:0,viewers:0,status:"upcoming",progress:0,time:"3:00 PM"},
    {id:"M-117",game:"Valorant",tournament:"Valorant Champions Cup",a:"Iron Reapers",b:"Storm Breakers",sa:0,sb:0,viewers:0,status:"upcoming",progress:0,time:"5:30 PM"},
    {id:"M-118",game:"Free Fire",tournament:"Free Fire Elite League",a:"Storm Breakers",b:"Titan Force",sa:0,sb:0,viewers:0,status:"upcoming",progress:0,time:"7:00 PM"}
  ],
  tournaments:[
    {id:1,name:"Valorant Champions Cup",game:"Valorant",status:"live",prize:"₹12,00,000",teams:64,date:"Aug 28 – Sep 12",code:"VC",desc:"The premier Valorant championship of Season 6."},
    {id:2,name:"CS2 Masters",game:"CS2",status:"upcoming",prize:"₹8,50,000",teams:32,date:"Sep 14 – Sep 28",code:"CS",desc:"A double-elimination invitational for the region's strongest rosters."},
    {id:3,name:"PUBG Battleground Series",game:"PUBG",status:"upcoming",prize:"₹6,00,000",teams:48,date:"Sep 05 – Oct 10",code:"PB",desc:"A competitive mobile league running across six weeks."},
    {id:4,name:"FIFA Pro League",game:"FIFA",status:"upcoming",prize:"₹3,00,000",teams:128,date:"Sep 20 – Oct 04",code:"FI",desc:"An open round-robin league for competitive players."},
    {id:5,name:"Free Fire Elite League",game:"Free Fire",status:"completed",prize:"₹5,00,000",teams:40,date:"Jul 10 – Aug 02",code:"FF",desc:"Season 5's mobile flagship event."},
    {id:6,name:"Mobile Legends Championship",game:"Mobile Legends",status:"live",prize:"₹4,50,000",teams:24,date:"Aug 30 – Sep 15",code:"ML",desc:"Single-elimination cup for rising rosters."}
  ],
  leaderboard:[
    {rank:1,team:"Storm Breakers",game:"Free Fire",matches:92,wins:71,points:2840},
    {rank:2,team:"Shadow Titans",game:"Valorant",matches:86,wins:58,points:2615},
    {rank:3,team:"Phoenix Squad",game:"Valorant",matches:88,wins:56,points:2490},
    {rank:4,team:"Titan Force",game:"PUBG",matches:79,wins:49,points:2310},
    {rank:5,team:"Night Wolves",game:"CS2",matches:81,wins:47,points:2185},
    {rank:6,team:"Cyber Knights",game:"PUBG",matches:74,wins:42,points:2040},
    {rank:7,team:"Apex Legends",game:"CS2",matches:70,wins:38,points:1890},
    {rank:8,team:"Iron Reapers",game:"Valorant",matches:68,wins:33,points:1705}
  ],
  teams:[
    {name:"Shadow Titans",game:"Valorant",players:5,matches:86,wins:58,points:2615,code:"ST"},
    {name:"Storm Breakers",game:"Free Fire",players:5,matches:92,wins:71,points:2840,code:"SB"},
    {name:"Phoenix Squad",game:"Valorant",players:5,matches:88,wins:56,points:2490,code:"PS"},
    {name:"Titan Force",game:"PUBG",players:5,matches:79,wins:49,points:2310,code:"TF"},
    {name:"Night Wolves",game:"CS2",players:5,matches:81,wins:47,points:2185,code:"NW"},
    {name:"Cyber Knights",game:"PUBG",players:5,matches:74,wins:42,points:2040,code:"CK"},
    {name:"Apex Legends",game:"CS2",players:5,matches:70,wins:38,points:1890,code:"AL"},
    {name:"Iron Reapers",game:"Valorant",players:5,matches:68,wins:33,points:1705,code:"IR"}
  ],
  schedule:{
    today:[
      ["10:00 AM","Shadow Titans","Phoenix Squad","Valorant","M-114","LIVE"],
      ["12:30 PM","Night Wolves","Apex Legends","CS2","M-115","LIVE"],
      ["3:00 PM","Titan Force","Cyber Knights","PUBG","M-116","UPCOMING"],
      ["5:30 PM","Iron Reapers","Storm Breakers","Valorant","M-117","UPCOMING"],
      ["7:00 PM","Storm Breakers","Titan Force","Free Fire","M-118","UPCOMING"]
    ],
    tomorrow:[
      ["11:00 AM","Shadow Titans","Iron Reapers","Valorant","M-121","UPCOMING"],
      ["2:00 PM","Phoenix Squad","Night Wolves","CS2","M-122","UPCOMING"],
      ["5:00 PM","Cyber Knights","Titan Force","PUBG","M-123","UPCOMING"]
    ],
    week:[
      ["Thu · 4:00 PM","Shadow Titans","Iron Reapers","Valorant","M-127","UPCOMING"],
      ["Fri · 6:00 PM","Storm Breakers","Phoenix Squad","Free Fire","M-128","UPCOMING"],
      ["Sat · 8:00 PM","Night Wolves","Titan Force","CS2","M-129","UPCOMING"]
    ]
  },
  announcements:[
    ["Grand Finals starting soon","The Valorant Champions Cup Grand Finals are approaching. Tune in for the season's biggest showdown.","8 min ago","trophy"],
    ["Match is now LIVE","Shadow Titans vs Phoenix Squad has gone live on the main broadcast.","18 min ago","radio"],
    ["Schedule update","The PUBG Battleground Series evening match has moved to 7:00 PM.","42 min ago","calendar"],
    ["New tournament announced","Mobile Legends Championship is now open for spectators to follow.","1 hr ago","megaphone"],
    ["Final results published","Free Fire Elite League Season 5 results are now available.","3 hrs ago","flag"]
  ]
};

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const saved=JSON.parse(localStorage.getItem("arenaEliteSpectator")||"{}");
const state={
  name:saved.name||"Spectator",
  email:saved.email||"spectator@arenaelite.gg",
  favoritesTeams:saved.favoritesTeams||[],
  favoritesTournaments:saved.favoritesTournaments||[],
  recent:saved.recent||[],
  notifications:saved.notifications!==false,
  scheduleDay:"today",
  tournamentStatus:"all"
};

function persist(){localStorage.setItem("arenaEliteSpectator",JSON.stringify(state))}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove("show"),2400)}
function initials(name){return name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function esc(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function navigate(view){
  $$(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+view));
  $$(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.view===view));
  window.scrollTo({top:0,behavior:"smooth"});
  $("#mainNav").classList.remove("open");
  if(view==="profile") renderProfile();
}
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
$$(".nav-link").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$("#mobileMenu").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));

function matchCard(m){
  return `<article class="live-card">
    <div class="card-top"><span class="game-label">${esc(m.game)} · ${esc(m.id)}</span><span class="${m.status==="live"?"live-label":"status-label upcoming"}">${m.status==="live"?"● LIVE":"UPCOMING"}</span></div>
    <div class="match-score">
      <div><div class="team-logo">${initials(m.a)}</div><div class="team-name">${esc(m.a)}</div></div>
      <div><div class="score">${m.sa} <span class="vs">–</span> ${m.sb}</div><small>${m.status==="live"?m.progress+"% match progress":m.time}</small></div>
      <div><div class="team-logo">${initials(m.b)}</div><div class="team-name">${esc(m.b)}</div></div>
    </div>
    <div class="card-meta"><span>${esc(m.tournament)}</span><span>${m.status==="live"?m.viewers.toLocaleString()+" viewers":m.time}</span></div>
    ${m.status==="live"?`<div class="progress"><i style="width:${m.progress}%"></i></div>`:""}
    <button class="watch-btn" data-watch="${m.id}">${m.status==="live"?"▶ Watch Match":"＋ Follow Match"}</button>
  </article>`;
}

function renderHome(){
  const live=DATA.matches.filter(m=>m.status==="live");
  $("#homeLiveGrid").innerHTML=live.slice(0,3).map(matchCard).join("");
  $("#statLive").textContent=live.length;
  $("#heroLiveCount").textContent=live.length;
  $("#homeUpcoming").innerHTML=DATA.schedule.today.slice(2,5).map(s=>`<div class="schedule-mini"><time>${s[0]}</time><div><strong>${esc(s[1])} vs ${esc(s[2])}</strong><small>${esc(s[3])} · ${s[4]}</small></div><b>${s[5]}</b></div>`).join("");
  $("#activityFeed").innerHTML=DATA.announcements.slice(0,4).map(a=>`<div class="activity-item"><div class="activity-icon"><i data-lucide="${a[3]}"></i></div><div><strong>${esc(a[0])}</strong><p>${esc(a[1])}</p><time>${a[2]}</time></div></div>`).join("");
  const f=DATA.tournaments[0];
  $("#featuredTournament").innerHTML=`<div><span class="eyebrow">● LIVE EVENT · ${f.game}</span><h3>${esc(f.name)}</h3><p>${esc(f.desc)}</p></div><div class="feature-stats"><div><span>Prize Pool</span><strong>${f.prize}</strong></div><div><span>Teams</span><strong>${f.teams}</strong></div><div><span>Status</span><strong>LIVE</strong></div></div>`;
  bindWatch();
}

function renderLive(){
  const q=$("#liveSearch").value.toLowerCase(), game=$("#liveGameFilter").value;
  const data=DATA.matches.filter(m=>m.status==="live"&&(game==="all"||m.game===game)&&[m.a,m.b,m.game,m.tournament].join(" ").toLowerCase().includes(q));
  $("#liveGrid").innerHTML=data.length?data.map(matchCard).join(""):`<div class="empty">No live matches match your filters.</div>`;
  bindWatch();
}
function renderTournaments(){
  const q=$("#tournamentSearch").value.toLowerCase(), status=state.tournamentStatus;
  const data=DATA.tournaments.filter(t=>(status==="all"||t.status===status)&&[t.name,t.game].join(" ").toLowerCase().includes(q));
  $("#tournamentGrid").innerHTML=data.map(t=>`<article class="tournament-card"><div class="card-top"><span class="game-label">${esc(t.game)}</span><button class="favorite ${state.favoritesTournaments.includes(t.id)?"active":""}" data-fav-t="${t.id}"><i data-lucide="star"></i></button></div><div class="tournament-banner">${esc(t.code)}</div><span class="status-label ${t.status}">${t.status.toUpperCase()}</span><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p><div class="tournament-stats"><div><span>Prize</span><strong>${t.prize}</strong></div><div><span>Teams</span><strong>${t.teams}</strong></div><div><span>Date</span><strong>${t.date}</strong></div></div><button class="watch-btn" data-follow-t="${t.id}">${state.favoritesTournaments.includes(t.id)?"★ Following":"☆ Follow Tournament"}</button></article>`).join("");
  $$("[data-fav-t]").forEach(b=>b.addEventListener("click",()=>toggleTournament(Number(b.dataset.favT))));
  $$("[data-follow-t]").forEach(b=>b.addEventListener("click",()=>toggleTournament(Number(b.dataset.followT))));
}
function toggleTournament(id){state.favoritesTournaments=state.favoritesTournaments.includes(id)?state.favoritesTournaments.filter(x=>x!==id):[...state.favoritesTournaments,id];persist();renderTournaments();renderProfile();toast(state.favoritesTournaments.includes(id)?"Tournament added to favorites":"Tournament removed")}
function renderLeaderboard(){
  const top=DATA.leaderboard.slice(0,3);
  $("#podium").innerHTML=top.map((x,i)=>`<article class="podium-card"><div class="podium-rank">#${x.rank}</div><h3>${esc(x.team)}</h3><p>${x.game} · ${x.wins} wins</p><div class="podium-points">${x.points.toLocaleString()} pts</div></article>`).join("");
  $("#leaderboardRows").innerHTML=DATA.leaderboard.map(x=>`<div class="leader-row"><span class="rank">#${x.rank}</span><strong>${esc(x.team)}<small style="display:block;color:var(--faint);font-size:9px;font-weight:500">${x.game}</small></strong><span>${x.matches}</span><span>${x.wins}</span><span>${x.points.toLocaleString()}</span><span class="winrate">${Math.round(x.wins/x.matches*100)}%</span></div>`).join("");
}
function renderTeams(){
  const q=$("#teamSearch").value.toLowerCase(), game=$("#teamGameFilter").value;
  const data=DATA.teams.filter(t=>(game==="all"||t.game===game)&&[t.name,t.game].join(" ").toLowerCase().includes(q));
  $("#teamGrid").innerHTML=data.map(t=>`<article class="team-card"><div class="team-head"><div class="team-symbol">${t.code}</div><div><h3>${esc(t.name)}</h3><p>${esc(t.game)}</p></div><span class="team-status">● ACTIVE</span></div><div class="team-metrics"><div><span>Players</span><strong>${t.players}</strong></div><div><span>Wins</span><strong>${t.wins}</strong></div><div><span>Points</span><strong>${t.points}</strong></div></div><button class="watch-btn" data-follow-team="${esc(t.name)}">${state.favoritesTeams.includes(t.name)?"★ Following Team":"☆ Follow Team"}</button></article>`).join("");
  $$("[data-follow-team]").forEach(b=>b.addEventListener("click",()=>toggleTeam(b.dataset.followTeam)));
}
function toggleTeam(name){state.favoritesTeams=state.favoritesTeams.includes(name)?state.favoritesTeams.filter(x=>x!==name):[...state.favoritesTeams,name];persist();renderTeams();renderProfile();toast(state.favoritesTeams.includes(name)?"Team added to favorites":"Team removed")}
function renderAnnouncements(){$("#announcementList").innerHTML=DATA.announcements.map(a=>`<article class="announcement-card"><div class="announcement-icon"><i data-lucide="${a[3]}"></i></div><div><h3>${esc(a[0])}</h3><p>${esc(a[1])}</p></div><time>${a[2]}</time></article>`).join("")}
function renderSchedule(){
  const rows=DATA.schedule[state.scheduleDay];
  $("#scheduleList").innerHTML=rows.map(s=>`<article class="schedule-row"><time>${s[0]}</time><div><strong>${esc(s[1])}</strong><small>Team A</small></div><div><strong>${esc(s[2])}</strong><small>${esc(s[3])}</small></div><span class="match-number">${s[4]}</span><span class="status-label ${s[5]==="LIVE"?"live":"upcoming"}">${s[5]}</span></article>`).join("");
}
function renderProfile(){
  $("#profileName").textContent=state.name;$("#profileEmail").textContent=state.email;$("#profileAvatar").textContent=initials(state.name);
  $("#nameInput").value=state.name;$("#emailInput").value=state.email;
  $("#favoriteTeamsCount").textContent=state.favoritesTeams.length;$("#favoriteTournamentsCount").textContent=state.favoritesTournaments.length;$("#recentWatchedCount").textContent=state.recent.length;$("#notificationToggle").checked=state.notifications;
  $("#recentList").innerHTML=state.recent.length?state.recent.map(x=>`<div class="recent-item">${esc(x)}</div>`).join(""):`<div class="recent-item">No recently watched matches yet. Watch a live match to see it here.</div>`;
}
function bindWatch(){$$("[data-watch]").forEach(b=>b.addEventListener("click",()=>{const m=DATA.matches.find(x=>x.id===b.dataset.watch);if(!m)return;if(!state.recent.includes(`${m.a} vs ${m.b}`))state.recent.unshift(`${m.a} vs ${m.b}`);state.recent=state.recent.slice(0,6);persist();toast(m.status==="live"?`Opening live broadcast: ${m.id}`:`Following ${m.id}`);renderProfile()}))}
$("#liveSearch").addEventListener("input",renderLive);$("#liveGameFilter").addEventListener("change",renderLive);$("#tournamentSearch").addEventListener("input",renderTournaments);$("#teamSearch").addEventListener("input",renderTeams);$("#teamGameFilter").addEventListener("change",renderTeams);
$$("[data-status]").forEach(b=>b.addEventListener("click",()=>{$$("[data-status]").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.tournamentStatus=b.dataset.status;renderTournaments()}));
$$(".schedule-tab").forEach(b=>b.addEventListener("click",()=>{$$(".schedule-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.scheduleDay=b.dataset.day;renderSchedule()}));
$("#saveProfile").addEventListener("click",()=>{state.name=$("#nameInput").value.trim()||"Spectator";state.email=$("#emailInput").value.trim()||"spectator@arenaelite.gg";state.notifications=$("#notificationToggle").checked;persist();renderProfile();toast("Spectator preferences saved")});
$("#notificationToggle").addEventListener("change",()=>{state.notifications=$("#notificationToggle").checked;persist();toast(state.notifications?"Match notifications enabled":"Match notifications disabled")});
$("#notifyBtn").addEventListener("click",()=>toast(state.notifications?"You have 3 new spectator updates":"Notifications are disabled"));
$("#profileQuick").addEventListener("click",()=>navigate("profile"));
$("#logoutBtn").addEventListener("click",()=>{localStorage.removeItem("arenaElite.currentUser");toast("Spectator session ended");setTimeout(()=>location.href="index.html",700)});

function simulateLive(){
  DATA.matches.filter(m=>m.status==="live").forEach(m=>{m.viewers+=Math.floor(Math.random()*41)-20;m.viewers=Math.max(100,m.viewers);if(Math.random()>.65)m.progress=Math.min(98,m.progress+1)});
  const total=DATA.matches.filter(m=>m.status==="live").reduce((a,m)=>a+m.viewers,0);
  $("#heroViewers").textContent=total.toLocaleString();$("#statViewers").textContent=(total/1000).toFixed(1)+"K";renderHome();
}
renderHome();renderLive();renderTournaments();renderLeaderboard();renderTeams();renderAnnouncements();renderSchedule();renderProfile();
setInterval(simulateLive,5000);
