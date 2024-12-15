import { KnownPacks } from "../clientbound/known_packs";
import { RegistryData } from "../clientbound/registry_data";
import { ConnectionStates, Player, Players } from "../../../player";
import { Login } from "../../../clientbound/play/login";
import { GameEvent, GameEvents } from "../../../clientbound/play/game_event";
import { SystemChatMessage } from "../../../clientbound/play/system_chat_message";
import { log } from "../../../logApi";
import { SpawnEntity } from "../../../clientbound/play/spawn_entity";
import { ChunkDataAndUpdateLight } from "../../../clientbound/play/chunk_data_and_update_light";

export class Configuration {
  public static handle(player: Player, buffer: Buffer) {
    var packet_id = buffer[0];

    switch (packet_id) {
      case 0x00:
        KnownPacks.send(player)
        break
      case 0x03:
        player.NextState = ConnectionStates.Play
        Login.send(player)
        GameEvent.send(player, GameEvents.StartWaitingForLevelChunks, 0)

        SystemChatMessage.send("§e" + player.username + " joined the game")
        log(
          `${player.username} joined the game with uuid ${player.uuid}`,
          "SERVER"
        );
        ChunkDataAndUpdateLight.send(player)

        // Spawn Players
        Players.ConnectedPlayers.forEach((splayer) => {
          if (splayer.NextState != ConnectionStates.Play) return
          if (splayer == player) return

          SpawnEntity.send(player, 147, splayer.EID, true)
          SpawnEntity.send(splayer, 147, player.EID)
        })

        //PlayerPosition.send(client)
        break
      case 0x07:
        RegistryData.send(player)
        player.client().write(Buffer.from([0x01, 0x03]))
        break
    }
  }
}
