import cn from "classnames";
import StageContainer from "../StageContainer";
import { useAppState } from "../../contexts/AppStateContext";
import { UniqueItem } from "../../utils/parseReceiptDocument";
import styles from "./ItemsStage.module.css";

interface ItemActionProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function ItemAction({ label, onClick }: ItemActionProps) {
  return (
    <button className={styles.itemAction} onClick={onClick}>
      <div>{label}</div>
    </button>
  );
}

interface NamePickerProps {
  names: string[];
  index: number;
  checkedFn: (name: string) => boolean;
  onChangeFn: (name: string) => React.ChangeEventHandler<HTMLInputElement>;
}

function NamePicker({ names, index, checkedFn, onChangeFn }: NamePickerProps) {
  return (
    <ul className={styles.itemNames}>
      {names.map((name, i) => (
        <li key={`item-${index}-name-${i}`}>
          <input
            id={`item-${index}-input-${name}`}
            className={styles.itemNamesInput}
            type="checkbox"
            value={name}
            checked={checkedFn(name)}
            onChange={onChangeFn(name)}
          />
          <label
            className={styles.itemNamesLabel}
            htmlFor={`item-${index}-input-${name}`}
          >
            {name}
          </label>
        </li>
      ))}
    </ul>
  );
}

interface ItemCardProps {
  item: UniqueItem;
  filled?: boolean;
  children?: React.ReactNode;
}

function ItemCard({ item, filled, children }: ItemCardProps) {
  const { index } = item;

  return (
    <div
      id={`item-${index}`}
      className={cn(styles.itemCard, {
        success: filled,
      })}
    >
      <div className={styles.itemDetails}>
        <div className={styles.itemTitle}>{item.name.toLowerCase()}</div>
        <span>
          {item.price / 100}
          {" × "}
          {item.quantity}
        </span>
      </div>

      {children}
    </div>
  );
}

interface ItemsFormProps {
  backFn: () => void;
  nextFn: () => void;
}

export default function ItemsStage({ backFn, nextFn }: ItemsFormProps) {
  const { names, receiptData, result, setResult } = useAppState();

  if (!names || !receiptData) return null;

  const { items } = receiptData;

  return (
    <StageContainer
      handleBack={() => {
        backFn();
      }}
      handleNext={() => {
        nextFn();
      }}
      nextCondition={
        Object.keys(result).length === items.length &&
        Object.values(result).every(({ length }) => length > 0)
      }
    >
      <span className="title">Items</span>

      <ul className={styles.items}>
        {items.map((item) => {
          const { index } = item;
          return (
            <li key={`item-${index}`} className={styles.itemContainer}>
              <ItemCard item={item} filled={!!(result[index]?.length > 0)}>
                <NamePicker
                  names={names}
                  index={index}
                  checkedFn={(name) => !!result[index]?.includes(name)}
                  onChangeFn={(name) => (e) => {
                    setResult((state) => {
                      const { checked } = e.target;
                      const prev = state[index] ?? [];
                      const next = checked
                        ? [...prev, name]
                        : prev.filter((n) => n !== name);
                      return { ...state, [index]: next };
                    });
                  }}
                />
              </ItemCard>

              <div className={styles.itemActions}>
                <ItemAction
                  label="¬"
                  onClick={() => {
                    setResult((state) => {
                      const prev = state[index] ?? [];
                      const next = names.filter((name) => !prev.includes(name));
                      return { ...state, [index]: next };
                    });
                  }}
                />
                <ItemAction
                  label="∀"
                  onClick={() => {
                    setResult((state) => {
                      const prev = state[index] ?? [];
                      const next = prev.length === names.length ? [] : names;
                      return { ...state, [index]: next };
                    });
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </StageContainer>
  );
}
