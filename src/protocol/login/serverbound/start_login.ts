import { NetString, UUID, VarInt } from "../../../datatypes";
import { Player, Players } from "../../../player";
import { LoginSuccess } from "../clientbound/login_success";

export class StartLogin {
    public static handle(player: Player, buffer: Buffer) {
        var offset = 1
        var { value: username, offset: offset} = NetString.decode(buffer, offset)
        var { value: uuid, offset: offset} = UUID.decode(buffer, offset)

        player.login(username, uuid)
        LoginSuccess.send(player)
    }
}