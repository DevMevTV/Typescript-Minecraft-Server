import { Socket } from "net";
import { log, error } from "../logApi";
import { VERSION, PROTOCOL_VERSION, MAX_PLAYERS, MOTD } from "../config";

export const handleLegacyPing = (socket: Socket) => {
    const protocolVersion = PROTOCOL_VERSION;
    const serverVersion = VERSION;
    const motd = MOTD;
    const currentPlayers = 10;
    const maxPlayers = MAX_PLAYERS;
  
    const responseString = `§1\0${protocolVersion}\0${serverVersion}\0${motd}\0${currentPlayers}\0${maxPlayers}`;
  
    const utf16Response: number[] = [];
    for (const char of responseString) {
      const codeUnit = char.charCodeAt(0);
      utf16Response.push((codeUnit >> 8) & 0xff, codeUnit & 0xff);
    }
  
    const length = utf16Response.length / 2;
    const response = Buffer.concat([
      Buffer.from([0xff]),
      Buffer.from([(length >> 8) & 0xff, length & 0xff]),
      Buffer.from(utf16Response),
    ]);
  
    socket.write(response, (err) => {
      if (err) {
        error("Failed to send legacy ping response: " + err, "SERVER");
      } else {
        log("Final packet buffer: " + response, "SERVER");
        log("Legacy ping response sent!", "SERVER");
      }
    });
  };