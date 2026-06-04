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

type Expense = {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  date: string;
  branch: { name: string; city: string };
};

type Branch = { id: string; name: string; city: string };

const categories = ["RENT", "UTILITIES", "SALARIES", "MAINTENANCE", "OTHER"];

const catColor: Record<string, string> = {
  RENT: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  UTILITIES: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  SALARIES: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  MAINTENANCE: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  OTHER: "bg-muted text-muted-foreground",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [open, setOpen] = useState(false);
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [form, setForm] = useState({ branchId: "", category: "", amount: "", description: "", date: "" });

  const load = () => fetch("/api/expenses").then((r) => r.json()).then(setExpenses);

  useEffect(() => {
    load();
    fetch("/api/branches").then((r) => r.json()).then(setBranches);
  }, []);

  const filtered = branchFilter === "ALL"
    ? expenses
    : expenses.filter((e) => e.branch.name === branchFilter);

  const totalByBranch = branches.map((b) => ({
    ...b,
    total: expenses.filter((e) => e.branch.name === b.name).reduce((s, e) => s + e.amount, 0),
  }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) { toast.error("Failed to add expense"); return; }
    toast.success("Expense added");
    setOpen(false);
    load();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-muted-foreground text-sm">
            Total: ₨{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" />Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Branch *</Label>
                  <Select value={form.branchId} onValueChange={(v) => setForm({ ...form, branchId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Amount (PKR) *</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <Button type="submit" className="w-full">Add Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Branch summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {totalByBranch.map((b) => (
          <Card
            key={b.id}
            className={`cursor-pointer transition-colors ${branchFilter === b.name ? "border-primary" : ""}`}
            onClick={() => setBranchFilter(branchFilter === b.name ? "ALL" : b.name)}
          >
            <CardContent className="p-4">
              <div className="font-medium text-sm">{b.name}</div>
              <div className="text-xs text-muted-foreground">{b.city}</div>
              <div className="text-xl font-bold mt-2">₨{b.total.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((exp) => (
          <Card key={exp.id}>
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor[exp.category]}`}>
                    {exp.category}
                  </span>
                  <Badge variant="outline" className="text-xs">{exp.branch.name}</Badge>
                </div>
                {exp.description && <div className="text-sm text-muted-foreground">{exp.description}</div>}
                <div className="text-xs text-muted-foreground mt-1">{new Date(exp.date).toLocaleDateString()}</div>
              </div>
              <div className="font-semibold text-lg">₨{exp.amount.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No expenses found.</p>
        )}
      </div>
    </div>
  );
}
