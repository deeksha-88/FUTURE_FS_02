import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeads, seedLeads, Lead } from "@/lib/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Phone, CheckCircle, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    seedLeads();
    setLeads(getLeads());
  }, []);

  const total = leads.length;
  const newCount = leads.filter(l => l.status === "new").length;
  const contacted = leads.filter(l => l.status === "contacted").length;
  const converted = leads.filter(l => l.status === "converted").length;

  const stats = [
    { label: "Total Leads", value: total, icon: Users, color: "text-primary" },
    { label: "New Leads", value: newCount, icon: UserPlus, color: "text-primary" },
    { label: "Contacted", value: contacted, icon: Phone, color: "text-warning" },
    { label: "Converted", value: converted, icon: CheckCircle, color: "text-success" },
  ];

  const recent = leads.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your lead pipeline</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Leads</CardTitle>
          <Link to="/leads" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recent.map((lead) => (
              <Link
                key={lead.id}
                to={`/leads/${lead.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium status-${lead.status}`}>
                    {lead.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
