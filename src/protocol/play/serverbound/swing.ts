import { Player } from "../../../player";
import { EntityAnimations } from "../clientbound/entity_animations";

export class SwingArm {
    public static handle(player: Player, buffer: Buffer) {
        EntityAnimations.send(player, 0)
    }
}