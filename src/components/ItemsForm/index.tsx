import { useState } from "react";
import { Item } from "../../types/ReceiptDocument";
import StageContainer from "../StageContainer";

interface ItemsFormProps {
  items: Item[];
  names: string[];
  setFn: (items: AssignedItem[]) => any;
  backFn: () => void;
  nextFn: () => void;
}

interface UniqueItem extends Item {
  index: number;
}

export interface AssignedItem extends UniqueItem {
  owners: string[];
}

type ItemMap = Record<number, string[]>;

export default function ItemsForm({
  items,
  names,
  setFn,
  backFn,
  nextFn,
}: ItemsFormProps) {
  const [itemMap, setItemMap] = useState<ItemMap>({});

  const uniqueItems: UniqueItem[] = items.map((item, index) => ({
    ...item,
    index,
  }));

  return (
    <StageContainer
      handleBack={() => {
        const res: AssignedItem[] = uniqueItems.map((item) => ({
          ...item,
          owners: itemMap[item.index],
        }));
        setFn(res);
        backFn();
      }}
      handleNext={() => {
        const res: AssignedItem[] = uniqueItems.map((item) => ({
          ...item,
          owners: itemMap[item.index],
        }));
        setFn(res);
        nextFn();
      }}
      nextCondition={
        Object.keys(itemMap).length === uniqueItems.length &&
        Object.values(itemMap).every((n) => n.length > 0)
      }
    >
      <span className="title">Items</span>
      <ul className="items">
        {uniqueItems.map(({ index, ...item }) => (
          <li id={`item-${index}`} key={`item-${index}`} className="item">
            <div className="item-details">
              <span className="item-name">{item.name.toLowerCase()}</span>
              <br />
              <span className="item-price">{item.price / 100}</span>
              {" × "}
              <span className="item-qty">{item.quantity}</span>
            </div>
            <ul id="item-names" className="item-names">
              {names.map((name, i) => (
                <li key={`item-${index}-name-${i}`}>
                  <input
                    id={`item-${index}-input-${name}`}
                    className="item-names-input"
                    type="checkbox"
                    value={name}
                    checked={!!itemMap[index]?.includes(name)}
                    onChange={(e) => {
                      setItemMap((state) => {
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
