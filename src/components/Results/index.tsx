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
      {Object.entries(totals).map(([name, total], index) => {
        return (
          <div key={`total-${index}-${name}`}>
            {name}: {total / 100}
          </div>
        );
      })}
    </StageContainer>
  );
}
