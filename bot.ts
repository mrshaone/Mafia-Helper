import { token } from "./config.json";
import {
  Client,
  Intents,
  Message,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";
import randomise from "./commands/randomise";

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

const PREFIX = "%";

client.once("ready", async () => {
  console.log("Ready!");
});

client.on("messageCreate", (message: Message) => {
  const user = message.author;
  
  if (!message.content.startsWith(PREFIX) || message.member?.nickname != "!  GOD") {
    return;
  }

  const [CMD_NAME, ...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(" ");

  const member = message.member;
  const voiceChannel = member?.voice.channel;
  const textChannel = message.channel;

  message.delete();
  if (CMD_NAME === "randomise" || CMD_NAME === "Randomise") {
    randomise(textChannel as TextChannel, args, voiceChannel as VoiceChannel);
  } else {
    textChannel.send("Oh sth went wrong!");
  }
});

client.login(token);

export default client;
