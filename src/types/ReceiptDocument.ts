type ReceiptDocument = ReceiptDocumentItem[];

export default ReceiptDocument;

export interface ReceiptDocumentItem {
  status: number;
  seller: Organization;
  operation: Operation;
  id: string;
  organization: Organization;
  qr: string;
  query: Query;
  ticket: Ticket;
  kind: string;
  createdAt: number;
}

export interface Operation {
  date: number;
  type: number;
  sum: number;
}

export interface Organization {
  name: string;
  inn: string;
}

export interface Query {
  date: string;
  documentId: number;
  fsId: string;
  fiscalSign: string;
  operationType: number;
  sum: number;
}

export interface Ticket {
  document: Document;
}

export interface Document {
  receipt: Receipt;
}

export interface Receipt {
  retailPlace: string;
  totalSum: number;
  operator: string;
  userInn: string;
  items: Item[];
  code: number;
  ecashTotalSum: number;
  requestNumber: number;
  fiscalDriveNumber: string;
  shiftNumber: number;
  kktRegId: string;
  provisionSum: number;
  nds18: number;
  dateTime: number;
  retailPlaceAddress: string;
  fiscalSign: number;
  user: string;
  prepaidSum: number;
  cashTotalSum: number;
  fiscalDocumentNumber: number;
  operationType: number;
  fiscalDocumentFormatVer: number;
  creditSum: number;
  taxationType: number;
  nds10: number;
}

export interface Item {
  quantity: number;
  productType: number;
  nds: number;
  price: number;
  paymentType: number;
  name: string;
  sum: number;
}
