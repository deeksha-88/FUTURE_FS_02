import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeads, seedLeads, Lead, LeadStatus } from "@/lib/leads";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, ArrowUpDown } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    seedLeads();
    setLeads(getLeads());
  }, []);

  let filtered = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (sortAsc) filtered = [...filtered].reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">{filtered.length} leads found</p>
        </div>
        <Link to="/leads/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Add Lead</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => setSortAsc(!sortAsc)}>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Source</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Link to={`/leads/${lead.id}`} className="font-medium text-primary hover:underline">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{lead.email}</td>
                    <td className="p-4 text-sm hidden md:table-cell">{lead.source}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium status-${lead.status}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No leads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
