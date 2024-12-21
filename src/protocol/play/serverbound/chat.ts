import { NetString } from "../../../datatypes"
import { log } from "../../../logApi"
import { Player } from "../../../player"
import { SystemChatMessage } from "../clientbound/system_chat_message"

export class Chat {
    public static send(player: Player, buffer: Buffer) {
        let { value: message } = NetString.decode(buffer, 1)
        message = "<" + player.player_entity.getName() + "> " + message
        SystemChatMessage.send(message)
        log(message, "PLAYER")
    }
}