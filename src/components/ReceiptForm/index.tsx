import cn from "classnames";
import { useState } from "react";
import { useAppState } from "../../contexts/AppStateContext";
import parseReceipt, { UniqueItem } from "../../utils/parseReceiptDocument";
import StageContainer from "../StageContainer";

interface ReceiptFormProps {
  nextFn: () => void;
}

export default function ReceiptForm({ nextFn }: ReceiptFormProps) {
  const { receiptData, setReceiptData } = useAppState();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <StageContainer
      handleNext={() => {
        nextFn();
      }}
      nextCondition={!!receiptData}
    >
      <div className="file-form">
        <span className="title">File Upload</span>
        <span className="instructions">
          Upload a JSON file containing the receipt.
        </span>
        <input
          className="file-input"
          type="file"
          accept="application/json"
          onChange={async (e) => {
            const inputFile = e.target.files?.[0];
            if (!inputFile) return;
            if (inputFile.type !== "application/json") {
              setReceiptData(undefined);
              setErrorMessage("Uploaded file must be of JSON format");
              return;
            }
            const content = await inputFile.text();
            const receiptDataOption = parseReceipt(content);
            if (!receiptDataOption.success) {
              setReceiptData(undefined);
              setErrorMessage(receiptDataOption.message);
              return;
            }

            const { items } = receiptDataOption.value;
            const uniqueItems: UniqueItem[] = items.map((item, index) => ({
              ...item,
              index,
            }));
            setReceiptData({ items: uniqueItems });
            setErrorMessage("");
          }}
        />

        {errorMessage && (
          <div
            className={cn("message", {
              success: !!receiptData,
              error: !receiptData,
            })}
          >
            {errorMessage}
          </div>
        )}

        {receiptData && (
          <div className="message success">
            {`Detected a receipt for ${receiptData.items.length} items`}
          </div>
        )}
      </div>
    </StageContainer>
  );
}
