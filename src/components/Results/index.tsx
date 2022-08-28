import { AssignedItem } from "../ItemsForm";
import StageContainer from "../StageContainer";

interface ResultsProps {
  items: AssignedItem[];
  backFn: () => void;
  againFn: () => void;
}

export default function Results({ items, backFn, againFn }: ResultsProps) {
  const totals = items.reduce((acc, { sum, owners }) => {
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
