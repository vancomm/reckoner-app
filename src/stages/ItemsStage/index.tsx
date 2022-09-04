import { useState } from "react";
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
import range from "../../utils/range";
import styles from "./ItemsStage.module.css";

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

// function mergeItems(items: UniqueItem[]): UniqueItem[] {
//   return items.slice().reduce((acc, curr) => {
//     const index = acc.findIndex((i) => i.name === curr.name);
//     if (index === -1) return [...acc, curr];
//     const prev = acc[index];
//     const next: UniqueItem = {
//       ...prev,
//       quantity: prev.quantity + curr.quantity,
//       sum: prev.sum + curr.sum,
//     };
//     return acc.map((v, i) => (i === index ? next : v));
//   }, [] as UniqueItem[]);
// }

// function spreadItems(items: UniqueItem[]): UniqueItem[] {
//   let offset = 0;
//   return items.reduce((acc, item, index) => {
//     if (item.quantity === 1 || !Number.isInteger(item.quantity)) {
//       const reindexed = { ...item, index: index + offset };
//       return [...acc, reindexed];
//     }
//     const duplicates: UniqueItem[] = range(item.quantity).map((i) => ({
//       ...item,
//       index: index + offset + i,
//       quantity: 1,
//       sum: item.price,
//     }));
//     offset += item.quantity - 1;
//     return [...acc, ...duplicates];
//   }, [] as UniqueItem[]);
// }

// const mergeOptions = ["none", "merge", "spread"] as const;

// type MergeOption = typeof mergeOptions[number];

// function getMergeFunc(
//   option: MergeOption
// ): (items: UniqueItem[]) => UniqueItem[] {
//   switch (option) {
//     case "none":
//       return (items) => items;
//     case "merge":
//       return mergeItems;
//     case "spread":
//       return spreadItems;
//   }
// }

interface ItemsStageProps {
  backFn: () => void;
  nextFn: () => void;
}

export default function ItemsStage({ backFn, nextFn }: ItemsStageProps) {
  const { names, receiptData, distMap, setDistMap } = useAppState();

  // const [merge, setMerge] = useState<MergeOption>("none");

  if (!names || !receiptData) return null;

  const { items } = receiptData;

  // const displayedItems = getMergeFunc(merge)(items);
  const displayedItems = items;

  const nextCondition =
    distMap.size === displayedItems.length &&
    [...distMap.values()].every((d) => Object.values(d).some((v) => v !== 0));

  const isCardFilled = (item: UniqueItem) =>
    Object.values(distMap.get(item) ?? {}).some((v) => v > 0);

  const handleNameClick =
    (item: UniqueItem) =>
    (name: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      const value = checked ? 1 : 0;
      setDistMap((state) => {
        const prev = state.get(item) ?? {};
        const next = { ...prev, [name]: value };
        return new Map(state.set(item, next));
      });
    };

  const isNameChecked = (item: UniqueItem) => (name: string) => {
    const value = distMap.get(item)?.[name] ?? 0;
    return value > 0;
  };

  const handleInvert = (item: UniqueItem) => () => {
    setDistMap((state) => {
      const prev = state.get(item) ?? {};
      const next = { ...prev };
      names.forEach((name) => {
        next[name] = 1 - next[name] ?? 0;
      });
      return new Map(state).set(item, next);
    });
  };

  const handleAll = (item: UniqueItem) => () => {
    setDistMap((state) => {
      const prev = state.get(item) ?? {};
      const next = { ...prev };
      if (
        Object.values(next).length === names.length &&
        Object.values(next).every((v) => v > 0)
      ) {
        names.forEach((name) => {
          next[name] = 0;
        });
      } else {
        names.forEach((name) => {
          next[name] = 1;
        });
      }
      const newState = new Map(state);
      newState.set(item, next);
      return newState;
    });
  };

  return (
    <StageContainer
      className={styles.itemsContainer}
      handleBack={() => {
        backFn();
      }}
      handleNext={() => {
        nextFn();
      }}
      nextCondition={nextCondition}
    >
      <StageContainer.Title>Items</StageContainer.Title>

      {/* {false && (
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
      )} */}

      <div className={styles.items}>
        {displayedItems.map((item) => {
          const { index } = item;

          return (
            <CardContainer
              key={`item-${index}`}
              className={cn(styles.itemContainer, {
                [styles.success]: isCardFilled(item),
              })}
            >
              <ItemCard item={item}>
                <div className={styles.namePicker}>
                  {names.map((name, i) => (
                    <Toggle
                      key={`item-${index}-name-${i}`}
                      id={`item-${index}-input-${name}`}
                      className={styles.nameLabel}
                      label={name}
                      active={isNameChecked(item)(name)}
                      onClick={handleNameClick(item)(name)}
                    />
                  ))}
                </div>
              </ItemCard>

              <CardActions className={styles.itemCardActions}>
                <Button
                  className={styles.itemCardAction}
                  label="invert"
                  onClick={handleInvert(item)}
                />
                <Button
                  className={styles.itemCardAction}
                  label="all"
                  onClick={handleAll(item)}
                />
              </CardActions>
            </CardContainer>
          );
        })}
      </div>
    </StageContainer>
  );
}
