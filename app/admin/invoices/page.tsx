"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Invoice = {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
  description: string | null;
  createdAt: string;
  client: {
    user: { name: string; email: string };
    branch: { name: string };
  };
  payments: Array<{ amount: number }>;
};

type Client = { id: string; user: { name: string; email: string } };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  PAID: "bg-green-500/10 text-green-700 dark:text-green-400",
  OVERDUE: "bg-red-500/10 text-red-700 dark:text-red-400",
  CANCELLED: "bg-muted text-muted-foreground",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [form, setForm] = useState({ clientId: "", amount: "", dueDate: "", description: "" });

  const load = () => fetch("/api/invoices").then((r) => r.json()).then(setInvoices);

  useEffect(() => {
    load();
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }, []);

  const filtered = filter === "ALL" ? invoices : invoices.filter((i) => i.status === filter);
  const totalDue = invoices.filter((i) => ["PENDING", "OVERDUE"].includes(i.status)).reduce((s, i) => s + i.amount, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { toast.error("Failed to create invoice"); return; }
    toast.success("Invoice created");
    setOpen(false);
    load();
  };

  const markPaid = async (id: string, amount: number) => {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId: id, amount, method: "CASH" }),
    });
    if (!res.ok) { toast.error("Failed"); return; }
    toast.success("Marked as paid");
    load();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground text-sm">₨{totalDue.toLocaleString()} total outstanding</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" />New Invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Client *</Label>
                <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.user.name} ({c.user.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Amount (PKR) *</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Due Date *</Label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <Button type="submit" className="w-full">Create Invoice</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "OVERDUE", "PAID", "CANCELLED"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s}
          </Button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((inv) => {
          const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
          const isPending = inv.status === "PENDING" || inv.status === "OVERDUE";
          return (
            <Card key={inv.id}>
              <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold">{inv.client.user.name}</div>
                  <div className="text-sm text-muted-foreground">{inv.client.branch.name}</div>
                  {inv.description && <div className="text-xs text-muted-foreground mt-0.5">{inv.description}</div>}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="text-right">
                    <div className="font-semibold">₨{inv.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Due {new Date(inv.dueDate).toLocaleDateString()}</div>
                    {paid > 0 && <div className="text-xs text-green-600">₨{paid.toLocaleString()} paid</div>}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[inv.status]}`}>{inv.status}</span>
                  {isPending && (
                    <Button size="sm" variant="outline" onClick={() => markPaid(inv.id, inv.amount)}>
                      Mark Paid
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No invoices found.</p>
        )}
      </div>
    </div>
  );
}
