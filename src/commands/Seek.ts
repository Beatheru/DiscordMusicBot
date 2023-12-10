import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "seek",
  description: "Seek to the position of the track in seconds",
  usage: `${config.prefix}seek <seconds>`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    const position = parseInt(message.content.split(/\s+/)[1]);

    if (!isNaN(position)) {
      player?.seek(position * 1000);
    }
  }
} as Command;
