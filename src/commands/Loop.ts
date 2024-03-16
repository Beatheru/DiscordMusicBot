import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "loop",
  description: "Set the bot to loop the current song, the queue, or none",
  usage: `${config.prefix}loop <none | track | queue>`,
  async run(message: Message, kazagumo: KazagumoClient) {
    if (!checkForVoice(message)) return;

    const player = kazagumo.getPlayer(message.guildId!);
    const loopMode = message.content.split(/\s+/)[1];

    if (loopMode === "none" || loopMode === "track" || loopMode === "queue") {
      console.log("Setting loop to", loopMode);
      player?.setLoop(loopMode);
    } else {
      message.channel.send("Loop mode must be one of <none | track | queue>");
    }
  }
} as Command;
