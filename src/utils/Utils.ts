import { Message } from "discord.js";

export const checkForVoice = (message: Message) => {
  const channel = message.member?.voice.channel;
  if (!channel) {
    message.channel.send("You must be in a voice channel to use this command!");
    return false;
  }

  return true;
};
