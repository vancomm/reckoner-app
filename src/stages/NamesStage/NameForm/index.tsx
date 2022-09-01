import cn from "classnames";
import { useState } from "react";
import CrossInCircleIcon from "../../../components/CrossInCircleIcon";
import styles from "./NameForm.module.css";

interface NameFormProps {
  index: number;
  name: string;
  invalid?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
  onEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

export default function NameForm({
  index,
  name,
  onChange,
  onClear,
  onBlur,
  onEnter,
  invalid = false,
}: NameFormProps) {
  const [clearActive, setClearActive] = useState(false);

  return (
    <div className={styles.nameForm}>
      <input
        id={`name-input-${index}`}
        type="text"
        className={cn(styles.nameInput, {
          [styles.invalid]: invalid,
          filled: !!name,
        })}
        value={name}
        placeholder="Enter name..."
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) {
            onEnter(e);
          }
        }}
      />

      {onClear && (
        <button
          className={cn(styles.crossInCircleBtn, {
            [styles.active]: clearActive,
          })}
          type="reset"
          onMouseDown={(e) => {
            e.preventDefault();
            setClearActive(true);
            onClear();
          }}
          onMouseUp={() => setClearActive(false)}
          tabIndex={-1}
        >
          <CrossInCircleIcon width="1em" height="1em" />
        </button>
      )}

      {/* <button className="cross-btn">
        <CrossIcon width="1em" height="1em" />
      </button> */}
    </div>
  );
}
