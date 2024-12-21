import { Position, VarInt } from "../../../datatypes";
import { Vector3 } from "../../../math/vectors";
import { Player, Players } from "../../../player";
import { Protocol } from "../../reports";

export class SetBlockDestroyStage {
    public static send(player: Player, locaction: Vector3) {
        const response_data = Buffer.concat([
            VarInt.encode(player.player_entity.getEntityID()),
            Position.encode(locaction),
            Buffer.from([0x09])
        ])

        Players.ConnectedPlayers.forEach((splayer) => {
            Protocol.send(splayer, "minecraft:block_destruction", response_data)
        })
    }
}