import cn from "classnames";
import { useAppState } from "../../contexts/AppStateContext";
import StageContainer from "../StageContainer";

interface ItemsFormProps {
  backFn: () => void;
  nextFn: () => void;
}

export default function ItemsForm({ backFn, nextFn }: ItemsFormProps) {
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
        Object.values(result).every((n) => n.length > 0)
      }
    >
      <span className="title">Items</span>
      <ul className="items">
        {items.map(({ index, ...item }) => (
          <li
            id={`item-${index}`}
            key={`item-${index}`}
            className={cn("item", { filled: !!(result[index]?.length > 0) })}
          >
            <div className="item-details">
              <div className="item-name">{item.name.toLowerCase()}</div>
              <span className="item-detail">{item.price / 100}</span>
              <span>{" × "}</span>
              <span className="item-detail">{item.quantity}</span>
            </div>
            <ul id="item-names" className="item-names">
              {names.map((name, i) => (
                <li key={`item-${index}-name-${i}`}>
                  <input
                    id={`item-${index}-input-${name}`}
                    className="item-names-input"
                    type="checkbox"
                    value={name}
                    checked={!!result[index]?.includes(name)}
                    onChange={(e) => {
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
                  <label
                    className="item-names-label"
                    htmlFor={`item-${index}-input-${name}`}
                  >
                    {name}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </StageContainer>
  );
}
