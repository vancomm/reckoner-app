import cn from "classnames";
import { ReactComponent as Cross } from "../../assets/icons/cross.svg";
import { Customizable } from "../../types/Customizable";

interface CrossIconProps extends Customizable {}

export default function CrossIcon({ id, className, style }: CrossIconProps) {
  return <Cross id={id} className={cn("cross", className)} style={style} />;
}
