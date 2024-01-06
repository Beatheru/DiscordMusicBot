import { useState, useEffect, useMemo } from "react";
import { Track } from "erela.js";
import {
  ListResponse,
  addSong,
  clearQueue,
  getSongList,
  joinTVW,
  stopPlayer,
  searchResults,
} from "./api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SongCard from "./components/SongCard";
import { Autocomplete } from "@mui/material";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"; */
import { debounce } from "@mui/material/utils";
import { useParams } from "react-router-dom";

export default function App() {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<readonly Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { guildId } = useParams();

  console.log(guildId);

  const fetch = useMemo(
    () =>
      debounce(
        (
          searchText: string,
          callback: (results?: readonly Track[]) => void,
        ) => {
          searchResults({ searchText }).then((res) => {
            callback(res.data.tracks);
          });
        },
        300,
      ),
    [],
  );

  const queryClient = useQueryClient();
  const { isSuccess, data, refetch } = useQuery({
    queryKey: ["songs"],
    queryFn: getSongList,
  });

  const addSongMutation = useMutation({
    mutationFn: addSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: stopPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  useEffect(() => {
    const events = new EventSource("http://music.beatheru.cc:6970/api/sse");
    //const events = new EventSource("http://localhost:6970/api/sse");
    events.onmessage = () => {
      refetch();
    };
  }, [refetch]);

  useEffect(() => {
    if (search == "") {
      setOptions([]);
    }
  }, [search]);

  const validData = (data: ListResponse) => {
    if (data.songList && data.currentSong && data.currentSongStartTime)
      return true;
    return false;
  };

  let currentSong = null;
  let songList = null;

  if (isSuccess && validData(data)) {
    currentSong = (
      <SongCard
        song={data.currentSong}
        index={-1}
        startTime={data.currentSongStartTime}
        isCurrentSong={true}
      />
    );

    songList = (
      <div>
        {data.songList.map((song: Track, index: number) => {
          return <SongCard key={Math.random()} song={song} index={index} />;
        })}
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    addSongMutation.mutate({ url: search });
    setSearch("");
  }

  function handleSearch(searchText: string) {
    setSearch(searchText);
    if (searchText.length > 1) {
      setLoading(true);

      fetch(searchText, (res) => {
        setLoading(false);
        setOptions(res!);
      });
    }
  }

  function handleClick(event: React.MouseEvent, url: string) {
    event.stopPropagation();
    addSongMutation.mutate({ url });
    setSearch("");
    setOptions([]);
  }

  return (
    <div className="mt-20 flex flex-col items-center">
      <form noValidate onSubmit={handleSubmit}>
        <Autocomplete
          freeSolo
          options={options}
          loading={loading}
          filterOptions={(x) => x}
          open={search.length > 1}
          noOptionsText="No results"
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.title
          }
          renderInput={(params) => (
            <div ref={params.InputProps.ref} className="relative">
              <input
                {...params.inputProps}
                type="text"
                className="mb-3 w-[600px] rounded-lg border border-white bg-transparent p-4 pl-10 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Search"
                value={search}
                onChange={(event) => handleSearch(event?.target.value)}
              />
              <button hidden type="submit"></button>
            </div>
          )}
          renderOption={(props, option) => {
            return (
              <li
                {...props}
                key={Math.random()}
                onClick={(event) => {
                  handleClick(event, option.uri);
                }}
              >
                <img className="mr-3 w-[75px]" src={option.thumbnail!} />
                <span>{option.title}</span>
              </li>
            );
          }}
        />
      </form>
      <div className="absolute right-5 top-5 flex flex-col">
        <button className="button" onClick={() => clearMutation.mutate()}>
          Clear
        </button>
        <button className="button" onClick={() => stopMutation.mutate()}>
          Stop
        </button>
      </div>
      <div className="absolute left-5 top-5">
        <button className="button" onClick={() => joinTVW()}>
          Join TVW
        </button>
      </div>
      {currentSong}
      {songList}
    </div>
  );
}
