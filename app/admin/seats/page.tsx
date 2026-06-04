"use client";

import { useEffect, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Seat = {
  id: string;
  label: string;
  type: string;
  status: string;
  pricePerMonth: number;
  branch: { name: string; city: string };
  client: { user: { name: string } } | null;
};

type Branch = { id: string; name: string; city: string };

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-green-500/10 text-green-700 dark:text-green-400",
  OCCUPIED: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  RESERVED: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
};

export default function SeatsPage() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [open, setOpen] = useState(false);
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [form, setForm] = useState({ label: "", branchId: "", type: "DEDICATED", pricePerMonth: "" });

  const load = () => fetch("/api/seats").then((r) => r.json()).then(setSeats);

  useEffect(() => {
    load();
    fetch("/api/branches").then((r) => r.json()).then(setBranches);
  }, []);

  const filtered = branchFilter === "ALL" ? seats : seats.filter((s) => s.branch.name === branchFilter);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/seats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, pricePerMonth: parseFloat(form.pricePerMonth) || 0 }),
    });
    if (!res.ok) { toast.error("Failed to create seat"); return; }
    toast.success("Seat created");
    setOpen(false);
    load();
  };

  const occupied = seats.filter((s) => s.status === "OCCUPIED").length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Seats</h1>
          <p className="text-muted-foreground text-sm">
            {occupied}/{seats.length} occupied · {seats.length - occupied} available
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" />Add Seat</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Seat</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Label *</Label>
                  <Input placeholder="A-01" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Branch *</Label>
                  <Select value={form.branchId} onValueChange={(v) => setForm({ ...form, branchId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEDICATED">Dedicated Desk</SelectItem>
                      <SelectItem value="HOT_DESK">Hot Desk</SelectItem>
                      <SelectItem value="PRIVATE_OFFICE">Private Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Monthly Rate (PKR)</Label>
                  <Input type="number" value={form.pricePerMonth} onChange={(e) => setForm({ ...form, pricePerMonth: e.target.value })} />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Seat</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant={branchFilter === "ALL" ? "default" : "outline"} size="sm" onClick={() => setBranchFilter("ALL")}>
          All Branches
        </Button>
        {branches.map((b) => (
          <Button key={b.id} variant={branchFilter === b.name ? "default" : "outline"} size="sm" onClick={() => setBranchFilter(b.name)}>
            {b.name}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((seat) => (
          <Card key={seat.id} className={`transition-colors ${seat.status === "AVAILABLE" ? "hover:border-green-500/40" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{seat.label}</div>
                    <div className="text-xs text-muted-foreground">{seat.branch.name}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[seat.status]}`}>{seat.status}</span>
              </div>
              <Badge variant="outline" className="text-xs mb-2">{seat.type.replace("_", " ")}</Badge>
              {seat.client && (
                <div className="text-xs text-muted-foreground mt-1">👤 {seat.client.user.name}</div>
              )}
              {seat.pricePerMonth > 0 && (
                <div className="text-sm font-medium mt-2">₨{seat.pricePerMonth.toLocaleString()}/mo</div>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12 col-span-full">No seats found.</p>
        )}
      </div>
    </div>
  );
}
