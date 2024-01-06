import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "stop",
  description: "Stops playing and disconnects the bot",
  usage: `${config.prefix}stop`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    player?.destroy();
  }
} as Command;
