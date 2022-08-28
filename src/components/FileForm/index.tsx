import { useState } from "react";
import ReceiptData from "../../types/ReceiptData";
import parseReceipt from "../../utils/parseReceiptDocument";
import StageContainer from "../StageContainer";

interface FileFormProps {
  initReceiptData?: ReceiptData;
  setFn: (receiptData: ReceiptData) => any;
  nextFn: () => void;
}

export default function FileForm({
  initReceiptData,
  setFn,
  nextFn,
}: FileFormProps) {
  const [receiptData, setReceiptData] = useState<ReceiptData | undefined>(
    initReceiptData
  );

  return (
    <StageContainer
      handleNext={() => {
        if (receiptData) setFn(receiptData);
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
            setReceiptData(receiptDataOption.value);
          }}
        />
      </div>

      {receiptData && (
        <span className="message">{`Detected a receipt for ${receiptData.items.length} items`}</span>
      )}
    </StageContainer>
  );
}
