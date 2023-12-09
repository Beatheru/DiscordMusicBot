import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Args, Command } from "../structures/Models";
import config from "../config";

export default {
  name: "play",
  description:
    "Search for a song to play or use a Youtube URL (playlists supported)",
  usage: `${config.prefix}play <url or search term>`,
  async run(message: Message, kazagumo: KazagumoClient, additionalArgs?: Args) {
    const channel = message.member?.voice.channel;
    if (!channel) {
      message.channel.send(
        "You must be in a voice channel to use this command!"
      );
      return;
    }

    const search = message.content.split(/\s+/).slice(1).join(" ");
    const player = await kazagumo.createPlayer({
      guildId: message.guild!.id,
      textId: message.channel.id,
      voiceId: channel.id,
      volume: 30
    });

    const result = await kazagumo.search(search, { requester: message.author });
    if (!result.tracks.length) {
      message.channel.send("No results found!");
      return;
    }

    if (result.type === "PLAYLIST") {
      if (additionalArgs?.top) {
        result.tracks.forEach((track) => {
          player.queue.splice(0, 0, track);
          console.log(`Queued ${track.title} from ${result.playlistName}`);
        });
      } else {
        result.tracks.forEach((track) => {
          player.queue.add(track);
          console.log(`Queued ${track.title} from ${result.playlistName}`);
        });
      }
    } else {
      if (additionalArgs?.top) {
        player.queue.splice(0, 0, result.tracks[0]);
        console.log(`Queued ${result.tracks[0].title}`);
      } else {
        player.queue.add(result.tracks[0]);
        console.log(`Queued ${result.tracks[0].title}`);
      }
    }

    if (!player.playing && !player.paused) player.play();
  }
} as Command;
