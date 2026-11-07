import React from 'react'

export function PageHeader({ title, description, action }) {
  return <div className="module-head"><div><div className="eyebrow">ORGANIZER WORKSPACE</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

export function Status({ value }) {
  return <span className={`status ${String(value || '').toLowerCase().replaceAll(' ', '-')}`}>{value || '—'}</span>
}

export function Empty({ children = 'No matching records.' }) {
  return <div className="empty">{children}</div>
}

export function Table({ columns, rows, rowKey = 'id', empty = 'No matching records.' }) {
  return <div className="table-wrap">
    <table><thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={row[rowKey] ?? index}>
        {columns.map(column => <td key={column.key}>{column.render ? column.render(row) : row[column.key] ?? '—'}</td>)}
      </tr>)}</tbody>
    </table>
    {!rows.length && <Empty>{empty}</Empty>}
  </div>
}

export function SearchFilter({ query, onQuery, placeholder, filter, onFilter, options }) {
  return <div className="toolbar organizer-toolbar">
    <div className="search"><input aria-label={placeholder} placeholder={placeholder} value={query} onChange={event => onQuery(event.target.value)}/></div>
    {filter !== undefined && <select aria-label="Filter by status" value={filter} onChange={event => onFilter(event.target.value)}>
      {options.map(option => <option key={option}>{option}</option>)}
    </select>}
  </div>
}
