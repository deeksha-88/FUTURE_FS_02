export interface User {
  id: string;
  email: string;
}

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
}

const USERS_KEY = "crm_users";
const SESSION_KEY = "crm_session";

function getUsers(): StoredUser[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function signup(email: string, password: string): Promise<User> {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error("User already exists");
  }
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  users.push({ id, email, passwordHash });
  saveUsers(users);
  const user = { id, email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function login(email: string, password: string): Promise<User> {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("Invalid credentials");
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) throw new Error("Invalid credentials");
  const session = { id: user.id, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}
