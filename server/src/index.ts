import { WebSocketServer, WebSocket } from "ws";
import dotenv from 'dotenv'

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const wss = new WebSocketServer({ port: PORT });

interface User {
    socket: WebSocket;
    room: string;
    username: string; 
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {

    socket.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());

            if (parsedMessage.type === "join") {
                const { roomId, username } = parsedMessage.payload;
                allSockets.push({ socket, room: roomId, username });
                console.log(`${username} joined room: ${roomId}`);

                socket.send(JSON.stringify({ type: "assignUsername", payload: { username } }));
                return;
            }

            if (parsedMessage.type === "chat") {
                const currentUser = allSockets.find(user => user.socket === socket);
                if (!currentUser) return;

                const currentUserRoom = currentUser.room;

                allSockets.forEach((user) => {
                    if (user.room === currentUserRoom) {
                        user.socket.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                message: parsedMessage.payload.message,
                                sender: currentUser.username 
                            }
                        }));
                    }
                });
            }
        } catch (err) {
            console.error("Error parsing message:", err);
        }
    });

    socket.on("close", () => {
        const disconnectedUser = allSockets.find(user => user.socket === socket)
        allSockets = allSockets.filter((client) => client.socket !== socket);
        console.log(`${disconnectedUser?.username || "Unknown"} disconnected. Remaining users: ${allSockets.length}`);
    });
});

wss.on("error", (err) => {
    console.error("WebSocket server error:", err);
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
