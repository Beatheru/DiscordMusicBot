import { Message } from "discord.js";
import { KazagumoClient } from "./Kazagumo";

export interface Command {
  name: string;
  description: string;
  usage: string;
  run(
    message: Message,
    kazagumo: KazagumoClient,
    additionalArgs?: Args
  ): Promise<void>;
}

export interface Args {
  top?: boolean;
}
