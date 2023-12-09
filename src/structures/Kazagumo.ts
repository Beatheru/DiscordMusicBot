import { Connectors } from "shoukaku";
import { DiscordClient } from "./Client";
import config from "../config";
import { Kazagumo } from "kazagumo";

export class KazagumoClient extends Kazagumo {
  public client: DiscordClient;
  constructor(client: DiscordClient) {
    super(
      {
        defaultSearchEngine: "youtube",
        send: (guildId, payload) => {
          const guild = client.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        }
      },
      new Connectors.DiscordJS(client),
      config.node
    );

    this.client = client;

    this.shoukaku.on("ready", () => console.log(`Lavalink: Ready!`));

    this.shoukaku.on("error", (_, error) =>
      console.error(`Lavalink: Error Caught,`, error)
    );

    this.shoukaku.on("close", (_, code, reason) =>
      console.warn(
        `Lavalink: Closed, Code ${code}, Reason ${reason || "No reason"}`
      )
    );

    this.shoukaku.on("debug", (_, info) =>
      console.debug(`Lavalink: Debug,`, info)
    );

    this.shoukaku.on("disconnect", (_, players, moved) => {
      if (moved) return;
      players.map((player) => player.connection.disconnect());
      console.warn(`Lavalink: Disconnected`);
    });

    this.on("playerStart", (player, track) => {
      console.log(`Now playing ${track.title} by ${track.author}`);
    });

    /* this.on("playerEnd", (player) => {}); */

    this.on("playerEmpty", (player) => {
      player.destroy();
    });
  }
}
