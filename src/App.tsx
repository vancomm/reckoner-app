import { useState } from "react";

import { useAppState } from "./contexts/AppStateContext";

import ReceiptStage from "./components/ReceiptStage";
import NamesStage from "./components/NamesStage";
import ItemsStage from "./components/ItemsStage";
import Results from "./components/Results";

import "./App.css";

const stages = ["receipt", "names", "items", "results"] as const;

type Stage = typeof stages[number];

export default function App() {
  const [stage, setStage] = useState<Stage>("receipt");
  const { names, receiptData, result } = useAppState();

  return (
    <div className="app bg-gradient">
      {stage === "receipt" && <ReceiptStage nextFn={() => setStage("names")} />}

      {stage === "names" && (
        <NamesStage
          backFn={() => setStage("receipt")}
          nextFn={() => setStage("items")}
        />
      )}

      {stage === "items" && receiptData && names && (
        <ItemsStage
          backFn={() => setStage("names")}
          nextFn={() => setStage("results")}
        />
      )}

      {stage === "results" && result && (
        <Results
          backFn={() => setStage("items")}
          againFn={() => setStage("receipt")}
        />
      )}
    </div>
  );
}
