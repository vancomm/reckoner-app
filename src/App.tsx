import { Fragment, useState } from "react";
import UsersForm from "./components/UsersForm";
import FileForm from "./components/FileForm";
import { Item } from "./types/ReceiptDocument";
import "./App.css";

const stages = ["users", "file", "items"] as const;

type Stage = typeof stages[number];

export default function App() {
  const [stage, setStage] = useState<Stage>("users");

  const [names, setNames] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  return (
    <div className="app bg-gradient">
      {stage === "users" && (
        <UsersForm
          submitFn={(names) => {
            setNames(names);
            setStage("file");
          }}
        />
      )}
      {stage === "file" && (
        <FileForm
          submitFn={({ items }) => {
            setItems(items);
            setStage("items");
          }}
        />
      )}
      {stage === "items" && (
        <div className="container">
          <span className="title">Items</span>
          <ul className="items">
            {items.map((item, index) => (
              <Fragment key={index}>
                <li className="item">
                  {item.name.toLowerCase()}
                  <br />
                  {names.map((name, i) => (
                    <Fragment key={i}>
                      <input
                        id={`input-${name}`}
                        className="item-input"
                        type="checkbox"
                        value={name}
                      />
                      <label
                        className="item-input-label"
                        htmlFor={`input-${name}`}
                      >
                        {name}
                      </label>
                    </Fragment>
                  ))}
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
