import { Message } from "discord.js";
import { KazagumoClient } from "../structures/Kazagumo";
import { Args, Command } from "../structures/Models";
import config from "../config";
import { checkForVoice } from "../utils/Utils";

export default {
  name: "play",
  description:
    "Search for a song to play or use a Youtube URL (playlists supported)",
  usage: `${config.prefix}play <url or search term>`,
  async run(message: Message, kazagumo: KazagumoClient, additionalArgs?: Args) {
    if (!checkForVoice(message)) return;

    const search = message.content.split(/\s+/).slice(1).join(" ");
    const player = await kazagumo.createPlayer({
      guildId: message.guildId!,
      textId: message.channelId,
      voiceId: message.member!.voice.channel!.id,
      volume: 20
    });

    const result = await kazagumo.search(search, { requester: message.author });
    if (!result.tracks.length) {
      message.channel.send("No results found!");
      return;
    }

    if (result.type === "PLAYLIST") {
      const singleTrackInPlaylistMatch = search.match(/index=(\d+)$/);

      if (singleTrackInPlaylistMatch) {
        const index = Number(singleTrackInPlaylistMatch[0].slice(6)) - 1;
        if (additionalArgs?.top) {
          player.queue.splice(0, 0, result.tracks[index]);
          console.log(`Queued ${result.tracks[index].title}`);
        } else {
          player.queue.add(result.tracks[index]);
          console.log(`Queued ${result.tracks[index].title}`);
        }
      } else {
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
      }
    } else {
      const timestampMatch = search.match(/t=(\d+)$/);
      if (timestampMatch)
        player.data.set(result.tracks[0].identifier, Number(timestampMatch[1]));

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
