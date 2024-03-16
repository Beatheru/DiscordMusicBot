import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Command } from "../structures/Models";
import config from "../utils/Config";
import Play from "./Play";

export default {
  name: "playtop",
  description:
    "If the bot is already playing, queue the next song at the front of the queue",
  usage: `${config.prefix}playtop <url or search term>`,
  async run(message: Message, kazagumo: KazagumoClient) {
    Play.run(message, kazagumo, { top: true });
  }
} as Command;
