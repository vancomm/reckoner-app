import { colors } from "../data/constants";

export default function getColor(i: number) {
  let a = i;
  while (a > colors.length - 1) {
    a -= colors.length;
  }
  return colors[a];
}
