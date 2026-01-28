import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const PORT = process.env.PORT || 8080;

// HTTP endpoint for ping/wake
app.get("/", (req, res) => res.send("Backend is awake!"));

// Start HTTP server
const server = app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
  );

  // Store orders in memory
  let orders = [];

  // WebSocket server
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

      // Send existing orders on new connection if needed
        ws.send(JSON.stringify({ type: "INIT", orders }));

          ws.on("message", (msg) => {
              // Ping/pong to keep connection alive
                  if (msg === "ping") {
                        ws.send("pong");
                              return;
                                  }

                                      // Parse order
                                          try {
                                                const data = JSON.parse(msg);
                                                      if (data.type === "SALE") {
                                                              orders.push(data); // store in memory

                                                                      // Broadcast sale to all clients
                                                                              wss.clients.forEach((client) => {
                                                                                        if (client.readyState === 1) client.send(JSON.stringify(data));
                                                                                                });
                                                                                                      }
                                                                                                          } catch (e) {
                                                                                                                console.error("Invalid message:", e);
                                                                                                                    }
                                                                                                                      });
                                                                                                                      });

                                                                                                                      // Self-ping every 30 seconds to stay awake
                                                                                                                      const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`;
                                                                                                                      setInterval(() => {
                                                                                                                        http.get(SELF_URL, (res) => {
                                                                                                                            console.log(`[Self-Ping] Status: ${res.statusCode}`);
                                                                                                                                res.on("data", () => {});
                                                                                                                                    res.on("end", () => {});
                                                                                                                                      }).on("error", (err) => console.error(`[Self-Ping] Error: ${err.message}`));
                                                                                                                                      }, 30 * 1000);
                                                                                                                                      