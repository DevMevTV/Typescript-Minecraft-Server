import { Entity } from "../../../entity/entity";
import { log } from "../../../logApi";
import { ConnectionStates, Player, Players } from "../../../player";
import { ChunkDataAndUpdateLight } from "../../play/clientbound/chunk_data_and_update_light";
import { Commands } from "../../play/clientbound/commands";
import { GameEvent, GameEvents } from "../../play/clientbound/game_event";
import { Login } from "../../play/clientbound/login";
import { PlayerPosition } from "../../play/clientbound/player_position";
import { SystemChatMessage } from "../../play/clientbound/system_chat_message";

export class ConfigurationAcknowledged {
    public static send(player: Player) {
        player.NextState = ConnectionStates.Play
        Login.send(player)
        GameEvent.send(player, GameEvents.StartWaitingForLevelChunks, 0)
    
        SystemChatMessage.send("§e" + player.player_entity.getName() + " joined the game")
        log(
          `${player.player_entity.getName()} joined the game with uuid ${player.player_entity.getUUID()}`,
          "SERVER"
        );
        for (var x = -5; x <= 5; x++) {
            for (var y = -5; y <= 5; y++) {
                ChunkDataAndUpdateLight.send(player, x, y)
            }
        }
    
        // Spawn Players
        player.player_entity.position = {x: 8.5, y: 70, z: 8.5}
        Entity.SpawnEntities(player)
        player.player_entity.setListed(true).spawn(player, true)

        Commands.send(player)
    
        PlayerPosition.send(player)
    }
}