import { VarInt } from "../../../datatypes";
import { ConnectionStates, Player, Players } from "../../../player";
import { Protocol } from "../../reports";

export class EntityAnimations {
    public static send(player: Player, animation: number) {
        const response_data = Buffer.concat([
            VarInt.encode(player.player_entity.getEntityID()),
            Buffer.from([animation])
        ])

        Players.ConnectedPlayers.forEach((splayer) => {
            if (splayer.NextState != ConnectionStates.Play) return
            if (splayer == player) return
            Protocol.send(splayer, "minecraft:animate", response_data)
        })
    }
}