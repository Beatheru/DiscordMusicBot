import axios from "axios";
import { Track } from "erela.js";

export const api = axios.create({
  baseURL: "http://music.beatheru.cc:6970/api",
  //baseURL: "http://localhost:6970/api",
});

export interface ListResponse {
  songList: Track[];
  currentSong: Track;
  currentSongStartTime: number;
}

export const getSongList = async (): Promise<ListResponse> => {
  const res = await api.get("/list");
  return res.data;
};

export const addSong = (url: object) => {
  return api.post("/play", url);
};

export const playSongNow = (index: object) => {
  return api.post("/now", index);
};

export const removeSong = (index: object) => {
  return api.post("/remove", index);
};

export const swapSong = (data: object) => {
  return api.post("/swap", data);
};

export const stopPlayer = () => {
  return api.post("/stop");
};

export const clearQueue = () => {
  return api.post("/clear");
};

export const joinTVW = () => {
  return api.post("/joinTVW");
};

export const searchResults = (searchText: object) => {
  return api.post("/search", searchText);
};
