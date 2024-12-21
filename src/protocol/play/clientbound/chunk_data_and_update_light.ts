import { Int, Short, VarInt } from "../../../datatypes";
import { Player } from "../../../player";

export class ChunkDataAndUpdateLight {
    public static send(player: Player, chunkX: number, chunkY: number) {

        let chunk_sections = Buffer.alloc(0)
        for (let i = 1; i <= 24; i++) {
            chunk_sections = Buffer.concat([chunk_sections,
                Short.encode(4096),
                Buffer.from([0x00]),
                i < 9 ? (i % 2 == 0 ? VarInt.encode(11649) : VarInt.encode(4328)) : VarInt.encode(0),
                VarInt.encode(0),
                Buffer.from([0x00]),
                VarInt.encode(0),
                VarInt.encode(0)
            ])
        }

        const response_data = Buffer.concat([
            Int.encode(chunkX),                 // Chunk X
            Int.encode(chunkY),                 // Chunk Y
            Buffer.from([0x0a, 0x00]),          // Heightmaps
            VarInt.encode(chunk_sections.length),
            chunk_sections,
            VarInt.encode(0),                   // Number of block entities
            VarInt.encode(0),                   // Sky Light Mask (length)
            VarInt.encode(0),                   // Block Light Mask (length)
            VarInt.encode(0),                   // Empty Sky Light Mask (length)
            VarInt.encode(0),                   // Empty Block Light Mask (length)
            VarInt.encode(0),                   // Sky Light array count
            VarInt.encode(0)                    // Block Light array count
        ])

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x28]),
            response_data
        ])

        player.client().write(response)
    }
}