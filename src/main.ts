import * as serverPropeties from "./serverPropeties";
import { createServer, Socket } from "net";
import { ConnectionStates, Player, Players } from "./player";
import { Handshake } from "./protocol/handshake";
import { log } from "./logApi";
import { SystemChatMessage } from "./protocol/play/clientbound/system_chat_message";
import { Protocol } from "./protocol/reports";
import { StatusResponse } from "./protocol/status/clientbound/status_response";
import { StatusPong } from "./protocol/status/clientbound/status_pong";
import { LoginStart } from "./protocol/login/serverbound/start_login";
import { LoginAcknowledged } from "./protocol/login/serverbound/login_acknowledged";
import { KnownPacks } from "./protocol/configuration/clientbound/known_packs";
import { RegistryData } from "./protocol/configuration/clientbound/registry_data";
import { ConfigurationAcknowledged } from "./protocol/configuration/serverbound/configuration_acknowledged";
import { Chat } from "./protocol/play/serverbound/chat";
import { SetPlayerPos } from "./protocol/play/serverbound/set_player_pos";
import { SwingArm } from "./protocol/play/serverbound/swing";
import { RemoveEntities } from "./protocol/play/clientbound/remove_entities";
import { PlayerCommand } from "./protocol/play/serverbound/player_command";
import { PlayerAction } from "./protocol/play/serverbound/player_action";
import { UseItemOn } from "./protocol/play/serverbound/use_item_on";
import { PluginMessage } from "./protocol/configuration/clientbound/plugin_message";
import { PongResponse } from "./protocol/play/clientbound/pong_response";
import { ChatCommand } from "./protocol/play/serverbound/chat_command";
import { Summon } from "./commands/summon";
const readline = require("readline")

new serverPropeties.server("../config.json");

Protocol.init()

const server = createServer((socket: Socket) => {
  socket.setNoDelay(true);
  const player = new Player(socket)
  Players.ConnectedPlayers.set(socket, player );

  socket.on("data", (clientData: Buffer) => {
    try {
      Protocol.handle(player, clientData)
    } catch {}
  });

  socket.on("end", () => {
    if (player.NextState == ConnectionStates.Play) {
      RemoveEntities.send(player.player_entity)
      SystemChatMessage.send("§e" + player.player_entity.getName() + " left the game");
      log(player.player_entity.getName() + " left the game", "SERVER");
      player.player_entity.kill()
    }
    player.end();
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


const rl = readline.createInterface({
  input: process.stdin,
  output: undefined
})

function userInput() {
  rl.question("", (input: string) => {
    if (input == "") {userInput(); return}
    if (input.startsWith("/")) {
      //console.log("command")
    } else {
      SystemChatMessage.send("<Server> " + input)
      log("<Server> " + input, "SERVER")
    }

    userInput()
  })
}

userInput()


// Protocol Stuff
Protocol.DEBUG = false

Protocol.HANDSHAKE("minecraft:intention", Handshake.handle)

Protocol.STATUS("minecraft:status_request", StatusResponse.send)
Protocol.STATUS("minecraft:ping_request", StatusPong.send)

Protocol.LOGIN("minecraft:hello", LoginStart.handle)
Protocol.LOGIN("minecraft:login_acknowledged", LoginAcknowledged.handle)

Protocol.CONFIGURATION("minecraft:custom_payload", PluginMessage.send)
Protocol.CONFIGURATION("minecraft:client_information", KnownPacks.send)
Protocol.CONFIGURATION("minecraft:select_known_packs", RegistryData.send)
Protocol.CONFIGURATION("minecraft:finish_configuration", ConfigurationAcknowledged.send)

Protocol.PLAY("minecraft:client_tick_end", () => {})
Protocol.PLAY("minecraft:chat", Chat.send)
Protocol.PLAY("minecraft:move_player_pos", SetPlayerPos.set_player_position)
Protocol.PLAY("minecraft:move_player_pos_rot", SetPlayerPos.set_player_position_and_rotation)
Protocol.PLAY("minecraft:move_player_rot", SetPlayerPos.set_player_rotation)
Protocol.PLAY("minecraft:player_input", () => {})
Protocol.PLAY("minecraft:pong", () => {})
Protocol.PLAY("minecraft:swing", SwingArm.handle)
Protocol.PLAY("minecraft:player_command", PlayerCommand.handle)
Protocol.PLAY("minecraft:set_carried_item", () => {})
Protocol.PLAY("minecraft:set_creative_mode_slot", () => {})
Protocol.PLAY("minecraft:player_action", PlayerAction.handle)
Protocol.PLAY("minecraft:use_item_on", UseItemOn.handle)
Protocol.PLAY("minecraft:ping_request", PongResponse.send)
Protocol.PLAY("minecraft:chat_command", ChatCommand.handle)

// Command stuff
Summon.init()
ChatCommand.register("summon", new Summon)