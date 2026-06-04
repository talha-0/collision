"use client";

import { useEffect, useState } from "react";
import { Users, FileText, DollarSign, MapPin, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DashboardData = {
  totalClients: number;
  activeClients: number;
  pendingInvoices: { count: number; total: number };
  overdueInvoices: { count: number; total: number };
  seats: { total: number; occupied: number; available: number };
  recentPayments: Array<{
    id: string;
    amount: number;
    paidAt: string;
    method: string;
    invoice: { client: { user: { name: string } } };
  }>;
  branches: Array<{
    id: string;
    name: string;
    city: string;
    _count: { clients: number; seats: number };
    expenses: Array<{ amount: number }>;
  }>;
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="p-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const fmt = (n: number) => `₨${n.toLocaleString()}`;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of Collision coworking</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.activeClients}</div>
            <p className="text-xs text-muted-foreground mt-1">{data.totalClients} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.pendingInvoices.count}</div>
            <p className="text-xs text-muted-foreground mt-1">{fmt(data.pendingInvoices.total)} due</p>
          </CardContent>
        </Card>

        <Card className={data.overdueInvoices.count > 0 ? "border-destructive/50" : ""}>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{data.overdueInvoices.count}</div>
            <p className="text-xs text-muted-foreground mt-1">{fmt(data.overdueInvoices.total)} overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Seats</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.seats.occupied}</div>
            <p className="text-xs text-muted-foreground mt-1">of {data.seats.total} occupied</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Branches */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Branches
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.branches.map((b) => {
              const totalExpenses = b.expenses.reduce((s, e) => s + e.amount, 0);
              return (
                <div key={b.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.city} · {b._count.clients} clients · {b._count.seats} seats</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-destructive">{fmt(totalExpenses)}</div>
                    <div className="text-xs text-muted-foreground">expenses</div>
                  </div>
                </div>
              );
            })}
            {data.branches.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No branches yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-medium text-sm">{p.invoice.client.user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(p.paidAt).toLocaleDateString()} · {p.method}
                  </div>
                </div>
                <Badge variant="secondary">{fmt(p.amount)}</Badge>
              </div>
            ))}
            {data.recentPayments.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">No payments yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
