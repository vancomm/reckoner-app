import { useState } from "react";

interface UsersFormProps {
  submitFn: (names: string[]) => any;
}

export default function UsersForm({ submitFn }: UsersFormProps) {
  const [users, setUsers] = useState<string[]>([""]);

  return (
    <div className="container">
      <span className="title">Users</span>
      <div className="user-form">
        {users.map((name, index) => (
          <input
            key={index}
            type="text"
            className="user-input"
            value={name}
            placeholder="Enter name..."
            onChange={(e) => {
              const { value } = e.target;
              setUsers((state) =>
                state.map((v, i) => (i === index ? value : v))
              );
              if (index === users.length - 1) {
                setUsers((state) => [...state, ""]);
              }
            }}
            onBlur={(e) => {
              const { value } = e.target;
              if (value === "" && index !== users.length - 1) {
                setUsers((state) => state.filter((v, i) => i !== index));
              }
            }}
          />
        ))}
        <button
          className="next-btn"
          disabled={users.filter((n) => n !== "").length === 0}
          onClick={() => submitFn(users.filter((n) => n !== ""))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
