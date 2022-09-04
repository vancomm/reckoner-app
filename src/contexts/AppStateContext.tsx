import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { get, set } from "../helpers/cacheHelper";
import { handleOption } from "../utils/Optional";
import { UniqueItem } from "../utils/parseReceiptDocument";

export interface ReceiptData {
  items: UniqueItem[];
}

export type Result = Record<string, string[]>;

export type Distribution = Record<string, number>;

export type DistributionMap = Map<UniqueItem, Distribution>;

export interface InputRecord {
  item: UniqueItem;
  name: string;
  share: number;
}

interface UIState {
  showManual: boolean;
  setShowManual: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AppStateInterface {
  names: string[];
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
  receiptData?: ReceiptData;
  setReceiptData: React.Dispatch<React.SetStateAction<ReceiptData | undefined>>;
  inputRecords: InputRecord[];
  setInputRecords: React.Dispatch<React.SetStateAction<InputRecord[]>>;
  uiState: UIState;
}

const AppStateContext = createContext<AppStateInterface>(
  {} as AppStateInterface
);

interface StateProviderProps {
  children: React.ReactNode;
}

export function AppStateProvider({ children }: StateProviderProps) {
  const [initialized, setInitialized] = useState(false);

  const [names, setNames] = useState<string[]>([]);

  const saveNames = (value: React.SetStateAction<string[]>) => {
    setNames(value);
    setInputRecords([]);
  };

  const [receiptData, setReceiptData] = useState<ReceiptData>();

  const saveReceiptData = (
    value: React.SetStateAction<ReceiptData | undefined>
  ) => {
    setReceiptData(value);
    setInputRecords([]);
  };

  const [inputRecords, setInputRecords] = useState<InputRecord[]>([]);

  const [showManual, setShowManual] = useState(false);

  const uiState: UIState = useMemo(
    () => ({ showManual, setShowManual }),
    [showManual]
  );

  const value = useMemo(
    () => ({
      names,
      setNames: saveNames,
      receiptData,
      setReceiptData: saveReceiptData,
      inputRecords,
      setInputRecords,
      uiState,
    }),
    [names, receiptData, inputRecords, uiState]
  );

  const init = async () =>
    Promise.all([
      get("names").then(handleOption(setNames)),
      get("showManual").then(
        handleOption(
          (value) => setShowManual(value),
          () => {
            setShowManual(true);
            set("showManual", true);
          }
        )
      ),
    ]);

  useEffect(() => {
    init().then(() => setInitialized(true));
  }, []);

  useEffect(() => {
    if (initialized) set("names", names); // otherwise dafault value [] overwrites cache
  }, [initialized, names]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => useContext(AppStateContext);
