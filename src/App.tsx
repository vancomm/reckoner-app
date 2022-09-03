import { useState } from "react";

import { useAppState } from "./contexts/AppStateContext";

import Manual from "./components/Manual";
import ReceiptStage from "./stages/ReceiptStage";
import NamesStage from "./stages/NamesStage";
import ItemsStage from "./stages/ItemsStage";
import ResultsStage from "./stages/ResultsStage";

import "./App.css";

const stages = ["receipt", "names", "items", "results"] as const;

type Stage = typeof stages[number];

export default function App() {
  const [stage, setStage] = useState<Stage>("receipt");
  const {
    names,
    receiptData,
    result,
    uiState: { showManual },
  } = useAppState();

  return (
    <div className="app">
      <main>
        {showManual && <Manual />}
        {stage === "receipt" && (
          <ReceiptStage nextFn={() => setStage("names")} />
        )}

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
          <ResultsStage
            backFn={() => setStage("items")}
            againFn={() => setStage("receipt")}
          />
        )}
      </main>
      <footer>
        <span>
          <a className="link" href="https://github.com/vancomm/reckoner-app">
            source code
          </a>
        </span>
        <span>
          {"made by "}
          <a className="link" href="https://github.com/vancomm">
            me
          </a>
        </span>
        <span>2022</span>
      </footer>
    </div>
  );
}
