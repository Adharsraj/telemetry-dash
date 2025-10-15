import { useEffect, useState } from "react";
import "./App.css";
import Alarams from "./components/Alarams";
import Header from "./components/Header";
import { ChartLineLinear } from "./components/LineChart";

function App() {
  const [status, setStatus] = useState(["OK"]);

  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    if (status === "OUTAGE") {
      setAlarms.push("new warning detected");
    }
  }, [status]);
  return (
    <>
      <button onClick={() => setStatus("OUTAGE")}>warning trigger</button>
      <div>
        <Header status={status} />
        <ChartLineLinear />
        <Alarams alarms={alarms} />
      </div>
    </>
  );
}

export default App;
