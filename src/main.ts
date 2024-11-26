import { createServer, Socket } from "net";
import { log, error } from "./logApi"
import { handlePacket } from "./network/handle_packet";
import { PORT } from "./config";

const server = createServer((socket: Socket) => {

  socket.on("data", (clientData: Buffer) => {
    handlePacket(clientData, socket);
  });

  socket.on("end", () => {
    
  });

  socket.on("error", (err) => {
    error("Socket error: " + err, "SERVER");
  });
});

log("Starting server...", "SERVER")
server.listen(PORT, "0.0.0.0", () => {
  log("Server running on port 25565", "SERVER")
});