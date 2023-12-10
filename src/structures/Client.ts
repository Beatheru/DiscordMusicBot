import { Client, ClientOptions, Collection, Events } from "discord.js";
import fs from "fs";
import path from "path";
import config from "../config";
import { Command } from "./Models";
import { KazagumoClient } from "./Kazagumo";

export class DiscordClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public kazagumo: KazagumoClient;

  constructor(options: ClientOptions) {
    super(options);
    this.kazagumo = new KazagumoClient(this);
    this.login(config.token);
    this.registerCommands();

    this.once(Events.ClientReady, () => {
      console.log("Client ready!");
    });

    this.on(Events.MessageCreate, async (message) => {
      if (message.content.startsWith(config.prefix)) {
        const commandName = message.content
          .split(/\s+/)[0]
          .toLowerCase()
          .substring(1);
        const command = this.commands.get(commandName);
        if (!command) {
          message.channel.send(`No command matching ${commandName} was found.`);
          return;
        }

        try {
          message.delete();
          await command.run(message, this.kazagumo);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  async registerCommands() {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      this.commands.set(command.default.name, command.default);
    }
  }
}
