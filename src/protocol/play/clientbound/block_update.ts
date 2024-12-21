import { Position, VarInt } from "../../../datatypes";
import { Vector3 } from "../../../math/vectors";
import { ConnectionStates, Players } from "../../../player";
import { Protocol } from "../../reports";

export class BlockUpdate {
    public static send(location: Vector3, blockId: number) {
        const response_data = Buffer.concat([
            Position.encode(location),
            VarInt.encode(blockId)
        ])

        Players.ConnectedPlayers.forEach(splayer => {
            if (splayer.NextState != ConnectionStates.Play) return
            Protocol.send(splayer, "minecraft:block_update", response_data)
        })
    }
}