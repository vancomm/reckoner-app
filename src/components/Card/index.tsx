import cn from "classnames";
import { Customizable } from "../../types/Customizable";
import { Nestable } from "../../types/Nestable";
import styles from "./Card.module.css";

export interface CardProps extends Customizable, Nestable {}

export default function Card({ id, className, style, children }: CardProps) {
  return (
    <div id={id} className={cn(styles.card, className)} style={style}>
      {children}
    </div>
  );
}

function Title({ id, className, style, children }: CardProps) {
  return (
    <div id={id} className={cn(styles.cardTitle, className)} style={style}>
      {children}
    </div>
  );
}

Card.Title = Title;

function Subtitle({ id, className, style, children }: CardProps) {
  return (
    <div id={id} className={cn(styles.cardSubtitle, className)} style={style}>
      {children}
    </div>
  );
}

Card.Subtitle = Subtitle;

export function CardContainer({ id, className, style, children }: CardProps) {
  return (
    <div id={id} className={cn(styles.cardContainer, className)} style={style}>
      {children}
    </div>
  );
}

export function CardActions({ id, className, style, children }: CardProps) {
  return (
    <div id={id} className={cn(styles.cardActions, className)} style={style}>
      {children}
    </div>
  );
}

interface ButtonProps extends Customizable {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({ id, label, onClick, className, style }: ButtonProps) {
  return (
    <button
      id={id}
      className={cn(styles.button, className)}
      onClick={onClick}
      style={style}
    >
      {label}
    </button>
  );
}

CardActions.Button = Button;

interface ToggleProps extends Customizable {
  active: boolean;
  label: string;
  onClick?: React.ChangeEventHandler<HTMLInputElement>;
}

export function Toggle({
  id,
  active,
  label,
  onClick,
  className,
  style,
}: ToggleProps) {
  return (
    <div className={styles.cardAction}>
      <input
        id={id}
        className={styles.toggleInput}
        type="checkbox"
        value={label}
        checked={active}
        onChange={onClick}
        style={style}
      />
      <label htmlFor={id} className={cn(styles.toggleLabel, className)}>
        {label}
      </label>
    </div>
  );
}

CardActions.Toggle = Toggle;
