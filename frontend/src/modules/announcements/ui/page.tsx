"use client";

import { useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useMessageUpdates } from "../hooks/useMessageUpdates";

export default function MessagesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMessages(page);

  useMessageUpdates(page);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Messages</h1>

      <ul>
        {data?.content.map((msg) => (
          <li key={msg.id}>
            {msg.createdByName}: {msg.content}
          </li>
        ))}
      </ul>

      <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
        Prev
      </button>

      <button disabled={data?.last} onClick={() => setPage((p) => p + 1)}>
        Next
      </button>
    </div>
  );
}