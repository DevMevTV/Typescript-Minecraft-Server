import { basename } from "path";
import { VarInt } from "../../../datatypes";
import { Player } from "../../../player";
import { SetEntityData } from "../clientbound/set_entity_data";

export class PlayerCommand {
    public static handle(player: Player, buffer: Buffer) {
        var {value: EID, offset} = VarInt.decode(buffer, 1)
        var {value: action, offset} = VarInt.decode(buffer, offset)

        switch (action) {
            case 0: // Start sneaking
                SetEntityData.send(player, 6, 21, 0x05)
                break
            case 1: // Stop sneaking
                SetEntityData.send(player, 6, 21, 0x00)
                break
            case 3: // Start sprinting
                SetEntityData.send(player, 0, 0, 0x08)
                break
            case 4: // Stop sprinting
                SetEntityData.send(player, 0, 0, 0x00)
                break
        }
    }
}