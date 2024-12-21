import { VarInt } from "../../../datatypes";
import { Entity } from "../../../entity/entity";
import { ConnectionStates, Players } from "../../../player";
import { Protocol } from "../../reports";

export class RemoveEntities {
    public static send(entity: Entity) {
        const response_data = Buffer.concat([
            VarInt.encode(1),
            VarInt.encode(entity.getEntityID())
        ])

        Players.ConnectedPlayers.forEach((splayer) => {
            if (splayer.NextState != ConnectionStates.Play) return
            Protocol.send(splayer, "minecraft:remove_entities", response_data)
        })
    }
}