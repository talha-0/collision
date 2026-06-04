"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";
import { FileText, Clock, MapPin, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type AttendanceRecord = { id: string; checkIn: string; checkOut: string | null; date: string };
type Invoice = { id: string; amount: number; status: string; dueDate: string; description: string | null };

export default function PortalPage() {
  const { data: session } = useSession();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAttendance = async () => {
    const res = await fetch("/api/attendance");
    const data = await res.json();
    if (Array.isArray(data)) {
      setAttendance(data);
      setCheckedIn(data.some((r: AttendanceRecord) => !r.checkOut));
    }
  };

  useEffect(() => {
    loadAttendance();
    fetch("/api/portal/invoices").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setInvoices(d); });
  }, []);

  const handleAttendance = async () => {
    setLoading(true);
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: checkedIn ? "checkout" : "checkin" }),
    });
    setLoading(false);
    if (!res.ok) { toast.error("Failed"); return; }
    toast.success(checkedIn ? "Checked out. See you soon!" : "Checked in. Welcome!");
    loadAttendance();
  };

  const pendingAmount = invoices
    .filter((i) => i.status === "PENDING" || i.status === "OVERDUE")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your member dashboard</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CalendarCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={checkedIn ? "default" : "secondary"} className="text-sm">
              {checkedIn ? "Checked In" : "Not In"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Visits This Month</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendance.length}</div>
          </CardContent>
        </Card>

        <Card className={pendingAmount > 0 ? "border-destructive/40" : ""}>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${pendingAmount > 0 ? "text-destructive" : ""}`}>
              ₨{pendingAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Check in/out */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold">{checkedIn ? "You're currently checked in" : "Not checked in"}</div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {checkedIn ? "Click to check out when you leave." : "Click to check in and start your session."}
            </div>
          </div>
          <Button
            onClick={handleAttendance}
            disabled={loading}
            variant={checkedIn ? "outline" : "default"}
            className="shrink-0"
          >
            {checkedIn ? "Check Out" : "Check In"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent invoices */}
      <div>
        <h2 className="font-semibold mb-3">Recent Invoices</h2>
        <div className="grid gap-2">
          {invoices.slice(0, 5).map((inv) => (
            <Card key={inv.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-sm">{inv.description || "Monthly invoice"}</div>
                  <div className="text-xs text-muted-foreground">Due {new Date(inv.dueDate).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">₨{inv.amount.toLocaleString()}</span>
                  <Badge variant={inv.status === "PAID" ? "secondary" : inv.status === "OVERDUE" ? "destructive" : "outline"}>
                    {inv.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {invoices.length === 0 && (
            <p className="text-muted-foreground text-sm py-4 text-center">No invoices yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
