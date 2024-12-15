import { NetString } from "../../datatypes";
import { SystemChatMessage } from "../../clientbound/play/system_chat_message";
import { Player } from "../../player";
import { log } from "../../logApi";
import { SetPlayerPos } from "./set_player_pos";

export class Play {
    public static handle(player: Player, buffer: Buffer) {
        const packet_id = buffer[0]
        switch (packet_id) {
            case 0x07:
                let { value: message } = NetString.decode(buffer, 1)
                message = "<" + player.username + "> " + message
                SystemChatMessage.send(message)
                log(message, "PLAYER")
                break;
            case 0x0b:
                break // Tick end
            case 0x1c:
                SetPlayerPos.set_player_position(player, buffer)
                break
            case 0x1d:
                SetPlayerPos.set_player_position_and_rotation(player, buffer)
                break
            case 0x1e:
                SetPlayerPos.set_player_rotation(player, buffer)
                break
            default:
                //console.log(buffer)
        }
    }
}