import { NetString, VarInt } from "../../../datatypes";
import { Player } from "../../../player";

export class RegistryData {
    public static send(player: Player) {
        const client = player.client()
        {
            let response_data = Buffer.concat([
                NetString.encode("minecraft:painting_variant"),
                VarInt.encode(1),
                NetString.encode("minecraft:backyard"),
                Buffer.from([0x00])
            ])

            let response = Buffer.concat([
                VarInt.encode(response_data.length + 1),
                Buffer.from([0x07]),
                response_data
            ])

            client.write(response)
        }

        {
            let response_data = Buffer.concat([
                NetString.encode("minecraft:wolf_variant"),
                VarInt.encode(1),
                NetString.encode("minecraft:chestnut"),
                Buffer.from([0x00])
            ])

            let response = Buffer.concat([
                VarInt.encode(response_data.length + 1),
                Buffer.from([0x07]),
                response_data
            ])

            client.write(response)
        }

        {
            const biomes = [
                "minecraft:old_growth_spruce_taiga",
                "minecraft:plains"
            ]

            let response_data = Buffer.concat([
                NetString.encode("minecraft:worldgen/biome"),
                VarInt.encode(biomes.length)
            ])

            biomes.forEach((biome) => {
                response_data = Buffer.concat([response_data,
                    NetString.encode(biome),
                    Buffer.from([0x00])
                ])
            })

            let response = Buffer.concat([
                VarInt.encode(response_data.length + 1),
                Buffer.from([0x07]),
                response_data
            ])

            client.write(response)
        }

        {
            let response_data = Buffer.concat([
                NetString.encode("minecraft:dimension_type"),
                VarInt.encode(1),
                NetString.encode("minecraft:overworld"),
                Buffer.from([0x00])
            ])

            let response = Buffer.concat([
                VarInt.encode(response_data.length + 1),
                Buffer.from([0x07]),
                response_data
            ])

            client.write(response)
        }

        {
            const dimension_types = [
                "in_fire",
                    "campfire",
                    "lightning_bolt",
                    "on_fire",
                    "lava",
                    "hot_floor",
                    "in_wall",
                    "cramming",
                    "drown",
                    "starve",
                    "cactus",
                    "fall",
                    "ender_pearl",
                    "fly_into_wall",
                    "out_of_world",
                    "generic",
                    "magic",
                    "wither",
                    "dragon_breath",
                    "dry_out",
                    "sweet_berry_bush",
                    "freeze",
                    "stalagmite",
                    "outside_border",
                    "generic_kill",
                    "player_attack"
            ]

            let response_data = Buffer.concat([
                NetString.encode("minecraft:damage_type"),
                VarInt.encode(dimension_types.length)
            ])

            dimension_types.forEach((biome) => {
                response_data = Buffer.concat([response_data,
                    NetString.encode(biome),
                    Buffer.from([0x00])
                ])
            })

            let response = Buffer.concat([
                VarInt.encode(response_data.length + 1),
                Buffer.from([0x07]),
                response_data
            ])

            client.write(response)
        }
    }
}