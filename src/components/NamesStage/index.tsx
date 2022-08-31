// import cn from "classnames";
import { useAppState } from "../../contexts/AppStateContext";
import StageContainer from "../StageContainer";
import NameForm from "./NameForm";
import styles from "./NamesStage.module.css";

interface NamesStageProps {
  backFn: () => void;
  nextFn: () => void;
}

export default function NamesStage({ backFn, nextFn }: NamesStageProps) {
  const { names, setNames } = useAppState();

  if (!names) return null;

  return (
    <StageContainer
      handleBack={() => {
        backFn();
      }}
      handleNext={() => {
        nextFn();
      }}
      nextCondition={
        names.length > 0 &&
        new Set(names.map((n) => n.trim())).size ===
          names.map((n) => n.trim()).length
      }
    >
      <StageContainer.Title>User Names</StageContainer.Title>

      <div className={styles.namesForm}>
        {names.concat("").map((name, index) => (
          <NameForm
            key={`name-form-${index}`}
            name={name}
            index={index}
            invalid={
              name !== "" &&
              names.some((n, i) => i < index && n.trim() === name.trim())
            }
            onChange={(e) => {
              const { value } = e.target;
              setNames((state) =>
                state.length > index
                  ? state.map((v, i) => (i === index ? value : v))
                  : state.concat(value)
              );
            }}
            onClear={() => {
              setNames((state) => state.map((v, i) => (i === index ? "" : v)));
            }}
            onBlur={(e) => {
              const { value } = e.target;
              if (!value)
                setNames((state) => state.filter((_, i) => i !== index));
            }}
            onEnter={() => {
              const nextSelector =
                index < names.length ? `#name-input-${index + 1}` : ".next-btn";
              const next = document.querySelector(nextSelector);
              if (next) (next as HTMLElement).focus();
            }}
          />
        ))}
      </div>
    </StageContainer>
  );
}
