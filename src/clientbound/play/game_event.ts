import { Float, VarInt } from "../../datatypes";
import { Player } from "../../player";

export enum GameEvents {
    NoRespawnBlockAvailable = 0,
    BeginRaining = 1,
    EndRaining = 2,
    ChangeGameMode = 3,
    WinGame = 4,
    DemoEvent = 5,
    ArrowHitPlayer = 6,
    RainLevelChange = 7,
    ThunderLevelChange = 8,
    PlayPufferFishStingSound = 9,
    PlayElderGuardianModAppearance = 10,
    EnableRespawnScreen = 11,
    LimitedCrafting = 12,
    StartWaitingForLevelChunks = 13
}

export class GameEvent {
    public static send(player: Player, event: GameEvents, value: number) {
        const response_data = Buffer.concat([
            Buffer.from([event]),
            Float.encode(value)
        ])

        const response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x23]),
            response_data
        ])

        player.client().write(response)
    }
}