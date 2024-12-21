import { Angle, Float, Short, VarInt } from "../../../datatypes";
import { ConnectionStates, Player, Players } from "../../../player";

export class UpdateEntityPosition {
    public static set_player_position(player: Player, position: { x: number, y: number, z: number }, flags: number) {

        const dx = (position.x * 4096) - (player.player_entity.position.x * 4096)
        const dy = (position.y * 4096) - (player.player_entity.position.y * 4096)
        const dz = (position.z * 4096) - (player.player_entity.position.z * 4096)
        

        const response_data = Buffer.concat([
            VarInt.encode(player.player_entity.getEntityID()),
            Short.encode(dx),
            Short.encode(dy),
            Short.encode(dz),
            Buffer.from([flags])
        ])

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x2f]),
            response_data
        ])
        
        player.player_entity.position = position
        
        Players.ConnectedPlayers.forEach((splayer) => {
            if (splayer.NextState != ConnectionStates.Play) return
            splayer.client().write(response)
        })
    }

    public static set_player_position_and_rotation(player: Player, position: { x: number, y: number, z: number }, rotation: {yaw: number, pitch: number}, flags: number) {
        const dx = (position.x * 4096) - (player.player_entity.position.x * 4096)
        const dy = (position.y * 4096) - (player.player_entity.position.y * 4096)
        const dz = (position.z * 4096) - (player.player_entity.position.z * 4096)
        
    
        const response_data = Buffer.concat([
            VarInt.encode(player.player_entity.getEntityID()),
            Short.encode(dx),
            Short.encode(dy),
            Short.encode(dz),
            Angle.encode(rotation.yaw),
            Angle.encode(rotation.pitch),
            Buffer.from([flags])
        ])
    
        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x30]),
            response_data
        ])

        const head_response_data = Buffer.concat([
            VarInt.encode(player.player_entity.getEntityID()),
            Angle.encode(rotation.yaw)
        ])

        const head_response = Buffer.concat([
            VarInt.encode(head_response_data.length + 1),
            Buffer.from([0x4d]),
            head_response_data
        ])

        player.player_entity.position = position
    
        Players.ConnectedPlayers.forEach((splayer) => {
            if (splayer.NextState != ConnectionStates.Play) return
            splayer.client().write(head_response)
            splayer.client().write(response)
        })
    }
    

    public static set_player_rotation(player: Player, rotation: {yaw: number, pitch: number}, flags: number) {
        const response_data = Buffer.concat([
            VarInt.encode(player.player_entity.getEntityID()),
            Angle.encode(rotation.yaw),
            Angle.encode(rotation.pitch),
            Buffer.from([flags])
        ])


        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x32]),
            response_data
        ])

        const head_response_data = Buffer.concat([
            VarInt.encode(player.player_entity.getEntityID()),
            Angle.encode(rotation.yaw)
        ])

        const head_response = Buffer.concat([
            VarInt.encode(head_response_data.length + 1),
            Buffer.from([0x4d]),
            head_response_data
        ])

        Players.ConnectedPlayers.forEach((splayer) => {
            if (splayer.NextState != ConnectionStates.Play) return
            splayer.client().write(response)
            splayer.client().write(head_response)
        })
    }
}