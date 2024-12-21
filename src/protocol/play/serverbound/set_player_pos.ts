import { Double, Float } from "../../../datatypes";
import { Player } from "../../../player";
import { UpdateEntityPosition } from "../clientbound/update_entity_pos";

export class SetPlayerPos {
    public static set_player_position(player: Player, buffer: Buffer) {
        var offset = 1
        var {value: x, offset} = Double.decode(buffer, offset)
        var {value: y, offset} = Double.decode(buffer, offset)
        var {value: z, offset} = Double.decode(buffer, offset)
        var flags = buffer[offset]

        UpdateEntityPosition.set_player_position(player, {x, y, z}, flags)
    }

    public static set_player_position_and_rotation(player: Player, buffer: Buffer) {
        var offset = 1
        var {value: x, offset} = Double.decode(buffer, offset)
        var {value: y, offset} = Double.decode(buffer, offset)
        var {value: z, offset} = Double.decode(buffer, offset)
        var {value: yaw, offset} = Float.decode(buffer, offset)
        var {value: pitch, offset} = Float.decode(buffer, offset)
        var flags = buffer[offset]
        
        UpdateEntityPosition.set_player_position_and_rotation(player, {x, y, z}, {yaw, pitch}, flags)
    }

    public static set_player_rotation(player: Player, buffer: Buffer) {
        var offset = 1
        
        var {value: yaw, offset} = Float.decode(buffer, offset)
        var {value: pitch, offset} = Float.decode(buffer, offset)
        var flags = buffer[offset]

        UpdateEntityPosition.set_player_rotation(player, {yaw, pitch}, flags)
    }
}