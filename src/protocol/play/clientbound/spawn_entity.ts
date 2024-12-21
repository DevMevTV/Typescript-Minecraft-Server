import { Angle, Double, Short, VarInt } from "../../../datatypes";
import { UUID } from "../../../datatypes/uuid";
import { Vector2, Vector3 } from "../../../math/vectors";
import { Player } from "../../../player";

export class SpawnEntity {
    public static send(
        player: Player, 
        eid: number, 
        uuid: UUID, 
        entityType: number, 
        position: Vector3, 
        rotation: Vector2,
        headYaw: number,
        data: number,
        velocity: Vector3
    ) {
        const response_data = Buffer.concat([
            VarInt.encode(eid),                                     // Entity ID
            uuid.toBuffer(),                                        // Entity UUID
            VarInt.encode(entityType),                              // Entity Type
            Double.encode(position.x),                              // X
            Double.encode(position.y),                              // Y
            Double.encode(position.z),                              // Z
            Angle.encode(rotation.x),                               // Pitch
            Angle.encode(rotation.y),                               // Yaw
            Angle.encode(headYaw),                                  // Head Yaw
            VarInt.encode(data),                                    // Data
            Short.encode(velocity.x),                               // Velocity X
            Short.encode(velocity.y),                               // Velocity Y
            Short.encode(velocity.z),                               // Velocity Z
        ])

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x01]),
            response_data
        ])

        player.client().write(response)
    }
}