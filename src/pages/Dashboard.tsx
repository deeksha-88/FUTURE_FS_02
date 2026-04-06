import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getLeads, seedLeads, Lead } from "@/lib/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Phone, CheckCircle, ArrowRight } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend,
} from "recharts";

const STATUS_COLORS = {
  new: "hsl(220, 70%, 50%)",
  contacted: "hsl(38, 92%, 50%)",
  converted: "hsl(142, 71%, 45%)",
};

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

  const pieData = useMemo(() => [
    { name: "New", value: newCount, color: STATUS_COLORS.new },
    { name: "Contacted", value: contacted, color: STATUS_COLORS.contacted },
    { name: "Converted", value: converted, color: STATUS_COLORS.converted },
  ], [newCount, contacted, converted]);

  const sourceData = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.source] = (map[l.source] || 0) + 1; });
    return Object.entries(map).map(([source, count]) => ({ source, count }));
  }, [leads]);

  const timelineData = useMemo(() => {
    const map: Record<string, { date: string; new: number; contacted: number; converted: number }> = {};
    leads.forEach(l => {
      const date = new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!map[date]) map[date] = { date, new: 0, contacted: 0, converted: 0 };
      map[date][l.status]++;
    });
    return Object.values(map).reverse();
  }, [leads]);

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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(220, 70%, 50%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Lead Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="new" stackId="1" stroke={STATUS_COLORS.new} fill={STATUS_COLORS.new} fillOpacity={0.4} />
              <Area type="monotone" dataKey="contacted" stackId="1" stroke={STATUS_COLORS.contacted} fill={STATUS_COLORS.contacted} fillOpacity={0.4} />
              <Area type="monotone" dataKey="converted" stackId="1" stroke={STATUS_COLORS.converted} fill={STATUS_COLORS.converted} fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
