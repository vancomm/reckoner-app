import { useState } from "react";
import StageContainer from "../StageContainer";

interface NamesFormProps {
  initNames: string[];
  backFn: () => void;
  nextFn: () => void;
  setFn: (names: string[]) => any;
}

export default function NamesForm({
  initNames,
  backFn,
  nextFn,
  setFn,
}: NamesFormProps) {
  const [names, setNames] = useState<string[]>([...initNames, ""]);

  return (
    <StageContainer
      handleBack={() => {
        setFn(names.filter((n) => n !== ""));
        backFn();
      }}
      handleNext={() => {
        setFn(names.filter((n) => n !== ""));
        nextFn();
      }}
      nextCondition={names.filter((n) => n !== "").length > 0}
    >
      <span className="title">Users</span>

      <div className="user-form">
        {names.map((name, index) => (
          <input
            key={`user-input-${index}`}
            id={`user-input-${index}`}
            type="text"
            className="user-input"
            value={name}
            placeholder="Enter name..."
            onChange={(e) => {
              const { value } = e.target;
              setNames((state) =>
                state.map((v, i) => (i === index ? value : v))
              );
              if (index === names.length - 1) {
                setNames((state) => [...state, ""]);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const next = e.currentTarget.nextElementSibling as HTMLElement;
                next.focus(); // this triggers button click when button is next; call event.preventDefault in button handler to prevent this
              }
            }}
            onBlur={(e) => {
              const { value } = e.target;
              if (value === "" && index !== names.length - 1) {
                setNames((state) => state.filter((_, i) => i !== index));
              }
            }}
          />
        ))}
      </div>
    </StageContainer>
  );
}
