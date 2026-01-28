import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;

// WSS listens on Render-assigned port
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", ws => {
  ws.on("message", msg => {
    // ping/pong keepalive
    if (msg.toString() === "ping") {
      ws.send("pong");
      return;
    }

    // broadcast sales to all clients
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(msg.toString());
      }
    });
  });
});

console.log("WebSocket server running");
