import { NetString } from "../../../datatypes";
import { UUID } from "../../../datatypes/uuid";
import { Player } from "../../../player";
import { LoginSuccess } from "../clientbound/login_success";

export class LoginStart {
    public static async handle(player: Player, buffer: Buffer) {
        var offset = 1
        var { value: username, offset} = NetString.decode(buffer, offset)
        var uuid = new UUID(buffer, offset)

        const skin = await (await fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + uuid.toTrimmed())).json()

        player.login(username, uuid)
        LoginSuccess.send(player)

        const properties = skin.properties || [];
        for (const property of properties) {
            player.player_entity.addProperty(property.name, property.value)
        }
        
        

        
    }
}