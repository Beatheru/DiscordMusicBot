import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "skip",
  description: "Skip the current song",
  usage: `${config.prefix}skip`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    player?.skip();
  }
} as Command;
