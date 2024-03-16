import "dotenv/config";

export default {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX || "!",
  node: [
    {
      url: process.env.LAVALINK_URL || "localhost",
      auth: process.env.LAVALINK_PASSWORD || "youshallnotpass",
      name: process.env.LAVALINK_NAME || "Lavalink",
      secure: Boolean(process.env.LAVALINK_SECURE) || false
    }
  ],
  expressPort: Number(process.env.EXPRESS_PORT) || 4000,
  corsOptions: {
    origin: []
  }
};
