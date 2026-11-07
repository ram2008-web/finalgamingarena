export const seed = {
  tournaments:[
    {id:1,name:'Valorant Champions Cup',game:'Valorant',status:'Live',prize:'₹12,00,000',teams:64},
    {id:2,name:'CS2 Masters',game:'CS2',status:'Upcoming',prize:'₹8,50,000',teams:32},
    {id:3,name:'PUBG Battleground Series',game:'PUBG',status:'Upcoming',prize:'₹6,00,000',teams:48},
    {id:4,name:'FIFA Pro League',game:'FIFA',status:'Upcoming',prize:'₹3,00,000',teams:128},
    {id:5,name:'Free Fire Elite League',game:'Free Fire',status:'Completed',prize:'₹5,00,000',teams:40}
  ],
  matches:[
    {id:'M-114',game:'Valorant',tournament:'Valorant Champions Cup',a:'Shadow Titans',b:'Phoenix Squad',score:'13 - 10',status:'Live'},
    {id:'M-115',game:'CS2',tournament:'CS2 Masters',a:'Night Wolves',b:'Apex Legends',score:'8 - 6',status:'Live'},
    {id:'M-116',game:'PUBG',tournament:'PUBG Battleground Series',a:'Titan Force',b:'Cyber Knights',score:'—',status:'Upcoming'}
  ],
  teams:[
    {id:1,name:'Shadow Titans',game:'Valorant',players:5,matches:86,wins:58,points:2615,status:'Active'},
    {id:2,name:'Storm Breakers',game:'Free Fire',players:5,matches:92,wins:71,points:2840,status:'Active'},
    {id:3,name:'Phoenix Squad',game:'Valorant',players:5,matches:88,wins:56,points:2490,status:'Active'},
    {id:4,name:'Titan Force',game:'PUBG',players:5,matches:79,wins:49,points:2310,status:'Active'}
  ],
  players:[
    {id:1,name:'Jae Kim',game:'Valorant',team:'Nightfall Vanguard',status:'Active'},
    {id:2,name:'Mara Reyes',game:'CS2',team:'Nightfall Vanguard',status:'Active'},
    {id:3,name:'Dev Thakur',game:'PUBG',team:'Titan Force',status:'Active'}
  ],
  registrations:[{id:1,name:'Rising Phoenix',event:'CS2 Masters',status:'Pending'},{id:2,name:'Nova Core',event:'PUBG Battleground Series',status:'Pending'}],
  posts:[{id:1,author:'Jae Kim',body:'Looking for a support player for our next tournament.',status:'Reported'},{id:2,author:'Mara Reyes',body:'GGs on the weekend matches!',status:'Approved'}],
  reports:[{id:1,subject:'Suspected score manipulation',status:'Open'},{id:2,subject:'Abusive chat report',status:'Open'}],
  announcements:[{id:1,title:'Grand Finals starting soon',body:'The Valorant Champions Cup Grand Finals are approaching.'},{id:2,title:'Schedule update',body:'The PUBG evening match has moved to 7:00 PM.'}],
  schedule:[{id:1,time:'10:00 AM',teamA:'Shadow Titans',teamB:'Phoenix Squad',game:'Valorant',status:'Live'},{id:2,time:'12:30 PM',teamA:'Night Wolves',teamB:'Apex Legends',game:'CS2',status:'Live'},{id:3,time:'3:00 PM',teamA:'Titan Force',teamB:'Cyber Knights',game:'PUBG',status:'Upcoming'}],
  audit:[{id:1,action:'Portal initialized',actor:'System',at:new Date().toLocaleString()}]
}
export const adminModules=['Dashboard','Players','Teams','Tournaments','Registrations','Matches','Leaderboard','Community Moderation','Reports & Safety','Announcements','Analytics','Audit Logs','Settings']
export const publicModules=['Home','Live Matches','Tournaments','Matches','Leaderboards','Teams','Players','Community','Announcements','Schedule','Profile','Review 2 Checklist']
