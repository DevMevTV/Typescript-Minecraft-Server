import { TextComponent, VarInt } from "../../../datatypes";
import { ConnectionStates, Players } from "../../../player";

export class SystemChatMessage {
    public static send(message: string) {

        const responseData = Buffer.concat([
            TextComponent.encode(message),
            Buffer.from([0x00])
        ])

        const response = Buffer.concat([
            VarInt.encode(responseData.length + 1),
            Buffer.from([0x73]),
            responseData,
        ])

        Players.ConnectedPlayers.forEach((player, key) => {
            if (player.NextState !== ConnectionStates.Play) return
            key.write(response)
        })
    }
}
