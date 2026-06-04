"use client";

import { useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AttendanceRecord = {
  id: string;
  checkIn: string;
  checkOut: string | null;
  date: string;
  client: { user: { name: string; email: string } };
};

function duration(checkIn: string, checkOut: string | null) {
  if (!checkOut) return "Active";
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const hrs = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  return `${hrs}h ${mins}m`;
}

export default function AdminAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetch("/api/attendance").then((r) => r.json()).then(setRecords);
  }, []);

  const today = records.filter((r) => new Date(r.date).toDateString() === new Date().toDateString());
  const activeNow = today.filter((r) => !r.checkOut);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-muted-foreground text-sm">
          {activeNow.length} member{activeNow.length !== 1 ? "s" : ""} currently in space · {today.length} today
        </p>
      </div>

      {activeNow.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3 text-primary uppercase tracking-wider">Currently In</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeNow.map((r) => (
              <Card key={r.id} className="border-green-500/30 bg-green-500/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <LogIn className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{r.client.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Checked in {new Date(r.checkIn).toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">All Records</h2>
        <div className="grid gap-2">
          {records.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${r.checkOut ? "bg-muted" : "bg-green-500/10"}`}>
                    {r.checkOut ? (
                      <LogOut className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <LogIn className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{r.client.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.date).toLocaleDateString()} · In: {new Date(r.checkIn).toLocaleTimeString()}
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
            <p className="text-center text-muted-foreground py-12">No attendance records.</p>
          )}
        </div>
      </div>
    </div>
  );
}
