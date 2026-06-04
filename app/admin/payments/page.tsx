"use client";

import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Payment = {
  id: string;
  amount: number;
  method: string;
  paidAt: string;
  notes: string | null;
  invoice: {
    description: string | null;
    client: {
      user: { name: string; email: string };
      branch: { name: string };
    };
  };
};

const methodColors: Record<string, string> = {
  CASH: "bg-green-500/10 text-green-700 dark:text-green-400",
  BANK: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  ONLINE: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetch("/api/payments").then((r) => r.json()).then(setPayments);
  }, []);

  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground text-sm">
          ₨{total.toLocaleString()} total collected · {payments.length} payments
        </p>
      </div>

      <div className="grid gap-3">
        {payments.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{p.invoice.client.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.invoice.client.branch.name}
                    {p.invoice.description && ` · ${p.invoice.description}`}
                  </div>
                  {p.notes && <div className="text-xs text-muted-foreground">{p.notes}</div>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-bold text-lg">₨{p.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{new Date(p.paidAt).toLocaleDateString()}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${methodColors[p.method]}`}>{p.method}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {payments.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No payments recorded yet.</p>
        )}
      </div>
    </div>
  );
}
