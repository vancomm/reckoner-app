import { ReactComponent as Cross } from "../../assets/icons/cross.svg";

interface CrossIconProps {
  width: string;
  height: string;
}

export default function CrossIcon({ width, height }: CrossIconProps) {
  return <Cross className="cross" width={width} height={height} />;
}
