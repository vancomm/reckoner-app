import { useState } from "react";
import cn from "classnames";
import { useAppState } from "../../contexts/AppStateContext";
import StageContainer from "../StageContainer";
import parseReceipt, { UniqueItem } from "../../utils/parseReceiptDocument";
import styles from "./ReceiptStage.module.css";

interface ReceiptStageProps {
  nextFn: () => void;
}

export default function ReceiptStage({ nextFn }: ReceiptStageProps) {
  const [errorMessage, setErrorMessage] = useState("");

  const { receiptData, setReceiptData } = useAppState();

  return (
    <StageContainer
      handleNext={() => {
        nextFn();
      }}
      nextCondition={!!receiptData}
    >
      <div className={styles.fileForm}>
        <span className="title">File Upload</span>
        <span>Upload a JSON file containing the receipt.</span>
        <input
          className={styles.fileInput}
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

        {(errorMessage || receiptData) && (
          <div
            className={cn(styles.message, {
              success: !!receiptData,
              error: !receiptData,
            })}
          >
            {errorMessage ||
              (receiptData &&
                `Detected a receipt for ${receiptData.items.length} items`)}
          </div>
        )}
      </div>
    </StageContainer>
  );
}
