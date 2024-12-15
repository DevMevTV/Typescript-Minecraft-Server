import { NetString, TextComponent, VarInt } from "../../../datatypes";
import { Player } from "../../../player";

export class Disconnect {
    public static send(player: Player, reason: string) {
        let response_data = NetString.encode(JSON.stringify({text: reason}))

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x00]),
            response_data
        ])

        player.client().write(response)
    }
}