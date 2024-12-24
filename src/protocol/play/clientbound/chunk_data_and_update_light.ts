import { Int, Long, Short, VarInt } from "../../../datatypes";
import { Player } from "../../../player";

export class ChunkDataAndUpdateLight {
    public static send(player: Player, chunkX: number, chunkY: number) {

        let chunk_sections = Buffer.alloc(0)

        for (let i = 1; i <= 24; i++) {
            chunk_sections = Buffer.concat([
                chunk_sections,
                i <= 8 ? ChunkDataAndUpdateLight.ChunkSector([{block: 10, y_level:0}]) : ChunkDataAndUpdateLight.ChunkSector([{block: 0, y_level: 0}])
            ])
            //chunk_sections = Buffer.concat([chunk_sections,
            //    Short.encode(4096),
            //    Buffer.from([0x00]),
            //    VarInt.encode(10),
            //    VarInt.encode(0),
            //    Buffer.from([0x00]),
            //    VarInt.encode(0),
            //    VarInt.encode(0)
            //])
        }

        //chunk_sections = Buffer.concat([
        //    chunk_sections,
        //    ChunkDataAndUpdateLight.ChunkSector([{block: 1, y_level:0}])
        //])

        //for (let i = 9; i <= 24; i++) {
        //    chunk_sections = Buffer.concat([chunk_sections,
        //        Short.encode(4096),
        //        Buffer.from([0x00]),
        //        VarInt.encode(0),
        //        VarInt.encode(0),
        //        Buffer.from([0x00]),
        //        VarInt.encode(0),
        //        VarInt.encode(0)
        //    ])
        //}

        

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

    private static ChunkSector(pallete: {block: number, y_level: number, y_max?: number}[]) {
        let chunkSector: Buffer
        if (pallete.length == 1) {
            chunkSector = Buffer.concat([
                Short.encode(4096),                 // Block Count
                VarInt.encode(0),                   // BPE
                VarInt.encode(pallete[0].block),    // Palette
                Buffer.from([0]),                   // Data Length
                Buffer.from([0x00]),                // BPE
                VarInt.encode(0),                   // Palette
                VarInt.encode(0)                    // Data Length
            ])
        } else {
            let blockBuffer: Buffer = Buffer.alloc(0)
            pallete.forEach(block => {
                blockBuffer = Buffer.concat([
                    blockBuffer,
                    VarInt.encode(block.block)
                ])
            })
    
            let data = Array(0)
    
            let y_level = 0;
            pallete.sort((a, b) => a.y_level - b.y_level).forEach((block, index, array) => {
                data = data.concat(Array(16 * 16 * ((array[index + 1] ? array[index + 1].y_level - 1 : 16) - y_level)).fill(block.block));
                y_level = array[index + 1] ? array[index + 1].y_level - 1 : 16;
            });
    
            let dataArray = Buffer.alloc(0);
            for (let i = 0; i < data.length; i += 8) {
                let packed = BigInt(0);
                for (let j = 0; j < 8; j++) {
                    if (i + j < data.length) {
                        packed |= BigInt(data[i + j]) << BigInt(j * 8);
                    }
                }
                dataArray = Buffer.concat([dataArray, Long.encode(packed)]);
            }
    
            chunkSector = Buffer.concat([
                Short.encode(4096),                 // Block Count
                Buffer.from([0x08]),                // BPE
                VarInt.encode(pallete.length),      // Palette Length
                blockBuffer,                        // Palette
                VarInt.encode(256),                 // Data Length
                dataArray,                          // Data
                Buffer.from([0x00]),                // BPE
                VarInt.encode(0),                   // Palette
                VarInt.encode(0)                    // Data Length
            ])
        }
    
        return chunkSector
    }
    
}