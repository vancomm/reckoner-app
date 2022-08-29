import { useAppState } from "../../contexts/AppStateContext";
import parseReceipt, { UniqueItem } from "../../utils/parseReceiptDocument";
import StageContainer from "../StageContainer";

interface ReceiptFormProps {
  nextFn: () => void;
}

export default function ReceiptForm({ nextFn }: ReceiptFormProps) {
  const { receiptData, setReceiptData } = useAppState();

  return (
    <StageContainer
      handleNext={() => {
        nextFn();
      }}
      nextCondition={!!receiptData}
    >
      <span className="title">Receipt</span>

      <div className="file-form">
        <input
          className="file-input"
          type="file"
          accept="application/json"
          onChange={async (e) => {
            const inputFile = e.target.files?.[0];
            if (!inputFile) return;
            if (inputFile.type !== "application/json") {
              alert("Uploaded file must be of JSON format");
              return;
            }
            const content = await inputFile.text();
            const receiptDataOption = parseReceipt(content);
            if (!receiptDataOption.success) {
              alert(receiptDataOption.message);
              return;
            }

            const { items } = receiptDataOption.value;
            const uniqueItems: UniqueItem[] = items.map((item, index) => ({
              ...item,
              index,
            }));
            setReceiptData({ items: uniqueItems });
          }}
        />
      </div>

      {receiptData && (
        <span className="message">{`Detected a receipt for ${receiptData.items.length} items`}</span>
      )}
    </StageContainer>
  );
}
