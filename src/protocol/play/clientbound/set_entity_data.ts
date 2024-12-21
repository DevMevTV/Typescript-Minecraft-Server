import { VarInt } from "../../../datatypes";
import { ConnectionStates, Player, Players } from "../../../player";
import { Protocol } from "../../reports";

export class SetEntityData {
    public static send(player: Player, index: number, type: number, value: number) {
        const response_data = Buffer.concat([
            VarInt.encode(player.player_entity.getEntityID()),
            Buffer.from([index]),
            VarInt.encode(type),
            Buffer.from([value]),
            Buffer.from([0xff])
        ])

        Players.ConnectedPlayers.forEach(splayer => {
            if (splayer.NextState != ConnectionStates.Play) return
            if (splayer == player) return
            Protocol.send(splayer, "minecraft:set_entity_data", response_data)
        })
    }
}