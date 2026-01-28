import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;

// WSS listens on Render-assigned port
const wss = new WebSocketServer({ port: PORT });

app.get("/", (req, res) => {
  res.send("Backend is awake!");
});

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

import http from "http";

const SELF_URL = process.env.SELF_URL || "http://shop-1b7l.onrender.com"; // replace with your Render URL in production

setInterval(() => {
  http.get(SELF_URL, res => {
    console.log(`[Self-Ping] Status: ${res.statusCode}`);
    // consume the data so connection closes properly
    res.on("data", () => {});
    res.on("end", () => {});
  }).on("error", err => {
    console.error(`[Self-Ping] Error: ${err.message}`);
  });
}, 30 * 1000); // every 30 seconds
      
