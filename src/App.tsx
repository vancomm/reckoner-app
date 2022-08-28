import { useState } from "react";

import FileForm from "./components/FileForm";
import NamesForm from "./components/NamesForm";
import ItemsForm, { AssignedItem } from "./components/ItemsForm";
import Results from "./components/Results";

import ReceiptData from "./types/ReceiptData";

import "./App.css";

const stages = ["file", "names", "items", "results"] as const;

type Stage = typeof stages[number];

export default function App() {
  const [stage, setStage] = useState<Stage>("file");

  const [receiptData, setReceiptData] = useState<ReceiptData>();

  const initNames = ["Vanya", "Sanya"]; // debugging purposes only

  const [names, setNames] = useState<string[]>(initNames);

  const [items, setItems] = useState<AssignedItem[]>([]);

  return (
    <div className="app bg-gradient">
      {stage === "file" && (
        <FileForm
          initReceiptData={receiptData}
          setFn={(receiptData) => {
            setReceiptData(receiptData);
          }}
          nextFn={() => setStage("names")}
        />
      )}

      {stage === "names" && (
        <NamesForm
          initNames={names}
          setFn={(names) => {
            setNames(names);
          }}
          backFn={() => {
            setStage("file");
          }}
          nextFn={() => {
            setStage("items");
          }}
        />
      )}

      {stage === "items" && receiptData && (
        <ItemsForm
          items={receiptData.items}
          names={names}
          setFn={(items) => {
            setItems(items);
          }}
          backFn={() => {
            setStage("names");
          }}
          nextFn={() => {
            setStage("results");
          }}
        />
      )}

      {stage === "results" && items && (
        <Results
          items={items}
          backFn={() => setStage("items")}
          againFn={() => setStage("file")}
        />
      )}
    </div>
  );
}
