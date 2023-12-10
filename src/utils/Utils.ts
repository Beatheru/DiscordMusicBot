import { Message } from "discord.js";

export const checkForVoice = (message: Message) => {
  const channel = message.member?.voice.channel;
  if (!channel) {
    message.channel.send("You must be in a voice channel to use this command!");
    return false;
  }

  return true;
};

export const msToTime = (duration: number): string => {
  duration = duration / 1000;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration - hours * 3600) / 60);
  const seconds = duration - hours * 3600 - minutes * 60;

  if (hours === 0) {
    if (minutes === 0) return seconds.toString();

    return minutes + (seconds < 10 ? ":0" : ":") + seconds;
  }

  return (
    hours +
    (minutes < 10 ? ":0" : ":") +
    minutes +
    (seconds < 10 ? ":0" : ":") +
    seconds
  );
};
