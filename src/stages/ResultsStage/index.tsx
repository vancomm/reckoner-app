import React, { useRef, useState } from "react";
import Collapsible from "../../components/Collapsible";
import StageContainer from "../../components/StageContainer";
import Card, { CardContainer, CardActions } from "../../components/Card";
import { InputRecord, useAppState } from "../../contexts/AppStateContext";
import { UniqueItem } from "../../utils/parseReceiptDocument";
import formatMoney from "../../utils/formatMoney";
import styles from "./ResultsStage.module.css";

interface FractionProps {
  numerator: number;
  denominator: number;
}

function Fraction({ numerator, denominator }: FractionProps) {
  const isSupported = (num: number, den: number) => {
    if (
      !Number.isInteger(num) ||
      !Number.isInteger(den) ||
      num < 1 ||
      num > 7 ||
      den < 2 ||
      den > 10 ||
      num >= den
    )
      return false;
    if (num === 1) return true; // all valid dens have a num == 1
    if (den === 7 || den >= 9) return false; // dens 7, 9, 10 only have a num == 1
    if (den < 6) return true; // dens below 6 have all remaining nums
    if (den === 6 && num === 5) return true;
    if (den === 8 && num % 2 === 0) return true;
    return false;
  };

  return (
    <span>
      <sup>{numerator}</sup>&frasl;<sub>{denominator}</sub>
    </span>
  );
}

interface TotalRecord extends InputRecord {
  shares: number;
}

interface TotalCardProps {
  name: string;
  records: TotalRecord[];
}

function TotalCard({ name, records }: TotalCardProps) {
  const [collapseDetails, setCollapseDetails] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <CardContainer>
      <Card className={styles.totalCard}>
        <Card.Title className={styles.title}>{name}</Card.Title>

        <div>
          {records.length > 0 && (
            <Collapsible open={!collapseDetails}>
              <div ref={ref} className={styles.details}>
                {records.map(({ item, share, shares }, index) => (
                  <React.Fragment key={`total-${name}-${index}`}>
                    <div>{item.name}</div>
                    <div className={styles.number}>
                      {formatMoney(item.price)}
                    </div>
                    <div>×</div>
                    <div className={styles.number}>
                      {share === shares ? (
                        "1"
                      ) : (
                        <Fraction numerator={share} denominator={shares} />
                      )}
                    </div>
                    <div>=</div>
                    <div className={styles.number}>
                      {formatMoney(item.price * (share / shares))}
                    </div>
                  </React.Fragment>
                ))}
                <div></div>
              </div>
            </Collapsible>
          )}

          <div className={styles.totalLine}>
            <span>total:</span>
            <span>
              {formatMoney(
                records
                  .map((r) => r.item.price * (r.share / r.shares))
                  .reduce((sum, add) => sum + add, 0)
              )}
            </span>
          </div>
        </div>
      </Card>
      {records.length > 0 && (
        <CardActions>
          <CardActions.Button
            label={collapseDetails ? "expand" : "collapse"}
            onClick={() => setCollapseDetails((state) => !state)}
          />
        </CardActions>
      )}
    </CardContainer>
  );
}

interface ResultsProps {
  backFn: () => void;
  againFn: () => void;
}

export default function ResultsStage({ backFn, againFn }: ResultsProps) {
  const { names, inputRecords } = useAppState();

  const itemSharesMap = inputRecords.reduce((acc, { item, share }) => {
    const prev = acc.get(item) ?? 0;
    acc.set(item, prev + share);
    return acc;
  }, new Map<UniqueItem, number>());

  const getTotalsByName = (name: string) =>
    inputRecords
      .filter((r) => r.name === name && r.share > 0)
      .reduce((acc, r) => {
        return [...acc, { ...r, shares: itemSharesMap.get(r.item) ?? r.share }];
      }, [] as TotalRecord[]);

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
        {names.map((name, index) => (
          <TotalCard
            key={`total-card-${index}`}
            name={name}
            records={getTotalsByName(name)}
          />
        ))}
      </div>
    </StageContainer>
  );
}
