"use client";

import { SummarySkeleton } from "@/components/skeleton/summarize-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SummaryI } from "@/interface/resume.interface";
import { Play } from "lucide-react";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<SummaryI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!input) return;
    setIsLoading(true);
    const res = await fetch("/api/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: input }),
    });
    const data: {
      summary: SummaryI[];
      error: string;
    } = await res.json();

    if (data?.summary?.length > 0) {
      setMessages(data.summary);
    } else {
      setMessages([]);
      setError(data.error);
      console.error("Error fetching transcript front");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Play className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold">MVS</span>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">My Video Summarizer</h1>
        <p className="text-xl mb-12 max-w-2xl mx-auto">
          Quickly summarize any YouTube video. Just paste the URL below and let
          our AI do the rest!
        </p>
        <div className="max-w-xl mx-auto flex space-x-4">
          <Input
            type="url"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Paste YouTube URL here"
            className="flex-grow focus-visible:ring-0 focus-visible:ring-offset-0  bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
          <Button
            onClick={() => handleSubmit()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Summarize
          </Button>
        </div>
        {isLoading && (
          <div className="max-w-2xl mt-8 mx-auto">
            <SummarySkeleton />
          </div>
        )}
        {!isLoading && messages.length > 0 && (
          <div className="max-w-2xl mt-8 mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
            <h2 className="text-2xl font-semibold mb-4">Video Summary</h2>
            {messages.map((message, index) => (
              <div key={index} className="h-40 overflow-y-auto">
                <p>
                  From: {message.from} To: {message.to}
                </p>
                <p className="text-gray-300">{message.text}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
