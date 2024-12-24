import { AreaEffectCloud } from "../entity/entities/area_effect_cloud";
import { Boat, BoatTypes } from "../entity/entities/boat";
import { Entity } from "../entity/entity";
import { Allay } from "../entity/living_entities/allay";
import { Armadillo } from "../entity/living_entities/armadillo";
import { ArmorStand } from "../entity/living_entities/armor_stand";
import { Axolotl } from "../entity/living_entities/axolotl";
import { Bat } from "../entity/living_entities/bat";
import { Bee } from "../entity/living_entities/bee";
import { Blaze } from "../entity/living_entities/blaze";
import { Bogged } from "../entity/living_entities/bogged";
import { Breeze } from "../entity/living_entities/breeze";
import { Camel } from "../entity/living_entities/camel";
import { CaveSpider } from "../entity/living_entities/case_spider";
import { Cat } from "../entity/living_entities/cat";
import { Chicken } from "../entity/living_entities/chicken";
import { Cod } from "../entity/living_entities/cod";
import { Cow } from "../entity/living_entities/cow";
import { Creaking } from "../entity/living_entities/creaking";
import { CreatingTransient } from "../entity/living_entities/creating_transient";
import { Creeper } from "../entity/living_entities/creeper";
import { Dolphin } from "../entity/living_entities/dolphin";
import { Donkey } from "../entity/living_entities/donkey";
import { Drowned } from "../entity/living_entities/drowned";
import { ElderGuardian } from "../entity/living_entities/elder_guardian";
import { EnderDragon } from "../entity/living_entities/ender_dragon";
import { Enderman } from "../entity/living_entities/enderan";
import { Endermite } from "../entity/living_entities/endermite";
import { Evoker } from "../entity/living_entities/evoker";
import { Fox } from "../entity/living_entities/fox";
import { Frog } from "../entity/living_entities/frog";
import { Ghast } from "../entity/living_entities/ghast";
import { Giant } from "../entity/living_entities/giant";
import { GlowSquid } from "../entity/living_entities/glow_squid";
import { Goat } from "../entity/living_entities/goat";
import { Guardian } from "../entity/living_entities/guardian";
import { Hoglin } from "../entity/living_entities/hoglin";
import { Horse } from "../entity/living_entities/horse";
import { Husk } from "../entity/living_entities/husk";
import { Illusioner } from "../entity/living_entities/illusioner";
import { IronGolem } from "../entity/living_entities/iron_golem";
import { Llama } from "../entity/living_entities/llama";
import { MagmaCube } from "../entity/living_entities/magma_cube";
import { Mooshroom } from "../entity/living_entities/mooshroom";
import { Mule } from "../entity/living_entities/mule";
import { Ocelot } from "../entity/living_entities/ocelot";
import { Panda } from "../entity/living_entities/panda";
import { Parrot } from "../entity/living_entities/parrot";
import { Phantom } from "../entity/living_entities/phantom";
import { Pig } from "../entity/living_entities/pig";
import { Piglin } from "../entity/living_entities/piglin";
import { PiglinBrute } from "../entity/living_entities/piglin_brute";
import { Pillager } from "../entity/living_entities/pillager";
import { PolarBear } from "../entity/living_entities/polar_bear";
import { Pufferfish } from "../entity/living_entities/pufferfish";
import { Rabbit } from "../entity/living_entities/rabbit";
import { Ravager } from "../entity/living_entities/ravager";
import { Salmon } from "../entity/living_entities/salmon";
import { Sheep } from "../entity/living_entities/sheep";
import { Shulker } from "../entity/living_entities/shulker";
import { Silverfish } from "../entity/living_entities/silverfish";
import { Skeleton } from "../entity/living_entities/skeleton";
import { SkeletonHorse } from "../entity/living_entities/skeleton_horse";
import { Slime } from "../entity/living_entities/slime";
import { Sniffer } from "../entity/living_entities/sniffer";
import { SnowGolem } from "../entity/living_entities/snow_golem";
import { Spider } from "../entity/living_entities/spider";
import { Squid } from "../entity/living_entities/squid";
import { Stray } from "../entity/living_entities/stray";
import { Strider } from "../entity/living_entities/strider";
import { Tadpole } from "../entity/living_entities/tadpole";
import { TraderLlama } from "../entity/living_entities/trader_llama";
import { TropicalFish } from "../entity/living_entities/tropical_fish";
import { Turtle } from "../entity/living_entities/turtle";
import { Vex } from "../entity/living_entities/vex";
import { Villager } from "../entity/living_entities/villager";
import { Vindicator } from "../entity/living_entities/vindicator";
import { WanderingTrader } from "../entity/living_entities/wandering_trader";
import { Warden } from "../entity/living_entities/warden";
import { Witch } from "../entity/living_entities/witch";
import { Wither } from "../entity/living_entities/wither";
import { WitherSkeleton } from "../entity/living_entities/wither_skeleton";
import { Wolf } from "../entity/living_entities/wolf";
import { Zoglin } from "../entity/living_entities/zoglin";
import { Zombie } from "../entity/living_entities/zombie";
import { ZombieHorse } from "../entity/living_entities/zombie_horse";
import { ZombieVillager } from "../entity/living_entities/zombie_villager";
import { ZombiefiedPiglin } from "../entity/living_entities/zombified_piglin";
import { Vector2, Vector3 } from "../math/vectors";
import { Player } from "../player";
import { Command } from "./command";

export class Summon implements Command {
    public static entities = new Map<String, (position: Vector3, rotation: Vector2) => Entity>()

    send(player: Player, command: string, args: string[]): boolean {
        const ident = args[0][0] != ":" ? (args[0].split("").includes(":") ? args[0] : "minecraft:" + args[0]) : "minecraft" + args[0]
        var entity: Entity

        if (Summon.entities.has(ident)) {
            const factory = Summon.entities.get(ident)!
            entity = factory(player.player_entity.position, player.player_entity.rotation)
        } else {
            player.sendMessage("§cEntity " + ident + " not found!")
            return false
        }

        entity.head_rotation = player.player_entity.head_rotation
        entity.spawn()

        return true
    }

    public static init() {
        const createDefault = (EntityClass: new (...args: any[]) => Entity) => (position: Vector3, rotation: Vector2) =>
            new EntityClass(position, rotation, 0, new Vector3(0, 0, 0))
        const createBoat = (type: BoatTypes) => (position: Vector3, rotation: Vector2) => 
            new Boat(type, position, rotation, 0, new Vector3(0, 0, 0))

        // Entities
            // Boats
            this.registerEntity("minecraft:acacia_boat", createBoat(BoatTypes.Acacia))
            this.registerEntity("minecraft:acacia_chest_boat", createBoat(BoatTypes.Acacia_Chest))
            this.registerEntity("minecraft:bamboo_raft", createBoat(BoatTypes.Bamboo))
            this.registerEntity("minecraft:bamboo_chest_raft", createBoat(BoatTypes.Bamboo_Chest))
            this.registerEntity("minecraft:birch_boat", createBoat(BoatTypes.Birch))
            this.registerEntity("minecraft:birch_chest_boat", createBoat(BoatTypes.Birch_Chest))
            this.registerEntity("minecraft:cherry_boat", createBoat(BoatTypes.Cherry))
            this.registerEntity("minecraft:cherry_chest_boat", createBoat(BoatTypes.Cherry_Chest))
            this.registerEntity("minecraft:dark_oak_boat", createBoat(BoatTypes.Dark_Oak))
            this.registerEntity("minecraft:dark_oak_chest_boat", createBoat(BoatTypes.Dark_Oak_Chest))
            this.registerEntity("minecraft:jungle_boat", createBoat(BoatTypes.Jungle))
            this.registerEntity("minecraft:jungle_chest_boat", createBoat(BoatTypes.Jungle_Chest))
            this.registerEntity("minecraft:mangrove_boat", createBoat(BoatTypes.Mangrove))
            this.registerEntity("minecraft:mangrove_chest_boat", createBoat(BoatTypes.Mangrove_Chest))
            this.registerEntity("minecraft:oak_boat", createBoat(BoatTypes.Oak))
            this.registerEntity("minecraft:oak_chest_boat", createBoat(BoatTypes.Oak_Chest))
            this.registerEntity("minecraft:pale_oak_boat", createBoat(BoatTypes.Pale_Oak))
            this.registerEntity("minecraft:pale_oak_chest_boat", createBoat(BoatTypes.Pale_Oak_Chest))
            this.registerEntity("minecraft:spruce_boat", createBoat(BoatTypes.Spruce))
            this.registerEntity("minecraft:spruce_chest_boat", createBoat(BoatTypes.Spruce))
            // Other
            this.registerEntity("minecraft:allay", createDefault(Allay))
            this.registerEntity("minecraft:area_effect_cloud", createDefault(AreaEffectCloud))
            this.registerEntity("minecraft:armadillo", createDefault(Armadillo))
            this.registerEntity("minecraft:armor_stand", createDefault(ArmorStand))
                // arrow
            this.registerEntity("minecraft:axolotl", createDefault(Axolotl))
            this.registerEntity("minecraft:bat", createDefault(Bat))
            this.registerEntity("minecraft:bee", createDefault(Bee))
            this.registerEntity("minecraft:blaze", createDefault(Blaze))
                // block display
            this.registerEntity("minecraft:bogged", createDefault(Bogged))
            this.registerEntity("minecraft:breeze", createDefault(Breeze))
                // breeze windcharge
            this.registerEntity("minecraft:camel", createDefault(Camel))
            this.registerEntity("minecraft:cat", createDefault(Cat))
            this.registerEntity("minecraft:cave_spider", createDefault(CaveSpider))
                // chest minecart
            this.registerEntity("minecraft:chicken", createDefault(Chicken))
            this.registerEntity("minecraft:cod", createDefault(Cod))
                // command block minecart
            this.registerEntity("minecraft:cow", createDefault(Cow))
            this.registerEntity("minecraft:crieking", createDefault(Creaking))
            this.registerEntity("minecraft:creaking_transient", createDefault(CreatingTransient))
            this.registerEntity("minecraft:creeper", createDefault(Creeper))
            this.registerEntity("minecraft:dolphin", createDefault(Dolphin))
            this.registerEntity("minecraft:donkey", createDefault(Donkey))
                // dragon fireball
            this.registerEntity("minecraft:drowned", createDefault(Drowned))
                // Egg
            this.registerEntity("minecraft:elder_guardian", createDefault(ElderGuardian))
            this.registerEntity("minecraft:enderman", createDefault(Enderman))
            this.registerEntity("minecraft:endermite", createDefault(Endermite))
            this.registerEntity("minecraft:ender_dragon", createDefault(EnderDragon))
                // Enderpearl
                // End Crystal
            this.registerEntity("minecraft:evoker", createDefault(Evoker))
                // evoker fange
                // experience bottle
                // experience orbs
                // eye of ender
                // falling block
                // fireball
                // firework rocket
            this.registerEntity("minecraft:fox", createDefault(Fox))
            this.registerEntity("minecraft:frog", createDefault(Frog))
                // furnace minecart
            this.registerEntity("minecraft:ghast", createDefault(Ghast))
            this.registerEntity("minecraft:giant", createDefault(Giant))
                // glowing itemframe
            this.registerEntity("minecraft:glow_squid", createDefault(GlowSquid))
            this.registerEntity("minecraft:goat", createDefault(Goat))
            this.registerEntity("minecraft:guardian", createDefault(Guardian))
            this.registerEntity("minecraft:hoglin", createDefault(Hoglin))
                // hopper minecart
            this.registerEntity("minecraft:horse", createDefault(Horse))
            this.registerEntity("minecraft:husk", createDefault(Husk))
            this.registerEntity("minecraft:illusioner", createDefault(Illusioner))
                // interaction
            this.registerEntity("minecraft:iron_golem", createDefault(IronGolem))
                // Item
                // Item Display
                // Item Frame
                // Leash knob
                // Lightning Bolt
            this.registerEntity("minecraft:llama", createDefault(Llama))
                // Llama Spit
            this.registerEntity("minecraft:magma_cube", createDefault(MagmaCube))
                // Marker
                // minecart
            this.registerEntity("minecraft:mooshroom", createDefault(Mooshroom))
            this.registerEntity("minecraft:mule", createDefault(Mule))
            this.registerEntity("minecraft:ocelot", createDefault(Ocelot))
                // Ominous Item Spawner
                // Painting
            this.registerEntity("minecraft:panda", createDefault(Panda))
            this.registerEntity("minecraft:parrot", createDefault(Parrot))
            this.registerEntity("minecraft:phantom", createDefault(Phantom))
            this.registerEntity("minecraft:pig", createDefault(Pig))
            this.registerEntity("minecraft:piglin", createDefault(Piglin))
            this.registerEntity("minecraft:piglin_brute", createDefault(PiglinBrute))
            this.registerEntity("minecraft:pillager", createDefault(Pillager))
            this.registerEntity("minecraft:polar_bear", createDefault(PolarBear))
                // MMMMMM, POTIONS
            this.registerEntity("minecraft:pufferfish", createDefault(Pufferfish))
            this.registerEntity("minecraft:rabbit", createDefault(Rabbit))
            this.registerEntity("minecraft:ravager", createDefault(Ravager))
            this.registerEntity("minecraft:salmon", createDefault(Salmon))
            this.registerEntity("minecraft:sheep", createDefault(Sheep))
            this.registerEntity("minecraft:shulker", createDefault(Shulker))
                // Shulker Bullet
            this.registerEntity("minecraft:silverfish", createDefault(Silverfish))
            this.registerEntity("minecraft:skeleton", createDefault(Skeleton))
            this.registerEntity("minecraft:skeleton_horse", createDefault(SkeletonHorse))
            this.registerEntity("minecraft:slime", createDefault(Slime))
                // Small Fireball  its not small, its average :sob:
            this.registerEntity("minecraft:sniffer", createDefault(Sniffer))
                // SNOWBALL FIGHT!!!
            this.registerEntity("minecraft:snow_golem", createDefault(SnowGolem))
                // spawner minecart
                // Spectral Arrow
            this.registerEntity("minecraft:spider", createDefault(Spider))
            this.registerEntity("minecraft:squid", createDefault(Squid))
            this.registerEntity("minecraft:stray", createDefault(Stray))
            this.registerEntity("minecraft:strider", createDefault(Strider))
            this.registerEntity("minecraft:tadpole", createDefault(Tadpole))
                // Text Display ,_,
                // TNT, only good for griefing stuff
                // TNT Minecart, finally a not so trash minecart
            this.registerEntity("minecraft:trader_llama", createDefault(TraderLlama))
                // Trident, kinda rare to drop
            this.registerEntity("minecraft:tropical_fish", createDefault(TropicalFish))
            this.registerEntity("minecraft:turtle", createDefault(Turtle))
            this.registerEntity("minecraft:vex", createDefault(Vex))
            this.registerEntity("minecraft:villager", createDefault(Villager))
            this.registerEntity("minecraft:vindicator", createDefault(Vindicator))
            this.registerEntity("minecraft:wandering_trader", createDefault(WanderingTrader))
            this.registerEntity("minecraft:warden", createDefault(Warden))
                // Wind Charge
            this.registerEntity("minecraft:witch", createDefault(Witch))
            this.registerEntity("minecraft:wither", createDefault(Wither))
            this.registerEntity("minecraft:wither_skeleton", createDefault(WitherSkeleton))
                // Wither Skull, without any wither ai? no way im implementing that
            this.registerEntity("minecraft:wolf", createDefault(Wolf))
            this.registerEntity("minecraft:zoglin", createDefault(Zoglin))
            this.registerEntity("minecraft:zombie", createDefault(Zombie))
            this.registerEntity("minecraft:zombie_horse", createDefault(ZombieHorse))
            this.registerEntity("minecraft:zombie_villager", createDefault(ZombieVillager))
            this.registerEntity("minecraft:zombified_piglon", createDefault(ZombiefiedPiglin))
                // Yeah, fishing bobber is the very last
    }

    public static registerEntity(identifier: string, factory: (position: Vector3, rotation: Vector2) => Entity) {
        Summon.entities.set(identifier, factory)
    }
}