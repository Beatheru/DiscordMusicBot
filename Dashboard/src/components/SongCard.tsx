import { Track } from "erela.js";
import ProgressBar from "./ProgressBar";
import { Clear } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playSongNow, removeSong, swapSong } from "../api/api";
import { DragEvent, MouseEvent } from "react";
interface SongProps {
  song: Track;
  index: number;
  startTime?: number;
  isCurrentSong?: boolean;
}

export default function SongCard(props: SongProps) {
  const { song, index, startTime, isCurrentSong } = props;
  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: removeSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  const playSongNowMutation = useMutation({
    mutationFn: playSongNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  const swapSongMutation = useMutation({
    mutationFn: swapSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  const msToTime = (duration: number): string => {
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

  const handleClick = () => {
    if (!isCurrentSong) {
      playSongNowMutation.mutate({ index });
    }
  };

  const handleRemove = (event: MouseEvent) => {
    event.stopPropagation();
    removeMutation.mutate({ index });
  };

  const dragStart = (event: DragEvent) => {
    event.dataTransfer?.setData("startIndex", String(index));
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    const startIndex = Number(event.dataTransfer?.getData("startIndex"));
    if (index === -1) {
      playSongNowMutation.mutate({ index: startIndex });
    } else if (startIndex !== index) {
      swapSongMutation.mutate({ startIndex, endIndex: index });
    }
  };

  let progressBar = null;
  if (isCurrentSong)
    progressBar = (
      <ProgressBar duration={song.duration} startTime={startTime!} />
    );

  return (
    <div
      onClick={handleClick}
      className="group mb-2.5 flex rounded-md border border-neutral-700 bg-black duration-200 hover:scale-105"
      draggable
      onDragStart={dragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col justify-center">
        <img className="w-[150px] rounded-l-md" src={song.thumbnail!} />
      </div>
      <div className="ml-3 mt-3 flex h-full w-[450px] flex-col">
        <div className="text-xl">{song.title}</div>
        <div className="text-sm text-gray-500">
          {song.author} - {msToTime(song.duration)}
        </div>
        <div className="mb-5 mt-4">{progressBar}</div>
      </div>
      <div
        onClick={handleRemove}
        className="invisible mb-auto ml-2 mr-2 mt-auto rounded-full text-red-700 hover:bg-neutral-900 group-hover:visible"
      >
        <Clear sx={{ width: "30px", height: "30px" }} />
      </div>
    </div>
  );
}
