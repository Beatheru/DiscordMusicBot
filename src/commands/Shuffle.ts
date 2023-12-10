import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "shuffle",
  description: "Shuffles the queue",
  usage: `${config.prefix}shuffle`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    player?.queue.shuffle();
  }
} as Command;
