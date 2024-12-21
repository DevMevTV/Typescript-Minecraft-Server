import { ConnectionStates, Player } from "../../../player";

export class LoginAcknowledged {
    public static handle(player: Player) {
        player.NextState = ConnectionStates.Configuration
    }
}