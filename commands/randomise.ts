import { PLAYERS_ROLES_ID } from "../config.json";
import {
  Collection,
  GuildMember,
  TextChannel,
  VoiceChannel,
  Role,
} from "discord.js";
import Player from "../types/Players";
import Roles from "../types/Roles";

export default function randomise(
  textChannel: TextChannel,
  rawRoles: Array<string>,
  voiceChannel?: VoiceChannel
) {
  if (voiceChannel) {
    const processedRoles: Roles = understandRoles(rawRoles);
    const allMembers = voiceChannel.members;
    const players: Array<GuildMember> = fetchMembers(allMembers);
    let god: any = findGod(allMembers);

    const allRoles = processedRoles.allRoles();
    const result = shuffle(allRoles, players);
    if (!result || result.length === 0) {
      god.send("Number of roles and players not matching!");
      return;
    }

    // Sending preview to corresponding textChannel
    textChannel.send(processedRoles.toString());

    // Sending players and Roles to !  GOD
    god.send(
      Player.arrayToString(result) + "-----------------------------------"
    );

    // Sending roles to corresponding players
    result.forEach(async (element) => {
      try {
        await element.guildMember.send(
          element.role + "\n-----------------------------------"
        );
      } catch (error) {
        await god.send(
          "Player " +
            element.guildMember.nickname +
            " didn't get his role: " +
            element.role +
            " !"
        );
      }
    });
  }
}

/**
 * This function tries to get and classify all the roles specified in the arguments of the randomise command!
 * @param rawRoles
 * @returns
 */
function understandRoles(rawRoles: Array<string>): Roles {
  const city = [];
  const mafia = [];
  const maverick = [];
  var index = 1;

  if (rawRoles[0] == "Mafia" || rawRoles[0] == "mafia") {
    while (
      rawRoles[index] != "city" &&
      rawRoles[index] != "City" &&
      rawRoles[index] != "shahr" &&
      rawRoles[index] != "Shahr"
    ) {
      mafia.push(rawRoles[index]);
      index++;
    }
    index++;
    while (
      rawRoles[index] != "Maverick" &&
      rawRoles[index] != "maverick" &&
      index != rawRoles.length
    ) {
      city.push(rawRoles[index]);
      index++;
    }
  }

  if (
    rawRoles[0] == "City" ||
    rawRoles[0] == "city" ||
    rawRoles[0] == "Shahr" ||
    rawRoles[0] == "shahr"
  ) {
    while (rawRoles[index] != "Mafia" && rawRoles[index] != "mafia") {
      city.push(rawRoles[index]);
      index++;
    }
    index++;
    while (
      rawRoles[index] != "Maverick" &&
      rawRoles[index] != "maverick" &&
      index != rawRoles.length
    ) {
      mafia.push(rawRoles[index]);
      index++;
    }
  }

  if (index != rawRoles.length) {
    index++;
    for (let i = index; i < rawRoles.length; i++) {
      maverick.push(rawRoles[i]);
    }
  }
  const roles = new Roles();
  roles.city = city;
  roles.mafia = mafia;
  roles.maverick = maverick;

  return roles;
}

function findGod(allMembers: Collection<string, GuildMember>) {
  let god: GuildMember | null = null;

  allMembers.forEach((member) => {
    if (member.nickname === "!  GOD") {
      god = member;
      return;
    }
  });

  return god;
}

function fetchMembers(
  allMembers: Collection<string, GuildMember>
): Array<GuildMember> {
  let members: Array<GuildMember> = [];

  allMembers.forEach((member) => {
    if (member.nickname?.charAt(0) == "!" && member.nickname !== "!  GOD") {
      members.push(member);
    }
  });

  return members;
}

function fetchMemebrsRoles(
  textChannel: TextChannel,
  players: Array<GuildMember>
) {
  if (!PLAYERS_ROLES_ID || PLAYERS_ROLES_ID.length == 0) {
    return;
  }

  let customRole = textChannel.guild.roles.cache.get(PLAYERS_ROLES_ID);

  let withRoleMembers: Array<GuildMember> = [];

  customRole?.members.forEach((member) => {
    withRoleMembers.push(member);
  });

  withRoleMembers.forEach((member) => {
    member.roles.remove([PLAYERS_ROLES_ID]).catch(console.error);
  });

  players.forEach((member) => {
    member.roles.set([PLAYERS_ROLES_ID]).catch(console.error);
  });
}

function shuffle(
  roles: Array<string>,
  players: Array<GuildMember>
): Array<Player> {
  if (roles.length < players.length) {
    return [];
  }

  if (players.length < roles.length) {
    return [];
  }

  let currentIndex = roles.length,
    randomIndex;

  currentIndex = players.length;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [players[currentIndex], players[randomIndex]] = [
      players[randomIndex],
      players[currentIndex],
    ];
  }

  const result: Array<Player> = [];
  for (let i = 0; i < roles.length; i++) {
    result.push(new Player(players[i], roles[i]));
  }

  return result;
}
