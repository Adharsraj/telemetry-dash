import { useEffect, useState, useRef } from "react";
import "./App.css";
import Alarams from "./components/Alarams";
import Header from "./components/Header";
import { ChartLineLinear } from "./components/LineChart";
import { Button } from "@/components/ui/button";

type Alarm = {
  id: number;
  code: string;
  severity: "low" | "med" | "high";
  msg: string;
};

type Telemetry = {
  siteId: string;
  ts: number;
  soc: number;
  powerKw: number;
  gridStatus: "OK" | "OUTAGE";
};

function App() {
  const [status, setStatus] = useState<"OK" | "OUTAGE">("OK");
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [telemetry, setTelemetry] = useState<Telemetry>({
    siteId: "TWR-1023",
    ts: Date.now(),
    soc: 100,
    powerKw: 0,
    gridStatus: "OK",
  });
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Generate mock telemetry every 1s
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        const newGridStatus = Math.random() < 0.05 ? "OUTAGE" : "OK";
        const newSoc = Math.max(0, telemetry.soc - Math.random() * 2);
        const newPower = Math.random() * 25;

        const newTelemetry = {
          siteId: "TWR-1023",
          ts: Date.now(),
          soc: parseFloat(newSoc.toFixed(1)),
          powerKw: parseFloat(newPower.toFixed(1)),
          gridStatus: newGridStatus,
        };
        setTelemetry(newTelemetry);
        setStatus(newGridStatus);

        // ✅ Auto-add alarms
        if (newGridStatus === "OUTAGE") {
          const newAlarm: Alarm = {
            id: Date.now(),
            code: "GRID_001",
            severity: "high",
            msg: "⚠️ Grid outage detected",
          };
          setAlarms((prev) => [newAlarm, ...prev.slice(0, 9)]);
        } else if (newSoc < 25) {
          const newAlarm: Alarm = {
            id: Date.now(),
            code: "SOC_LOW",
            severity: "med",
            msg: `🔋 SOC low: ${newSoc.toFixed(1)}%`,
          };
          setAlarms((prev) => [newAlarm, ...prev.slice(0, 9)]);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, telemetry.soc]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 space-y-6">
      {(status === "OUTAGE" || telemetry.soc < 25) && (
        <div
          className="bg-red-100 text-red-800 border border-red-300 rounded-md px-4 py-2 font-medium"
          role="alert"
          aria-live="assertive"
        >
          {status === "OUTAGE"
            ? "🚨 Grid Outage Detected!"
            : `⚠️ Low SOC: ${telemetry.soc.toFixed(1)}%`}
        </div>
      )}

      {/* ✅ Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setIsPaused((prev) => !prev)}
          variant={isPaused ? "destructive" : "default"}
        >
          {isPaused ? "Resume Stream" : "Pause Stream"}
        </Button>
      </div>

      {/* ✅ Header, Chart, Alarms */}
      <div className="space-y-6">
        <Header status={status} />
        <ChartLineLinear telemetry={telemetry} />
        <Alarams alarms={alarms} />
      </div>
    </div>
  );
}

export default App;
