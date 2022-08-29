import { useState } from "react";

import { useAppState } from "./contexts/AppStateContext";

import ReceiptForm from "./components/ReceiptForm";
import NamesForm from "./components/NamesForm";
import ItemsForm from "./components/ItemsForm";
import Results from "./components/Results";

import "./App.css";

const stages = ["receipt", "names", "items", "results"] as const;

type Stage = typeof stages[number];

export default function App() {
  const [stage, setStage] = useState<Stage>("receipt");
  const { names, receiptData, result } = useAppState();

  return (
    <div className="app bg-gradient">
      {stage === "receipt" && <ReceiptForm nextFn={() => setStage("names")} />}

      {stage === "names" && (
        <NamesForm
          backFn={() => setStage("receipt")}
          nextFn={() => setStage("items")}
        />
      )}

      {stage === "items" && receiptData && names && (
        <ItemsForm
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
