import {seed} from './data'
const KEY='arenaEliteReview2Data'
export function loadData(){try{return {...seed,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return seed}}
export function saveData(data){localStorage.setItem(KEY,JSON.stringify(data))}
export function logAction(data,action,actor='Admin'){return {...data,audit:[{id:Date.now(),action,actor,at:new Date().toLocaleString()},...(data.audit||[])]}}
