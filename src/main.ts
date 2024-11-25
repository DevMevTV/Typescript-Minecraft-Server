import { createServer, Socket } from "net";
import { log, error } from "./logApi"
import { config } from "dotenv";

config();
const PORT: number = parseInt(process.env.PORT);
const VERSION: string = process.env.VERSION;
const PROTOCOL_VERSION: number = parseInt(process.env.PROTOCOL_VERSION);
const MOTD: string = process.env.MOTD;
const MAX_PLAYERS: number = parseInt(process.env.MAX_PLAYERS);

enum PacketIDs {
  LegacyPing = 0xFE,
  StatusRequest = 0x10,
  PingRequest = 0x01
}

const handlePacket = (packet: Buffer, socket: Socket) => {
  const packetId = packet[0];
  log(`Received packet with ID: 0x${packetId.toString(16)}`, "SERVER");

  if (packetId === PacketIDs.LegacyPing) {
    log("Legacy ping detected", "SERVER");
    handleLegacyPing(socket);
  } else if (packetId === PacketIDs.StatusRequest) {
    log("Modern status request detected", "SERVER");
    handleStatusRequest(socket);
  } else if (packetId === PacketIDs.PingRequest) {
    log("Ping request detected", "SERVER");
    handlePingRequest(packet, socket);
  } else {
    log(`Unexpected packet ID: 0x${packetId.toString(16)}`, "SERVER");
    // Further debug information if needed
    log("Received data: " + packet, "SERVER");
  }
};

const handleStatusRequest = (socket: Socket) => {
  const statusResponse = {
    version: {
      name: VERSION,
      protocol: PROTOCOL_VERSION,
    },
    players: {
      max: MAX_PLAYERS,
      online: 2,
      sample: [
        { name: "Steve", id: "8667ba71-b85a-4004-af54-457a9734eed7" },
        { name: "Alex", id: "7a3f575e-c85f-4ff2-92da-dc18a78cb7465" },
      ],
    },
    description: {
      text: MOTD,
    },
    enforcesSecureChat: false,
  };

  const jsonString = JSON.stringify(statusResponse);
  const jsonBuffer = Buffer.from(jsonString, "utf-8");

  const packetIdBuffer = Buffer.from([0x00]); // Packet ID (0x00)
  const jsonLengthBuffer = encodeVarInt(jsonBuffer.length); // Length of JSON response
  const fullDataBuffer = Buffer.concat([packetIdBuffer, jsonLengthBuffer, jsonBuffer]);

  const lengthBuffer = encodeVarInt(fullDataBuffer.length); // Total packet length
  const responseBuffer = Buffer.concat([lengthBuffer, fullDataBuffer]);

  socket.write(responseBuffer, (err) => {
    if (err) {
      error(`Failed to send status response: ${err}`, "SERVER");
    } else {
      log("Modern status response sent!", "SERVER");
    }
  });
};

const handleLegacyPing = (socket: Socket) => {
  const protocolVersion = PROTOCOL_VERSION;
  const serverVersion = VERSION;
  const motd = MOTD;
  const currentPlayers = 10;
  const maxPlayers = MAX_PLAYERS;

  const responseString = `§1\0${protocolVersion}\0${serverVersion}\0${motd}\0${currentPlayers}\0${maxPlayers}`;

  const utf16Response: number[] = [];
  for (const char of responseString) {
    const codeUnit = char.charCodeAt(0);
    utf16Response.push((codeUnit >> 8) & 0xff, codeUnit & 0xff);
  }

  const length = utf16Response.length / 2;
  const response = Buffer.concat([
    Buffer.from([0xff]),
    Buffer.from([(length >> 8) & 0xff, length & 0xff]),
    Buffer.from(utf16Response),
  ]);

  socket.write(response, (err) => {
    if (err) {
      error("Failed to send legacy ping response: " + err, "SERVER");
    } else {
      log("Final packet buffer: " + response, "SERVER");
      log("Legacy ping response sent!", "SERVER");
    }
  });
};

const handlePingRequest = (packet: Buffer, socket: Socket) => {
  log("Handling ping request...", "SERVER");
  const payload = packet.slice(1);
  const response = Buffer.concat([Buffer.from([0x01]), payload]);

  log("Pong response constructed, sending...", "SERVER");
  socket.write(response, (err) => {
    if (err) {
      error("Failed to send pong response: " + err, "SERVER");
    } else {
      log("Pong response sent!", "SERVER");
    }
  });
};

const encodeVarInt = (value: number): Buffer => {
  const buffer: number[] = [];
  let more = true;
  while (more) {
    let temp = value & 0x7F;
    value >>>= 7;
    if (value !== 0) temp |= 0x80;
    buffer.push(temp);
    more = value !== 0;
  }
  return Buffer.from(buffer);
};

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