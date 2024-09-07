"use client";

import { SummarySkeleton } from "@/components/skeleton/summarize-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SummaryI } from "@/interface/resume.interface";
import { msToTime } from "@/utils/utility";
import { AlertCircle, Linkedin } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Logo from "@/assets/logo.jpg";
import Image from "next/image";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<SummaryI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<string>("english");

  const handleSubmit = async () => {
    if (!input) return;
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: input, language: language }),
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
      }
    } catch (error) {
      setMessages([]);
      setError("An error occurred while fetching the summary.");
      // eslint-disable-next-line no-console
      console.error("Error fetching transcript:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="Logo"
              className="h-8 w-8 rounded-md text-purple-400"
            />
            <span className="text-lg font-semibold">Nova Pixely</span>
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Ai Youtube Summary</h1>
        <p className="text-xl mb-12 max-w-2xl mx-auto">
          Quickly summarize any YouTube video. Just paste the URL below and let
          our AI do the rest!
        </p>
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <Input
            type="url"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Paste YouTube URL here"
            className="flex-grow focus-visible:ring-0 focus-visible:ring-offset-0  bg-white/10 border-white/20 text-white placeholder-gray-400"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full sm:w-[180px] bg-purple-900 border border-white/20 text-white rounded-md px-3 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="italian">Italian</option>
          </select>
        </div>
        <Button
          onClick={() => handleSubmit()}
          className="bg-purple-600 hover:bg-purple-700">
          Summarize
        </Button>
        {isLoading && (
          <div className="max-w-2xl mt-8 mx-auto">
            <SummarySkeleton />
          </div>
        )}
        {error && (
          <div className="max-w-2xl mx-auto mt-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || "Something went wrong. Please try again later."}
              </AlertDescription>
            </Alert>
          </div>
        )}
        {!isLoading && messages.length > 0 && (
          <div className="max-w-2xl mt-8 mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
            <h2 className="text-2xl font-semibold mb-4">Video Summary</h2>
            {messages.map((message, index) => (
              <div className="mt-4" key={index}>
                <p>
                  From: {msToTime(+message.from)} To: {msToTime(+message.to)}
                </p>
                <p className="text-gray-300">{message.text}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="mt-auto border-t border-white/10 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src={Logo}
                alt="Footer logo"
                className="h-6 w-6 rounded-md text-purple-400"
              />
              <span className="text-lg font-semibold">Nova Pixely</span>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="https://github.com/AkianJS"
                target="_blank"
                className="text-white fill-white hover:fill-black transition-colors">
                <svg
                  className="h-6 w-6"
                  role="img"
                  color="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/gonzajs-romero/"
                target="_blank"
                className="text-white hover:text-blue-500 transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">Linkedin</span>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            © 2024 Nova Pixely. Licensed under MIT.
          </div>
        </div>
      </footer>
    </div>
  );
}
