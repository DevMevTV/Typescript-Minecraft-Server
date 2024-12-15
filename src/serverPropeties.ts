// code to import and access server settings

export class server {
  public static serverName: string = "DevCraft ;3";   // Shouldnt be changeable by the user
  public static MOTD: string;
  public static serverAdress: string;
  public static serverPort: number;
  public static protocolVersion: number = 768;        // Shouldnt be changeable by the user
  public static maxPlayers: number;

  public constructor(file: string) {
    const defaultSettings = require(file);
    server.MOTD = defaultSettings.MOTD;
    server.serverAdress = defaultSettings.Server;
    server.serverPort = defaultSettings.Port;
    server.maxPlayers = defaultSettings.MaxPlayers;
  }
}
