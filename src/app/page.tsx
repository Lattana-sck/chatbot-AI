"use client";
import { useState } from "react";

export default function Home() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Yo, this is ChatterBot! How can I help you today?",
    },
  ]);

  const callGetResponse = async () => {
    setIsLoading(true);

    // Utilisez setMessages avec une fonction pour garantir l'immutabilité de l'état
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: theInput },
    ]);

    setTheInput("");
    console.log("Calling OpenAI...");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const { output } = data;
      console.log("OpenAI replied...", output.content);

      setMessages((prevMessages) => [...prevMessages, output]);
    } catch (error) {
      console.error("Error calling OpenAI API:", error.message);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      callGetResponse();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-5">
      <h1 className="text-5xl font-sans">ChatterBot</h1>

      <div className="flex h-[35rem] w-[40rem] flex-col items-center bg-gray-600 rounded-xl">
        <div className="h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
          {messages.map((e, index) => (
            <div
              key={index} // Utilisez l'index comme clé uniquement si les messages n'ont pas d'identifiant unique
              className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${
                e.role === "assistant"
                  ? "self-start bg-gray-200 text-gray-800"
                  : "self-end bg-gray-800 text-gray-50"
              }`}
            >
              {e.content}
            </div>
          ))}

          {isLoading && (
            <div className="self-start bg-gray-200 text-gray-800 w-max max-w-[18rem] rounded-md px-4 py-3 h-min">
              *thinking*
            </div>
          )}
        </div>
        <div className="relative w-[80%] bottom-4 flex justify-center">
          <textarea
            value={theInput}
            onChange={(event) => setTheInput(event.target.value)}
            className="w-[85%] h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
            onKeyDown={handleKeyPress} // Renommé la fonction pour plus de clarté
          />
          <button
            onClick={callGetResponse}
            className="w-[15%] bg-blue-500 px-4 py-2 rounded-r"
          >
            send
          </button>
        </div>
      </div>

      <div></div>
    </main>
  );
}
