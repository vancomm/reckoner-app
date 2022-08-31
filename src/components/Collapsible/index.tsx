import { useRef } from "react";
import styles from "./Collapsible.module.css";

interface CollapsibleProps {
  open: boolean;
  children?: React.ReactNode;
}

export default function Collapsible({ open, children }: CollapsibleProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={styles.collapsible}
      style={
        open ? { height: `${ref.current?.scrollHeight}px` } : { height: "0" }
      }
    >
      {children}
    </div>
  );
}
