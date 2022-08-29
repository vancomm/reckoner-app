import { Fragment } from "react";
import { useAppState } from "../../contexts/AppStateContext";
import { UniqueItem } from "../../utils/parseReceiptDocument";
import StageContainer from "../StageContainer";

interface AssignedItem extends UniqueItem {
  owners: string[];
}

interface ResultsProps {
  backFn: () => void;
  againFn: () => void;
}

export default function Results({ backFn, againFn }: ResultsProps) {
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
      customButtons={[
        {
          label: "Again",
          onClick: againFn,
          className: "again-btn",
        },
      ]}
    >
      <span className="title">Results</span>
      <div className="totals-container">
        <div className="totals">
          {Object.entries(totals)
            .sort(([, totalA], [, totalB]) => totalB - totalA)
            .map(([name, total], index) => {
              return (
                <Fragment>
                  {index > 0 && <hr />}
                  <div className="total" key={`total-${index}-${name}`}>
                    <span className="name">
                      {name}
                      {": "}
                    </span>
                    <span className="value">
                      {(
                        Math.round(+(total / 100).toFixed(3) * 1e3) / 1e3
                      ).toFixed(2)}
                    </span>
                  </div>
                </Fragment>
              );
            })}
        </div>
      </div>
    </StageContainer>
  );
}
