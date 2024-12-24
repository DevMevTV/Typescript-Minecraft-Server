import { TextComponent, VarInt } from "../../../datatypes";
import { ConnectionStates, Player, Players } from "../../../player";

export class SystemChatMessage {
    public static send(message: string, player?: Player) {

        const responseData = Buffer.concat([
            TextComponent.encode(message),
            Buffer.from([0x00])
        ])

        const response = Buffer.concat([
            VarInt.encode(responseData.length + 1),
            Buffer.from([0x73]),
            responseData,
        ])

        if (player) {
            player.client().write(response)
        } else {
            Players.ConnectedPlayers.forEach((player, key) => {
                if (player.NextState !== ConnectionStates.Play) return
                key.write(response)
            })
        }
    }
}
