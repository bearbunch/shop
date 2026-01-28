const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("Backend is awake!"));

const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// WebSocket
const wss = new WebSocketServer({ server });

wss.on("connection", ws => {
  ws.on("message", msg => {
      if (msg.toString() === "ping") { ws.send("pong"); return; }
          wss.clients.forEach(client => { if (client.readyState === 1) client.send(msg.toString()); });
            });
            });

            // === Self-ping every 30 seconds ===
            const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`;
            setInterval(() => {
              http.get(SELF_URL, res => {
                  console.log(`[Self-Ping] Status: ${res.statusCode}`);
                      res.on("data", () => {}); 
                          res.on("end", () => {});
                            }).on("error", err => console.error(`[Self-Ping] Error: ${err.message}`));
                            }, 30 * 1000);
                            