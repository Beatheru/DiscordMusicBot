import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "resume",
  description: "Resumes the bot",
  usage: `${config.prefix}resume`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    player?.pause(false);
  }
} as Command;
