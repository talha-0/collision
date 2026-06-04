"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Invoice = { id: string; amount: number; status: string; dueDate: string; description: string | null; createdAt: string };

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  PAID: "bg-green-500/10 text-green-700 dark:text-green-400",
  OVERDUE: "bg-red-500/10 text-red-700 dark:text-red-400",
  CANCELLED: "bg-muted text-muted-foreground",
};

export default function PortalInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch("/api/portal/invoices").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setInvoices(d); });
  }, []);

  const pendingTotal = invoices.filter((i) => ["PENDING", "OVERDUE"].includes(i.status)).reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Invoices</h1>
        {pendingTotal > 0 && (
          <p className="text-destructive text-sm mt-1">₨{pendingTotal.toLocaleString()} outstanding</p>
        )}
      </div>

      <div className="grid gap-3">
        {invoices.map((inv) => (
          <Card key={inv.id}>
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">{inv.description || "Monthly invoice"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Issued {new Date(inv.createdAt).toLocaleDateString()} · Due {new Date(inv.dueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">₨{inv.amount.toLocaleString()}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[inv.status]}`}>
                  {inv.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {invoices.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No invoices yet.</p>
        )}
      </div>
    </div>
  );
}
