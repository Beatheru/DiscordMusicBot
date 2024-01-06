import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "clear",
  description: "Clears the queue",
  usage: `${config.prefix}clear`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    player?.queue.clear();
  }
} as Command;
