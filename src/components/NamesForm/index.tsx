import cn from "classnames";
import { useAppState } from "../../contexts/AppStateContext";
import CrossInCircleIcon from "../CrossInCircleIcon";
import StageContainer from "../StageContainer";

interface NamesFormProps {
  backFn: () => void;
  nextFn: () => void;
}

interface NameFormProps {
  index: number;
  name: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

function NameForm({ index, name, onChange }: NameFormProps) {
  return (
    <div className={cn("name-form")}>
      <input
        key={`name-input-${index}`}
        id={`name-input-${index}`}
        type="text"
        className="name-input"
        value={name}
        placeholder="Enter name..."
        onClick={() => {
          console.count("click on input");
        }}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const next = e.currentTarget.nextElementSibling as HTMLElement;
            next.focus(); // this triggers button click when button is next; call event.preventDefault in button handler to prevent this
          }
        }}
      />
      <button
        className="cross-in-circle-btn"
        type="reset"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          console.count("click on button");
        }}
      >
        <CrossInCircleIcon width="1em" height="1em" />
      </button>
    </div>
  );
}

export default function NamesForm({ backFn, nextFn }: NamesFormProps) {
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
      nextCondition={names.length > 0}
    >
      <span className="title">Users</span>

      <div className="names-form">
        {names.concat("").map((name, index) => (
          <NameForm
            key={`name-form-${index}`}
            name={name}
            index={index}
            onChange={(e) => {
              const { value } = e.target;
              setNames((state) =>
                value
                  ? state[index]
                    ? state.map((v, i) => (i === index ? value : v))
                    : state.concat(value)
                  : state.filter((_, i) => i !== index)
              );
            }}
          />
        ))}
      </div>
    </StageContainer>
  );
}
