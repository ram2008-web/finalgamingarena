import React,{useMemo,useState} from 'react'
import {Search,Plus,Check,Pause,Trash2,Download,RefreshCw} from 'lucide-react'
export default function DataModule({title,rows=[],columns=[],onAction,addLabel,description,actions=[]}){
 const [query,setQuery]=useState('')
 const filtered=useMemo(()=>rows.filter(r=>JSON.stringify(r).toLowerCase().includes(query.toLowerCase())),[rows,query])
 return <section className="module">
  <div className="module-head"><div><div className="eyebrow">ARENA ELITE / {title.toUpperCase()}</div><h1>{title}</h1><p>{description||'Review and manage this area of the competitive platform.'}</p></div>{addLabel&&<button className="btn primary" onClick={()=>onAction?.('add')}><Plus size={16}/>{addLabel}</button>}</div>
  <div className="toolbar"><div className="search"><Search size={16}/><input placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={e=>setQuery(e.target.value)}/></div><span className="muted">{filtered.length} records</span></div>
  <div className="table-wrap"><table><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}{actions.length>0&&<th>Actions</th>}</tr></thead><tbody>{filtered.map((row,i)=><tr key={row.id??i}>{columns.map(c=><td key={c.key}>{c.render?c.render(row):row[c.key]??'—'}</td>)}{actions.length>0&&<td><div className="row-actions">{actions.map(a=><button title={a.label} key={a.key} onClick={()=>onAction?.(a.key,row)}>{a.icon||a.label}</button>)}</div></td>}</tr>)}</tbody></table>{filtered.length===0&&<div className="empty">No matching records.</div>}</div>
 </section>
}
export function Status({value}){return <span className={'status '+String(value||'').toLowerCase().replaceAll(' ','-')}>{value||'—'}</span>}
