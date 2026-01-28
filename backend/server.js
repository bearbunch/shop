import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const PORT = process.env.PORT || 8080;

// HTTP endpoint for ping/self-wake
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

      // Optionally send current orders to new client
        ws.send(JSON.stringify({ type: "INIT", orders }));

          ws.on("message", (msg) => {
              // Ping/pong
                  if (msg === "ping") {
                        ws.send("pong");
                              return;
                                  }

                                      try {
                                            const data = JSON.parse(msg);

                                                  if (data.type === "SALE") {
                                                          // Convert cart into structured order
                                                                  const structuredOrder = {
                                                                            type: "order",
                                                                                      items: Object.values(data.cart).map(i => ({
                                                                                                  name: i.name,
                                                                                                              qty: i.qty,
                                                                                                                          price: i.price
                                                                                                                                    })),
                                                                                                                                              total: data.total,
                                                                                                                                                        timestamp: new Date().toISOString()
                                                                                                                                                                };

                                                                                                                                                                        // Store in memory
                                                                                                                                                                                orders.push(structuredOrder);

                                                                                                                                                                                        // Broadcast structured order to all clients
                                                                                                                                                                                                wss.clients.forEach(client => {
                                                                                                                                                                                                          if (client.readyState === 1) client.send(JSON.stringify(structuredOrder));
                                                                                                                                                                                                                  });
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                            } catch (e) {
                                                                                                                                                                                                                                  console.error("Invalid message:", e);
                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                        // Self-ping every 30 seconds
                                                                                                                                                                                                                                        const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`;
                                                                                                                                                                                                                                        setInterval(() => {
                                                                                                                                                                                                                                          http.get(SELF_URL, (res) => {
                                                                                                                                                                                                                                              console.log(`[Self-Ping] Status: ${res.statusCode}`);
                                                                                                                                                                                                                                                  res.on("data", () => {});
                                                                                                                                                                                                                                                      res.on("end", () => {});
                                                                                                                                                                                                                                                        }).on("error", (err) => console.error(`[Self-Ping] Error: ${err.message}`));
                                                                                                                                                                                                                                                        }, 30 * 1000);
                                                                                                                                                                                                                                                        