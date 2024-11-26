import { createServer, Socket } from "net";
import { log, error } from "./logApi"
import { handlePacket } from "./network/handle_packet";
import { PORT } from "./config";

const server = createServer((socket: Socket) => {
  log("Socket detected", "SERVER");

  socket.on("data", (clientData: Buffer) => {
    handlePacket(clientData, socket);
  });

  socket.on("end", () => {
    log("Client disconnected", "SERVER");
  });

  socket.on("error", (err) => {
    error("Socket error: " + err, "SERVER");
  });
});

log("Starting server...", "SERVER")
server.listen(PORT, "0.0.0.0", () => {
  log("Server running on port 25565", "SERVER")
});