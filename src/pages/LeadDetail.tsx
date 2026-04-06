import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLead, updateLead, addNote, Lead } from "@/lib/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, MessageSquare, Send } from "lucide-react";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (id) {
      const l = getLead(id);
      if (l) setLead(l);
      else navigate("/leads");
    }
  }, [id]);

  if (!lead) return null;

  const handleStatusChange = (status: string) => {
    const updated = updateLead(lead.id, { status: status as Lead["status"] });
    setLead(updated);
  };

  const handleFollowUp = (date: string) => {
    const updated = updateLead(lead.id, { followUpDate: date || null });
    setLead(updated);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addNote(lead.id, noteText.trim());
    setNoteText("");
    setLead(getLead(lead.id)!);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <Button variant="ghost" onClick={() => navigate("/leads")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </Button>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">{lead.name}</h2>
        <p className="text-muted-foreground">{lead.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Source</Label>
              <p className="font-medium">{lead.source}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Created</Label>
              <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Follow-up Date</Label>
              <Input
                type="date"
                value={lead.followUpDate || ""}
                onChange={e => handleFollowUp(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium text-muted-foreground">Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                className="min-h-[60px]"
              />
              <Button size="icon" onClick={handleAddNote} disabled={!noteText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {lead.notes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
              )}
              {[...lead.notes].reverse().map(note => (
                <div key={note.id} className="relative pl-4 border-l-2 border-primary/30">
                  <p className="text-sm">{note.text}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
