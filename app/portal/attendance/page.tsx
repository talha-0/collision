"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Record = { id: string; checkIn: string; checkOut: string | null; date: string };

function duration(ci: string, co: string | null) {
  if (!co) return "Active";
  const ms = new Date(co).getTime() - new Date(ci).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function PortalAttendancePage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/attendance");
    const data = await res.json();
    if (Array.isArray(data)) {
      setRecords(data);
      setCheckedIn(data.some((r: Record) => !r.checkOut));
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/attendance")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (cancelled || !Array.isArray(data)) return;
        setRecords(data as Record[]);
        setCheckedIn((data as Record[]).some((r) => !r.checkOut));
      });
    return () => { cancelled = true; };
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
    toast.success(checkedIn ? "Checked out!" : "Checked in!");
    load();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-muted-foreground text-sm">{records.length} total sessions</p>
      </div>

      <Card>
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
              ${checkedIn ? "bg-green-500/10" : "bg-muted"}`}>
              {checkedIn
                ? <LogIn className="w-5 h-5 text-green-600 dark:text-green-400" />
                : <LogOut className="w-5 h-5 text-muted-foreground" />
              }
            </div>
            <div>
              <div className="font-semibold">{checkedIn ? "Currently checked in" : "Not checked in"}</div>
              <div className="text-xs text-muted-foreground">
                {checkedIn ? "Click to check out when you're done." : "Click to start your session."}
              </div>
            </div>
          </div>
          <Button onClick={handleAttendance} disabled={loading} variant={checkedIn ? "outline" : "default"}>
            {checkedIn ? "Check Out" : "Check In"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-2">
        {records.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="font-medium text-sm">{new Date(r.date).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    In: {new Date(r.checkIn).toLocaleTimeString()}
                    {r.checkOut && ` · Out: ${new Date(r.checkOut).toLocaleTimeString()}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <Badge variant={r.checkOut ? "secondary" : "default"} className="text-xs">
                  {duration(r.checkIn, r.checkOut)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {records.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No attendance records yet.</p>
        )}
      </div>
    </div>
  );
}
