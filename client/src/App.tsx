import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState<{ message: string; sender: string }[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (wsRef.current) return; 

    const ws = new WebSocket("ws://localhost:5000");

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "assignUsername") {
          setUsername(data.payload.username); 
        } else if (data.type === "chat") {
          setMessages((m) => [...m, data.payload]);
        }
      } catch (error) {
        console.error("Invalid message format:", event.data);
      }
    };

    ws.onmessage = handleMessage;
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join", 
        payload: { roomId: "red" }, 
      }));
    };

    wsRef.current = ws;

    return () => {
      ws.onclose = (event) => {
        console.warn("WebSocket disconnected:", event);
      };
    };
  }, []);

  return (
    <div className="h-screen bg-black">
      <div className="h-[90vh] p-8 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mt-4 flex ${msg.sender === username ? "justify-end" : "justify-start"}`}>
            <span className={`p-4 rounded text-white ${msg.sender === username ? "bg-blue-500" : "bg-green-500"}`}>
              <strong>{msg.sender}: </strong> {msg.message}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-white flex">
        <input ref={inputRef} type="text" placeholder="Type a message" className="flex-1 p-4" />
        <button
          onClick={() => {
            if (!inputRef.current || !wsRef.current || !username) return;

            const message = inputRef.current.value.trim();
            if (!message) return;

            wsRef.current.send(JSON.stringify({
              type: "chat",
              payload: { message }
            }));

            inputRef.current.value = "";
          }}
          className="bg-purple-600 text-white p-4"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

export default App;
