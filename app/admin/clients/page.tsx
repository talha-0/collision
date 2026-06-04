"use client";

import { useEffect, useState } from "react";
import { Plus, Search, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Client = {
  id: string;
  status: string;
  company: string | null;
  phone: string | null;
  startDate: string;
  user: { id: string; name: string; email: string; createdAt: string };
  branch: { id: string; name: string; city: string };
  seats: Array<{ id: string; label: string; type: string }>;
  invoices: Array<{ id: string; amount: number; status: string }>;
};

type Branch = { id: string; name: string; city: string };

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-700 dark:text-green-400",
  INACTIVE: "bg-muted text-muted-foreground",
  SUSPENDED: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", branchId: "", company: "", phone: "" });

  const load = () =>
    fetch("/api/clients").then((r) => r.json()).then(setClients);

  useEffect(() => {
    load();
    fetch("/api/branches").then((r) => r.json()).then(setBranches);
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.user.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { toast.error("Failed to create client"); return; }
    toast.success("Client created");
    setOpen(false);
    setForm({ name: "", email: "", password: "", branchId: "", company: "", phone: "" });
    load();
  };

  const pendingAmount = (c: Client) =>
    c.invoices.filter((i) => i.status === "PENDING" || i.status === "OVERDUE")
      .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground text-sm">{clients.length} total members</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" />Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Client</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Password *</Label>
                  <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Branch *</Label>
                  <Select value={form.branchId} onValueChange={(v) => setForm({ ...form, branchId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name} – {b.city}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Client</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {c.user.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <div className="font-semibold">{c.user.name}</div>
                    <div className="text-sm text-muted-foreground">{c.user.email}</div>
                    {c.company && <div className="text-xs text-muted-foreground">{c.company}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline">{c.branch.name} · {c.branch.city}</Badge>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[c.status]}`}>
                    {c.status === "ACTIVE" ? <UserCheck className="w-3 h-3 inline mr-1" /> : <UserX className="w-3 h-3 inline mr-1" />}
                    {c.status}
                  </span>
                  {pendingAmount(c) > 0 && (
                    <Badge variant="destructive">₨{pendingAmount(c).toLocaleString()} due</Badge>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
                <span>{c.seats.length} seat{c.seats.length !== 1 ? "s" : ""}</span>
                <span>{c.invoices.length} invoice{c.invoices.length !== 1 ? "s" : ""}</span>
                <span>Since {new Date(c.startDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No clients found.</p>
        )}
      </div>
    </div>
  );
}
