import React, { useRef, useState } from "react";
import Collapsible from "../Collapsible";
import StageContainer from "../StageContainer";
import Card, { CardContainer, CardActions } from "../Card";
import { useAppState } from "../../contexts/AppStateContext";
import { UniqueItem } from "../../utils/parseReceiptDocument";
import formatMoney from "../../utils/formatMoney";
import styles from "./ResultsStage.module.css";

interface TotalCardProps {
  name: string;
  value: number;
  items: AssignedItem[];
}

function TotalCard({ name, value, items }: TotalCardProps) {
  const [collapseDetails, setCollapseDetails] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <CardContainer>
      <Card className={styles.totalCard}>
        <Card.Title className={styles.title}>{name}</Card.Title>
        <div className={styles.value}>{`total: ${formatMoney(value)}`}</div>
        <div>
          <Collapsible open={!collapseDetails}>
            <div ref={ref} className={styles.details}>
              {items.map((item, i) => (
                <React.Fragment key={`detail-${i}`}>
                  <div>{item.name}</div>
                  <div>{formatMoney(item.sum)}</div>
                  <div>{item.owners.length}</div>
                  <div>{formatMoney(item.sum / item.owners.length)}</div>
                </React.Fragment>
              ))}
            </div>
          </Collapsible>
        </div>
      </Card>
      <CardActions>
        <CardActions.Button
          label={collapseDetails ? "expand" : "collapse"}
          onClick={() => setCollapseDetails((state) => !state)}
        />
        {/* <CardActions.Toggle
          id={`toggle-${name}`}
          active={flag}
          label={"toggle"}
          onClick={() => setFlag((state) => !state)}
        /> */}
      </CardActions>
    </CardContainer>
  );
}

interface AssignedItem extends UniqueItem {
  owners: string[];
}

interface ResultsProps {
  backFn: () => void;
  againFn: () => void;
}

export default function ResultsStage({ backFn, againFn }: ResultsProps) {
  const { receiptData, result } = useAppState();

  if (!receiptData || !result) return null;

  const { items } = receiptData;

  const assignedItems: AssignedItem[] = items.map((item) => ({
    ...item,
    owners: result[item.index],
  }));

  const totals = assignedItems.reduce((acc, { sum, owners }) => {
    const share = sum / owners.length;
    owners.forEach((name) => {
      acc[name] = acc[name] ? acc[name] + share : share;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <StageContainer
      handleBack={() => {
        backFn();
      }}
      customControls={[
        {
          label: "Again",
          onClick: againFn,
          className: styles.again,
        },
      ]}
    >
      <StageContainer.Title>Results</StageContainer.Title>

      <div className={styles.totals}>
        {Object.entries(totals)
          .sort(([, totalA], [, totalB]) => totalB - totalA)
          .map(([name, total], index) => {
            return (
              <TotalCard
                key={`total-${index}-${name}`}
                name={name}
                value={total}
                items={assignedItems.filter(({ owners }) =>
                  owners.includes(name)
                )}
              />
            );
          })}
      </div>
    </StageContainer>
  );
}
