import cn from "classnames";

import StageContainer from "../../components/StageContainer";
import Card, {
  CardContainer,
  CardActions,
  Button,
  Toggle,
  CardProps,
} from "../../components/Card";

import { useAppState } from "../../contexts/AppStateContext";
import { UniqueItem } from "../../utils/parseReceiptDocument";
import styles from "./ItemsStage.module.css";
import { useState } from "react";
import range from "../../utils/range";

interface NamePickerProps {
  names: string[];
  index: number;
  checkedFn: (name: string) => boolean;
  onChangeFn: (name: string) => React.ChangeEventHandler<HTMLInputElement>;
}

function NamePicker({ names, index, checkedFn, onChangeFn }: NamePickerProps) {
  return (
    <div className={styles.namePicker}>
      {names.map((name, i) => (
        <Toggle
          key={`item-${index}-name-${i}`}
          id={`item-${index}-input-${name}`}
          className={styles.nameLabel}
          label={name}
          active={checkedFn(name)}
          onClick={onChangeFn(name)}
        />
      ))}
    </div>
  );
}

interface ItemCardProps extends CardProps {
  item: UniqueItem;
}

function ItemCard({ item, children }: ItemCardProps) {
  const { index, name, price, quantity } = item;

  return (
    <Card id={`item-${index}`} className={styles.itemCard}>
      <Card.Title className={styles.itemTitle}>
        {name.toLowerCase()}

        <Card.Subtitle className={styles.itemSubtitle}>
          {`${price / 100} × ${quantity}`}
        </Card.Subtitle>
      </Card.Title>

      {children}
    </Card>
  );
}

interface ItemsStageProps {
  backFn: () => void;
  nextFn: () => void;
}

function mergeItems(items: UniqueItem[]): UniqueItem[] {
  return items.slice().reduce((acc, curr) => {
    const index = acc.findIndex((i) => i.name === curr.name);
    if (index === -1) return [...acc, curr];
    const prev = acc[index];
    const next: UniqueItem = {
      ...prev,
      quantity: prev.quantity + curr.quantity,
      sum: prev.sum + curr.sum,
    };
    return acc.map((v, i) => (i === index ? next : v));
  }, [] as UniqueItem[]);
}

function spreadItems(items: UniqueItem[]): UniqueItem[] {
  let offset = 0;
  return items.reduce((acc, item, index) => {
    if (item.quantity === 1 || !Number.isInteger(item.quantity)) {
      const reindexed = { ...item, index: index + offset };
      return [...acc, reindexed];
    }
    const duplicates = range(item.quantity).map((i) => ({
      ...item,
      index: index + offset + i,
      quantity: 1,
      sum: item.price,
    }));
    offset += item.quantity - 1;
    return [...acc, ...duplicates];
  }, [] as UniqueItem[]);
}

const mergeOptions = ["none", "merge", "spread"] as const;

type MergeOption = typeof mergeOptions[number];

function getMergeFunc(
  option: MergeOption
): (items: UniqueItem[]) => UniqueItem[] {
  switch (option) {
    case "none":
      return (items) => items;
    case "merge":
      return mergeItems;
    case "spread":
      return spreadItems;
  }
}

export default function ItemsStage({ backFn, nextFn }: ItemsStageProps) {
  const { names, receiptData, result, setResult } = useAppState();

  const [merge, setMerge] = useState<MergeOption>("none");

  if (!names || !receiptData) return null;

  const { items } = receiptData;

  const displayedItems = getMergeFunc(merge)(items);

  return (
    <StageContainer
      handleBack={() => {
        backFn();
      }}
      handleNext={() => {
        nextFn();
      }}
      nextCondition={
        Object.keys(result).length === displayedItems.length &&
        Object.values(result).every(({ length }) => length > 0)
      }
    >
      <StageContainer.Title>Items</StageContainer.Title>

      {false && ( // hidden
        <Card className={styles.optionsCard}>
          <Card.Title className={styles.optionsTitle}>Options</Card.Title>
          <div className={styles.optionsToggles}>
            <div className={styles.optionRow}>
              <Toggle
                id="merge-toggle"
                active={merge !== "none"}
                label={merge}
                onClick={() =>
                  setMerge((state) =>
                    state === "none"
                      ? "merge"
                      : state === "merge"
                      ? "spread"
                      : "none"
                  )
                }
              />
            </div>
          </div>
        </Card>
      )}

      <div className={styles.items}>
        {displayedItems.map((item) => {
          const { index } = item;

          return (
            <CardContainer
              key={`item-${index}`}
              className={cn(styles.itemContainer, {
                [styles.success]: !!(result[index]?.length > 0),
                [styles.double]: item.quantity === 2,
              })}
            >
              <ItemCard item={item}>
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

              <CardActions className={styles.itemCardActions}>
                <Button
                  className={styles.itemCardAction}
                  label="invert"
                  onClick={() => {
                    setResult((state) => {
                      const prev = state[index] ?? [];
                      const next = names.filter((name) => !prev.includes(name));
                      return { ...state, [index]: next };
                    });
                  }}
                />
                <Button
                  className={styles.itemCardAction}
                  label="all"
                  onClick={() => {
                    setResult((state) => {
                      const prev = state[index] ?? [];
                      const next = prev.length === names.length ? [] : names;
                      return { ...state, [index]: next };
                    });
                  }}
                />
              </CardActions>
            </CardContainer>
          );
        })}
      </div>
    </StageContainer>
  );
}
