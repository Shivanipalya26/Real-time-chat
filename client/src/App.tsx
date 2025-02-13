import { useState } from "react";
import JoinRoom from "./components/JoinRoom";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [username, setUsername] = useState<string | null>(null);

  return username ? (
    <ChatRoom username={username} />
  ) : (
    <JoinRoom onJoin={setUsername} />
  );
}

export default App;
