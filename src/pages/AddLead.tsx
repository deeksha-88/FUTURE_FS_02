import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLead } from "@/lib/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const sources = ["Website", "LinkedIn", "Referral", "Google Ads", "Cold Email", "Other"];

export default function AddLeadPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !source) {
      setError("All fields are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email address");
      return;
    }
    createLead({ name: name.trim(), email: email.trim(), source });
    navigate("/leads");
  };

  return (
    <div className="max-w-lg animate-fade-in space-y-6">
      <Button variant="ghost" onClick={() => navigate("/leads")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </Button>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Add New Lead</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Add Lead</Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
