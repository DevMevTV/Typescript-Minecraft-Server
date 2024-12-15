import * as serverPropeties from "./serverPropeties";
import { createServer, Socket } from "net";
import { VarInt } from "./datatypes";
import { ConnectionStates, Player, Players } from "./player";
import { Handshake } from "./protocol/handshake";
import { Status } from "./protocol/status/serverbound/status";
import { Login } from "./protocol/login/serverbound/login";
import { log } from "./logApi";
import { Configuration } from "./protocol/configuration/serverbound/configuration";
import { Play } from "./serverbound/play/play";
import { SystemChatMessage } from "./clientbound/play/system_chat_message";

new serverPropeties.server("../config.json");

const server = createServer((socket: Socket) => {
  socket.setNoDelay(true);
  Players.ConnectedPlayers.set(socket, new Player(socket) );

  socket.on("data", (clientData: Buffer) => {
    try {
      processBuffer(socket, clientData);
    } catch {}
  });

  socket.on("end", () => {
    if (Players.ConnectedPlayers.get(socket).NextState == ConnectionStates.Play) {
        SystemChatMessage.send("§e" + Players.ConnectedPlayers.get(socket).username + " left the game");
        log(Players.ConnectedPlayers.get(socket).username + " left the game", "SERVER");
    }
    Players.ConnectedPlayers.get(socket).end();
    Players.ConnectedPlayers.delete(socket);
  });

  socket.on("error", () => {});
});

server.listen(
  serverPropeties.server.serverPort,
  serverPropeties.server.serverAdress,
  () => {
    log(`Server running on port ${serverPropeties.server.serverPort}`, "SERVER");
  }
);

const processBuffer = (socket: Socket, buffer: Buffer) => {
  const length = VarInt.decode(buffer);
  let returnBuffer: Buffer = VarInt.encode(length.value);

  returnBuffer = buffer.subarray(length.size, length.value + length.size);

  global.packetIdOffset = length.size;
  handlePacket(socket, returnBuffer);

  if (length.value + length.size !== buffer.length) {
    processBuffer(
      socket,
      buffer.subarray(length.value + length.size, buffer.length)
    );
  }
};

const handlePacket = (client: Socket, buffer: Buffer) => {

  const player = Players.ConnectedPlayers.get(client);
  switch (player.NextState) {
    case ConnectionStates.Handshake:
      Handshake.handle(player, buffer);
      break;
    case ConnectionStates.Status:
      Status.handle(player, buffer);
      break;
    case ConnectionStates.Login:
      Login.handle(player, buffer);
      break;
    case ConnectionStates.Configuration:
      Configuration.handle(player, buffer);
      break;
    case ConnectionStates.Play:
      Play.handle(player, buffer);
      break;
    case ConnectionStates.Disconnect:
      break;
  }
};