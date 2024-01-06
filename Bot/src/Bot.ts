import { GatewayIntentBits } from "discord.js";
import { DiscordClient } from "./structures/Client";

export const Client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});
