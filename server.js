import { log } from "console";
import fs from "node:fs/promises";
import path from "node:path";
import http from "http";
import { WebSocketServer } from "ws";

const PORT = 9000;

const httpserver = http.createServer(async function (req, res) {
  try {
    const indexfile = await fs.readFile(path.resolve("./index.html"), "utf-8");
    // FIXED: Changed res.setHeaders to res.setHeader
    res.setHeader("Content-Type", "text/html");
    return res.end(indexfile);
  } catch (error) {
    res.statusCode = 500;
    return res.end("Error loading index.html");
  }
});

const ws_server = new WebSocketServer({ server: httpserver });

// The parameter 'socket' represents the unique connection to a specific client
ws_server.on("connection", (socket) => {
  console.log("websocket connection established");

  // FIXED: Listen for messages on the specific client 'socket', not 'ws_server'
  socket.on("message", (data) => {
    console.log("message received:", data.toString());
    ws_server.clients.forEach((client) => {
      client.send(data.toString());
    });
  });
});

httpserver.listen(PORT, () => {
  console.log(`server works, running on http://localhost:${PORT}`);
});
