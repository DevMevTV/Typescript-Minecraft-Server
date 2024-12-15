import { Double, Float } from "../../../datatypes";
import { Player } from "../../../player";

export class SetPlayerPos {
    public static set_player_position(player: Player, buffer: Buffer) {
        var offset = 1
        var {value: x, offset} = Double.decode(buffer, offset)
        var {value: y, offset} = Double.decode(buffer, offset)
        var {value: z, offset} = Double.decode(buffer, offset)

        console.log("X:", x, ", Y:", y, ", Z:", z)
    }

    public static set_player_position_and_rotation(player: Player, buffer: Buffer) {
        var offset = 1
        var {value: x, offset} = Double.decode(buffer, offset)
        var {value: y, offset} = Double.decode(buffer, offset)
        var {value: z, offset} = Double.decode(buffer, offset)
        var {value: yaw, offset} = Float.decode(buffer, offset)
        var {value: pitch, offset} = Float.decode(buffer, offset)
        
        console.log("X:", x, ", Y:", y, ", Z:", z, ", Yaw:", yaw, ", Pitch:", pitch)
    }

    public static set_player_rotation(player: Player, buffer: Buffer) {
        var offset = 1
        
        var {value: yaw, offset} = Float.decode(buffer, offset)
        var {value: pitch, offset} = Float.decode(buffer, offset)
        
        console.log("Yaw:", yaw, ", Pitch:", pitch)
    }
}