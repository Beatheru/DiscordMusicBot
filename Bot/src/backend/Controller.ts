import { Request, Response } from "express";
import { Client, CurrentSong } from "./Models";
import { Kazagumo } from "kazagumo";
import { updateClients } from "../utils/Utils";

export const list = (req: Request, res: Response) => {
  const kazagumo: Kazagumo = req.body.kazagumo;
  const player = kazagumo.getPlayer(req.params.guildID);
  if (!player) return res.status(400).send("No player");

  const currentSong: CurrentSong = {
    track: player.queue.current?.getRaw(),
    startTime: player.data.get("currentTrackStartTime")
  };

  return res.json({
    songList: player.queue.map((track) => track.getRaw()),
    currentSong: currentSong.track,
    currentSongStartTime: currentSong.startTime
  });
};

export const play = async (req: Request, res: Response) => {
  const kazagumo: Kazagumo = req.body.kazagumo;
  const player = kazagumo.getPlayer(req.params.guildID);
  if (!player) return res.status(400).send("No player");

  const search: string = req.body.search;
  const result = await kazagumo.search(search);
  if (!result.tracks.length) {
    return res.status(404).send("No tracks found");
  }

  if (result.type === "PLAYLIST") {
    const singleTrackInPlaylistMatch = search.match(/index=(\d+)$/);
    if (singleTrackInPlaylistMatch) {
      const index = Number(singleTrackInPlaylistMatch[0].slice(6)) - 1;

      player.queue.add(result.tracks[index]);
      console.log(`Queued ${result.tracks[index].title}`);
    } else {
      result.tracks.forEach((track) => {
        player.queue.add(track);
        console.log(`Queued ${track.title} from ${result.playlistName}`);
      });
    }
  } else {
    const timestampMatch = search.match(/t=(\d+)$/);
    if (timestampMatch)
      player.data.set(result.tracks[0].identifier, Number(timestampMatch[1]));

    player.queue.add(result.tracks[0]);
    console.log(`Queued ${result.tracks[0].title}`);
  }

  if (!player.playing && !player.paused) player.play();

  return res.send();
};

export const now = (req: Request, res: Response) => {
  const kazagumo: Kazagumo = req.body.kazagumo;
  const player = kazagumo.getPlayer(req.params.guildID);
  if (!player) return res.status(400).send("No player");

  const index: number = req.body.index;

  const currentSong = player.queue.current!;
  const playTrack = player.queue[index];

  player.queue.splice(index, 1, currentSong);
  player.queue.splice(0, 0, playTrack);
  player.skip();

  return res.send();
};

export const swap = (req: Request, res: Response) => {
  const kazagumo: Kazagumo = req.body.kazagumo;
  const player = kazagumo.getPlayer(req.params.guildID);
  if (!player) return res.status(400).send("No player");

  const startIndex: number = req.body.startIndex;
  const endIndex: number = req.body.endIndex;

  const startSong = player.queue[startIndex];
  const endSong = player.queue[endIndex];

  player.queue.splice(startIndex, 1, endSong);
  player.queue.splice(endIndex, 1, startSong);

  updateClients();
  return res.send();
};

export const remove = (req: Request, res: Response) => {
  const kazagumo: Kazagumo = req.body.kazagumo;
  const player = kazagumo.getPlayer(req.params.guildID);
  if (!player) return res.status(400).send("No player");

  const index: number = req.body.index;

  if (index === -1) {
    player.skip();
    updateClients();
    return res.send();
  }

  player.queue.splice(index, 1);
  updateClients();
  return res.send();
};

export const stop = async (req: Request, res: Response) => {
  const kazagumo: Kazagumo = req.body.kazagumo;
  const player = kazagumo.getPlayer(req.params.guildID);
  if (!player) return res.status(400).send("No player");

  player.destroy();
  return res.send();
};

export const clear = async (req: Request, res: Response) => {
  const kazagumo: Kazagumo = req.body.kazagumo;
  const player = kazagumo.getPlayer(req.params.guildID);
  if (!player) return res.status(400).send("No player");

  player.queue.clear();
  return res.send();
};

export let clients: Client[] = [];

export const sse = async (req: Request, res: Response) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive"
  });
  res.flushHeaders();

  const clientId = Date.now();

  clients.push({
    id: Date.now(),
    res
  });

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client: Client) => client.id !== clientId);
  });
};

// Redo without player dependence
export const search = async (req: Request, res: Response) => {
  const kazagumo: Kazagumo = req.body.kazagumo;
  const player = kazagumo.getPlayer(req.params.guildID);
  if (!player) return res.status(400).send("No player");

  const searchText: string = req.body.searchText;
  const result = await player.search(searchText);

  return res.json({
    loadType: result.type,
    playlist: result.playlistName,
    tracks: result.tracks.map((track) => track.getRaw())
  });
};
