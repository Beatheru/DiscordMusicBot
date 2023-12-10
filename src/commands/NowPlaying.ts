import { EmbedBuilder, Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../config";
import { checkForVoice, msToTime } from "../utils/Utils";

export default {
  name: "np",
  description: "Shows the current song that's playing",
  usage: `${config.prefix}np`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);

    if (player && player.queue.current) {
      const currentTrack = player.queue.current;
      const embed = new EmbedBuilder();

      embed.addFields({
        name: `${currentTrack.title} - ${msToTime(currentTrack.length!)}`,
        value: `${currentTrack.uri}`,
        inline: false
      });

      message.channel.send({ embeds: [embed] });
    }
  }
} as Command;
