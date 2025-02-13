import { useState } from "react";

function JoinRoom({ onJoin }: { onJoin: (username: string) => void }) {
    const [username, setUsername] = useState<string>("");
  
    return (
      <div className="h-screen flex justify-center items-center bg-black">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Chat Room</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded mb-4"
          />
          <button
            onClick={() => username && onJoin(username)}
            className="bg-blue-500 text-white p-3 rounded w-full hover:bg-blue-600"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  export default JoinRoom;