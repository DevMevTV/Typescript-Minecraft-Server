import { NetString, UUID, VarInt } from "../../../datatypes";
import { Player, } from "../../../player";

export class LoginSuccess {
    public static send(player: Player) {
        const response_data = Buffer.concat([
            UUID.encode(player.uuid),
            NetString.encode(player.username),
            VarInt.encode(0)
        ])

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x02]),
            response_data
        ])

        player.client().write(response)
    }
}