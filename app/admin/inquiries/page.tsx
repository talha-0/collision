"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: string;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  CONTACTED: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  CONVERTED: "bg-green-500/10 text-green-700 dark:text-green-400",
  CLOSED: "bg-muted text-muted-foreground",
};

const nextStatus: Record<string, string> = {
  NEW: "CONTACTED",
  CONTACTED: "CONVERTED",
  CONVERTED: "CLOSED",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState("ALL");

  const load = () => fetch("/api/contacts").then((r) => r.json()).then(setInquiries);
  useEffect(() => { load(); }, []);

  const filtered = filter === "ALL" ? inquiries : inquiries.filter((i) => i.status === filter);

  const advance = async (id: string, current: string) => {
    const next = nextStatus[current];
    if (!next) return;
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) { toast.error("Failed to update"); return; }
    toast.success(`Marked as ${next}`);
    load();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground text-sm">{inquiries.filter((i) => i.status === "NEW").length} new inquiries</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "NEW", "CONTACTED", "CONVERTED", "CLOSED"].map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>
            {s}
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((inq) => (
          <Card key={inq.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{inq.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[inq.status]}`}>{inq.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                    <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-foreground">
                      <Mail className="w-3.5 h-3.5" /> {inq.email}
                    </a>
                    {inq.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {inq.phone}
                      </span>
                    )}
                    {inq.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {inq.company}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">{inq.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(inq.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {nextStatus[inq.status] && (
                    <Button size="sm" variant="outline" onClick={() => advance(inq.id, inq.status)}>
                      Mark {nextStatus[inq.status]}
                    </Button>
                  )}
                  <a href={`mailto:${inq.email}`}>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <Mail className="w-3.5 h-3.5" /> Reply
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No inquiries found.</p>
        )}
      </div>
    </div>
  );
}
