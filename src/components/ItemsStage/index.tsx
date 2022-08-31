import cn from "classnames";

import StageContainer from "../StageContainer";
import Card, {
  CardContainer,
  CardActions,
  Button,
  Toggle,
  CardProps,
} from "../Card";

import { useAppState } from "../../contexts/AppStateContext";
import { UniqueItem } from "../../utils/parseReceiptDocument";
import styles from "./ItemsStage.module.css";

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

export default function ItemsStage({ backFn, nextFn }: ItemsStageProps) {
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
      <StageContainer.Title>Items</StageContainer.Title>

      <div className={styles.items}>
        {items.map((item) => {
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
