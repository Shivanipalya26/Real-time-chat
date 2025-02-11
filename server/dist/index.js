"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 5000 });
let allSockets = [];
let userCount = 0; // Track users
wss.on("connection", (socket) => {
    userCount++;
    const username = `User${userCount}`; // Assign User1, User2, etc.
    console.log(`${username} connected.`);
    socket.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            // Handle "join" messages
            if (parsedMessage.type === "join") {
                const roomId = parsedMessage.payload.roomId || "default";
                allSockets.push({ socket, room: roomId, username });
                console.log(`${username} joined room: ${roomId}`);
                // Send back the assigned username to the client
                socket.send(JSON.stringify({ type: "assignUsername", payload: { username } }));
                return;
            }
            // Handle "chat" messages
            if (parsedMessage.type === "chat") {
                const currentUser = allSockets.find(user => user.socket === socket);
                if (!currentUser)
                    return;
                const currentUserRoom = currentUser.room;
                allSockets.forEach((user) => {
                    if (user.room === currentUserRoom) {
                        user.socket.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                message: parsedMessage.payload.message,
                                sender: currentUser.username // Send User1, User2, etc.
                            }
                        }));
                    }
                });
            }
        }
        catch (err) {
            console.error("Error parsing message:", err);
        }
    });
    // Handle user disconnection
    socket.on("close", () => {
        allSockets = allSockets.filter((client) => client.socket !== socket);
        console.log(`${username} disconnected. Remaining users: ${allSockets.length}`);
    });
});
wss.on("error", (err) => {
    console.error("WebSocket server error:", err);
});
console.log("WebSocket server running on ws://localhost:8080");
