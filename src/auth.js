const USERS_KEY = 'arenaEliteUsersV2'
const SESSION_KEY = 'arenaEliteSessionV2'

export const demoUsers = [
  { id: 'demo-admin', name: 'Arena Admin', email: 'admin@arenaelite.gg', password: 'Admin@123', role: 'Admin' },
  { id: 'demo-player', name: 'Demo Player', email: 'user@arenaelite.gg', password: 'User@123', role: 'User' }
]

function normalizedUser(user) {
  return { ...user, id: user.id || `account-${user.email.toLowerCase()}`, contact: user.contact || '' }
}

export function getUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem(USERS_KEY))
    return (Array.isArray(stored) ? stored : demoUsers).map(normalizedUser)
  } catch {
    return demoUsers.map(normalizedUser)
  }
}

function establishSession(user) {
  const safe = { id: user.id, name: user.name, email: user.email, contact: user.contact || '', role: user.role }
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
  return safe
}

export function signIn(identifier, password, requiredRole) {
  const normalizedIdentifier = identifier.trim().toLowerCase()
  const user = getUsers().find(account =>
    (account.email.toLowerCase() === normalizedIdentifier ||
      (requiredRole === 'Organizer' && account.username?.toLowerCase() === normalizedIdentifier)) &&
    account.password === password &&
    (!requiredRole || account.role === requiredRole)
  )
  if (!user) {
    throw new Error(requiredRole === 'Organizer'
      ? 'Organizer account not found. Check your credentials or create an Organizer account.'
      : 'Email or password is incorrect.')
  }
  return establishSession(user)
}

export function signUp(name, email, password, role = 'User', username = '') {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = username.trim().toLowerCase()
  const users = getUsers()
  if (users.some(user => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }
  if (normalizedUsername && users.some(user => user.username?.toLowerCase() === normalizedUsername)) {
    throw new Error('This username is already in use.')
  }
  if (normalizedUsername && !/^[a-z0-9._-]{3,24}$/.test(normalizedUsername)) {
    throw new Error('Username must be 3 to 24 characters and use letters, numbers, dots, underscores, or hyphens.')
  }
  if (!name.trim()) throw new Error('Enter your name.')
  if (password.length < 6) throw new Error('Password must be at least 6 characters.')
  const safeRole = role === 'Organizer' ? 'Organizer' : 'User'
  const user = {
    id: `${safeRole.toLowerCase()}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
    name: name.trim(),
    email: email.trim(),
    ...(normalizedUsername ? { username: normalizedUsername } : {}),
    password,
    role: safeRole,
    contact: ''
  }
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return establishSession(user)
}

export function updateProfile(userId, changes) {
  const users = getUsers()
  const index = users.findIndex(user => user.id === userId)
  if (index < 0) throw new Error('Account not found.')
  const name = changes.name.trim()
  if (!name) throw new Error('Name is required.')
  users[index] = { ...users[index], name, contact: changes.contact.trim() }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return establishSession(users[index])
}

export function updatePassword(userId, currentPassword, newPassword) {
  const users = getUsers()
  const index = users.findIndex(user => user.id === userId)
  if (index < 0 || users[index].password !== currentPassword) throw new Error('Current password is incorrect.')
  if (newPassword.length < 6) throw new Error('New password must be at least 6 characters.')
  users[index] = { ...users[index], password: newPassword }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function currentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (!session?.email || !session?.role) return null
    const account = getUsers().find(user => user.email.toLowerCase() === session.email.toLowerCase())
    return account ? { ...session, id: account.id, name: account.name, role: account.role, contact: account.contact || '' } : null
  } catch {
    return null
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY)
}
