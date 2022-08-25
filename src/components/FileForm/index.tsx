import { useState } from "react";
import ReceiptData from "../../types/ReceiptData";
import parseReceipt from "../../utils/parseReceiptDocument";

interface FileFormProps {
  submitFn: (receiptDocument: ReceiptData) => any;
}

export default function FileForm({ submitFn }: FileFormProps) {
  const [file, setFile] = useState<File>();

  return (
    <div className="container">
      <span className="title">Receipt</span>
      <div className="file-form">
        <input
          className="file-input"
          type="file"
          accept="application/json"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
        <button
          className="next-btn"
          disabled={!file || file.type !== "application/json"}
          onClick={async (e) => {
            e.currentTarget.blur();
            if (!file || file.type !== "application/json") return;

            const content = await file.text();

            const receiptOption = parseReceipt(content);

            if (!receiptOption.success) {
              alert(receiptOption.message);
              return;
            }

            submitFn(receiptOption.value);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
