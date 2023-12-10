import { EmbedBuilder, Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../config";

export default {
  name: "help",
  description: "Shows list of commands",
  usage: `${config.prefix}help`,
  async run(message: Message, kazagumo: KazagumoClient) {
    const commands = kazagumo.client.commands;
    const embed = new EmbedBuilder();

    for (const [name, command] of commands) {
      embed.addFields({
        name: `${config.prefix}${name}`,
        value: `${command.description} \n Usage: ${command.usage}`,
        inline: false
      });
    }

    message.channel.send({ embeds: [embed] });
  }
} as Command;
