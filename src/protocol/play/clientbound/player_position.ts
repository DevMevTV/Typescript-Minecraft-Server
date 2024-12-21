import { Double, Float, VarInt } from "../../../datatypes";
import { Player } from "../../../player";

export class PlayerPosition {
    public static send(player: Player) {
        const response_data = Buffer.concat([
            VarInt.encode(0),

            Double.encode(player.player_entity.position.x),
            Double.encode(player.player_entity.position.y),
            Double.encode(player.player_entity.position.z),

            Double.encode(0),
            Double.encode(0),
            Double.encode(0),

            Float.encode(0),
            Float.encode(0),

            Buffer.alloc(4)
        ])

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x42]),
            response_data
        ])

        player.client().write(response)
    }
}