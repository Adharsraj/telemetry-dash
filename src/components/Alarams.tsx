import { AlertTriangle, Info, CheckCircle2, Bell } from "lucide-react";

type Alarm = {
  id: number;
  code: string;
  severity: "low" | "med" | "high";
  msg: string;
};

const getAlarmStyle = (severity: string) => {
  switch (severity) {
    case "high":
      return {
        bg: "bg-red-100 border-red-300",
        text: "text-red-700",
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      };
    case "med":
      return {
        bg: "bg-yellow-100 border-yellow-300",
        text: "text-yellow-700",
        icon: <Info className="h-5 w-5 text-yellow-600" />,
      };
    default:
      return {
        bg: "bg-blue-100 border-blue-300",
        text: "text-blue-700",
        icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
      };
  }
};

const Alarams = ({ alarms }: { alarms: Alarm[] }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-gray-500 h-5 w-5" />
          <p className="text-lg font-semibold">Recent Alarms</p>
        </div>
        <p className="text-sm text-gray-400">Showing latest 10</p>
      </div>

      {alarms.length === 0 ? (
        <div className="text-gray-400 text-sm italic">
          No active alarms — system normal ✅
        </div>
      ) : (
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {alarms.map((alarm) => {
            const { bg, text, icon } = getAlarmStyle(alarm.severity);
            return (
              <div
                key={alarm.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${bg}`}
              >
                {icon}
                <div className="flex-1">
                  <p className={`font-medium ${text}`}>{alarm.msg}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Code: {alarm.code} ·{" "}
                    {new Date(alarm.id).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alarams;
