import { StartLogin } from "./start_login";
import { ConnectionStates, Player, Players } from "../../../player";

export class Login {
    public static handle(player: Player, buffer: Buffer) {
        const packet_id = buffer[0]
        
        switch (packet_id) {
            case 0x00:
                StartLogin.handle(player, buffer)
                break
            case 0x03:
                player.NextState = ConnectionStates.Configuration
                break
            default: console.log(buffer)
        }
    }
}