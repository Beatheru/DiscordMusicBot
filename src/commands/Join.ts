import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "join",
  description: "Joins the voice channel of the caller",
  usage: `${config.prefix}join`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    if (!player) {
      await kazagumo.createPlayer({
        guildId: message.guildId!,
        textId: message.channelId,
        voiceId: message.member!.voice.channel!.id,
        volume: 20
      });
    }
  }
} as Command;
