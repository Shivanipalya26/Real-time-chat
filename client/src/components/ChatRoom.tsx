import { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";

function ChatRoom({ username }: { username: string }) {
  const [messages, setMessages] = useState<{ message: string; sender: string }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const WS_URL = import.meta.env.VITE_WS_URL

  useEffect(() => {
    if (wsRef.current) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "join",
            payload: { roomId: "red", username },
          })
        );
      };

    ws.onmessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
    
            if (data.type === "chat") {
              setMessages((m) => [...m, data.payload]);
            }
          } catch (error) {
            console.error("Invalid message format:", event.data, " ", error);
          }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);
    
    wsRef.current = ws;

    return () => {
      ws.onclose = (event) => {
        console.warn("WebSocket disconnected:", event);
      };
    };
  }, [username]);

  const sendMessage = () => {
    if (!inputRef.current || !wsRef.current) return;
    const message = inputRef.current.value.trim();
    if (!message) return;
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: { message, sender: username },
      })
    );
    inputRef.current.value = "";
  };

  return (
    <div className="h-screen bg-black">
        <NavBar />
      <div className="h-[80vh] p-8 overflow-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mt-4 flex ${
              msg.sender === username ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`p-3 pr-5 pl-5 rounded text-white ${
                msg.sender === username ? "bg-blue-500" : "bg-green-500"
              }`}
            >
              <strong>{msg.sender}: </strong> {msg.message}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full flex">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message"
          className="ml-4 text-black bg-white flex-1 px-3 py-2 border rounded-lg text-sm resize-none h-12 overflow-y-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm ml-2 mr-4 hover:bg-purple-700"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
