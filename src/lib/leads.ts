export type LeadStatus = "new" | "contacted" | "converted";

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  notes: Note[];
  followUpDate: string | null;
}

const LEADS_KEY = "crm_leads";

function getAll(): Lead[] {
  return JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
}

function saveAll(leads: Lead[]) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export function getLeads(): Lead[] {
  return getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLead(id: string): Lead | undefined {
  return getAll().find(l => l.id === id);
}

export function createLead(data: { name: string; email: string; source: string }): Lead {
  const leads = getAll();
  const lead: Lead = {
    id: crypto.randomUUID(),
    ...data,
    status: "new",
    createdAt: new Date().toISOString(),
    notes: [],
    followUpDate: null,
  };
  leads.push(lead);
  saveAll(leads);
  return lead;
}

export function updateLead(id: string, updates: Partial<Pick<Lead, "status" | "followUpDate">>): Lead {
  const leads = getAll();
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) throw new Error("Lead not found");
  leads[idx] = { ...leads[idx], ...updates };
  saveAll(leads);
  return leads[idx];
}

export function addNote(leadId: string, text: string): Note {
  const leads = getAll();
  const idx = leads.findIndex(l => l.id === leadId);
  if (idx === -1) throw new Error("Lead not found");
  const note: Note = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() };
  leads[idx].notes.push(note);
  saveAll(leads);
  return note;
}

export function seedLeads() {
  if (getAll().length > 0) return;
  const sources = ["Website", "LinkedIn", "Referral", "Google Ads", "Cold Email"];
  const statuses: LeadStatus[] = ["new", "contacted", "converted"];
  const names = ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "James Wilson", "Priya Patel", "David Kim", "Lisa Thompson", "Alex Murphy"];
  const leads: Lead[] = names.map((name, i) => ({
    id: crypto.randomUUID(),
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
    source: sources[i % sources.length],
    status: statuses[i % statuses.length],
    createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    notes: i < 3 ? [{ id: crypto.randomUUID(), text: "Initial contact made via " + sources[i % sources.length], createdAt: new Date(Date.now() - i * 86400000).toISOString() }] : [],
    followUpDate: i < 4 ? new Date(Date.now() + (i + 1) * 86400000 * 3).toISOString().split("T")[0] : null,
  }));
  saveAll(leads);
}
