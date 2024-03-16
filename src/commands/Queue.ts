import { EmbedBuilder, Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice, msToTime } from "../utils/Utils";

export default {
  name: "queue",
  description: "Shows the current queue (up to 15 tracks)",
  usage: `${config.prefix}queue`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    if (!player || player.queue.length == 0) {
      return;
    }

    const embed = new EmbedBuilder();

    if (player.queue.length > 15) {
      for (let i = 0; i < 15; i++) {
        const duration = msToTime(player.queue[i].length!);
        embed.addFields({
          name: `${player.queue[i].title} - ${duration}`,
          value: `${player.queue[i].uri}`,
          inline: false
        });
      }
    } else {
      for (const track of player.queue) {
        const duration = msToTime(track.length!);
        embed.addFields({
          name: `${track.title} - ${duration}`,
          value: `${track.uri}`,
          inline: false
        });
      }
    }

    message.channel.send({ embeds: [embed] });
  }
} as Command;
