"use client";

import { FormEvent, useState } from "react";

type SummaryI = {
  text: string;
  time: string;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<SummaryI[]>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    const res = await fetch("/api/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages(data.summary);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl py-24 mx-auto stretch ">
      <form className="w-2/3" onSubmit={(e) => handleSubmit(e)}>
        <input
          className="w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
          value={input}
          placeholder="URL"
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <div className="w-2/3">
        {messages &&
          messages.map((message, index: number) => (
            <div key={index} className="mb-4">
              <h3>{message.time}</h3>
              <p>{message.text}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
