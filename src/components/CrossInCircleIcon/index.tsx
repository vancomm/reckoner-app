import { ReactComponent as CrossInCircle } from "../../assets/icons/cross-in-circle.svg";

interface CrossInCircleIconProps {
  width: string;
  height: string;
}

export default function CrossInCircleIcon({
  width,
  height,
}: CrossInCircleIconProps) {
  return (
    <CrossInCircle className="cross-in-circle" width={width} height={height} />
  );
}
