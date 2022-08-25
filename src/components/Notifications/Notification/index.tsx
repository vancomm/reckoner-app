import { ReactComponent as Cross } from "../../../assets/icons/cross.svg";

interface NotificationProps {
  message: string;
}

export default function Notification({ message }: NotificationProps) {
  return (
    <div className="notification">
      {message}
      <Cross
        fill="white"
        width="13px"
        height="13px"
        transform="translateY(2px)"
      />
    </div>
  );
}
