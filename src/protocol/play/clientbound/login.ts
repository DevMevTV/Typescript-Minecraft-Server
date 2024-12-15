import { Int, Long, NetString, VarInt } from "../../../datatypes";
import { server } from "../../../serverPropeties";
import { Player, Players } from "../../../player";

export class Login {
    public static send(player: Player) {
        Players.EID += 1
        player.EID = Players.EID
        const response_data = Buffer.concat([
            Int.encode(Players.EID),                              // Entity ID
            Buffer.from([0x00]),                        // Is hardcore
            VarInt.encode(1),                           // Dimension Count
            NetString.encode("minecraft:overworld"),
            VarInt.encode(server.maxPlayers),           // Max Players
            VarInt.encode(10),                          // View Distance
            VarInt.encode(10),                          // Simulation Distance
            Buffer.from([0x00]),                        // Reduced Debug Info
            Buffer.from([0x01]),                        // Enable respawn screen
            Buffer.from([0x00]),                        // Do limited crafting
            VarInt.encode(0),                           // Dimension Type
            NetString.encode("minecraft:overworld"),    // Dimension Name
            Long.encode(BigInt(0)),                     // Hashed seed
            Buffer.from([0x01]),                        // Game mode
            Buffer.from([0xff]),                        // Previous Game mode
            Buffer.from([0x00]),                        // Is Debug
            Buffer.from([0x00]),                        // Is Flat
            Buffer.from([0x00]),                        // Has death location
            Buffer.from([0x00]),                        // Death dimension name maybe?
            VarInt.encode(20),                          // Portal cooldown
            Buffer.from([0x00])                         // Enforces Secure Chat
        ])

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x2c]),
            response_data
        ])

        player.client().write(response)
    }

    
}