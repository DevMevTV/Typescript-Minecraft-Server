import { NetString } from "../../../datatypes";
import { Player } from "../../../player";
import { Command } from "../../../commands/command";
import { log } from "../../../logApi";

export class ChatCommand {
    private static commands = new Map<String, Command>

    public static handle(player: Player, buffer: Buffer) {
        let commands = NetString.decode(buffer, 1).value
        let splitted = commands.split(" ")
        let command = splitted[0]
        let args = splitted.slice(1)
        let fn: Command = ChatCommand.commands.get(command)

        log(player.player_entity.getName() + ": " + commands, "SERVER")

        var response = fn.send(player, command, args)        
    }

    public static register(command: string, fn: Command) {
        ChatCommand.commands.set(command, fn)
    }
}