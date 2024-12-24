import { Player } from "../player";

export interface Command {
    send(player: Player, command: string, args: string[]): boolean
}