import { Angle, Double, Short, UUID, VarInt } from "../../datatypes";
import { ConnectionStates, Player, Players } from "../../player";

export class SpawnEntity {
    public static send(player: Player, entity: number, EID: number, localy = false) {
        const response_data = Buffer.concat([
            VarInt.encode(EID),                                     // Entity ID
            UUID.encode("00112233445566778899aabbccddeeff"),        // Entity UUID
            VarInt.encode(entity),                                  // Entity Type
            Double.encode(0),                                       // X
            Double.encode(0),                                       // Y
            Double.encode(0),                                       // Z
            Angle.encode(0),                                        // Pitch
            Angle.encode(0),                                        // Yaw
            Angle.encode(0),                                        // Head Yaw
            VarInt.encode(0),                                       // Data
            Short.encode(0),                                        // Velocity X
            Short.encode(0),                                        // Velocity Y
            Short.encode(0),                                        // Velocity Z
        ])

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x01]),
            response_data
        ])

        if (localy) {
            
        } else {
            Players.ConnectedPlayers.forEach((splayer) => {
                if (splayer.NextState != ConnectionStates.Play) return
                if (splayer == player) return
                splayer.client().write(response)
            })
        }
        
    }
}