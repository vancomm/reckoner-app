import { useAppState } from "../../contexts/AppStateContext";
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
    <input
      key={`user-input-${index}`}
      id={`user-input-${index}`}
      type="text"
      className="user-input"
      value={name}
      placeholder="Enter name..."
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const next = e.currentTarget.nextElementSibling as HTMLElement;
          next.focus(); // this triggers button click when button is next; call event.preventDefault in button handler to prevent this
        }
      }}
    />
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

      <div className="user-form">
        {names.concat("").map((name, index) => (
          <NameForm
            key={`user-input-${index}`}
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
          // <input
          //   key={`user-input-${index}`}
          //   id={`user-input-${index}`}
          //   type="text"
          //   className="user-input"
          //   value={name}
          //   placeholder="Enter name..."
          //   onChange={(e) => {
          //     const { value } = e.target;
          //     setNames((state) =>
          //       state.map((v, i) => (i === index ? value : v))
          //     );
          //     if (index === names.length - 1) {
          //       setNames((state) => [...state, ""]);
          //     }
          //   }}
          //   onKeyDown={(e) => {
          //     if (e.key === "Enter") {
          //       const next = e.currentTarget.nextElementSibling as HTMLElement;
          //       next.focus(); // this triggers button click when button is next; call event.preventDefault in button handler to prevent this
          //     }
          //   }}
          //   onBlur={(e) => {
          //     const { value } = e.target;
          //     if (value === "" && index !== names.length - 1) {
          //       setNames((state) => state.filter((_, i) => i !== index));
          //     }
          //   }}
          // />
        ))}
      </div>
    </StageContainer>
  );
}
