import Ajv from "ajv";
import ReceiptData from "../types/ReceiptData";
import ReceiptDocument from "../types/ReceiptDocument";
import { makeFailed, makeSuccessful, Optional } from "./Optional";
import receiptSchema from "./ReceiptSchema.json";

const ajv = new Ajv();

const validate = ajv.compile<ReceiptDocument>(receiptSchema);

export default function parseReceipt(json: string): Optional<ReceiptData> {
  const data = JSON.parse(json);

  if (!validate(data)) return makeFailed("Bad JSON format");

  const value: ReceiptData = { items: data[0].ticket.document.receipt.items };

  return makeSuccessful(value);
}
