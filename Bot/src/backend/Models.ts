import { Response } from "express";
import { RawTrack } from "kazagumo";

export interface Client {
  id: number;
  res: Response;
}

export interface SongInfo {
  timestamp: number;
}

export interface CurrentSong {
  track: RawTrack | null | undefined;
  startTime: string;
}
