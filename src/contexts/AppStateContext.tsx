import { createContext, useState, useMemo, useContext } from "react";
import { UniqueItem } from "../utils/parseReceiptDocument";

export interface ReceiptData {
  items: UniqueItem[];
}

export type Result = Record<string, string[]>;

interface StateInterface {
  names: string[];
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
  receiptData?: ReceiptData;
  setReceiptData: React.Dispatch<React.SetStateAction<ReceiptData | undefined>>;
  result: Result;
  setResult: React.Dispatch<React.SetStateAction<Result>>;
}

const AppStateContext = createContext<StateInterface>({} as StateInterface);

// const debugNames = ["Vanya", "Sanya"]; // debugging purposes only

const initResult = {};

interface StateProviderProps {
  children: React.ReactNode;
}

export function StateProvider({ children }: StateProviderProps) {
  const [names, setNames] = useState<string[]>([]);
  const [receiptData, setReceiptData] = useState<ReceiptData>();
  const [result, setResult] = useState<Result>(initResult);

  const saveNames = (value: React.SetStateAction<string[]>) => {
    setNames(value);
    setResult({});
  };

  const saveReceiptData = (
    value: React.SetStateAction<ReceiptData | undefined>
  ) => {
    setReceiptData(value);
    setResult({});
  };

  const value = useMemo(
    () => ({
      names,
      receiptData,
      result,
      setNames: saveNames,
      setReceiptData: saveReceiptData,
      setResult,
    }),
    [names, receiptData, result]
  );

  // const init = async () => {
  //   const cachedNames = await get("names");
  //   if (!isSuccessful(cachedNames)) {
  //     setNames(debugNames);
  //     return;
  //   }
  //   setNames(cachedNames.value);
  // };

  // useEffect(() => {
  //   init();
  // }, []);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => useContext(AppStateContext);
