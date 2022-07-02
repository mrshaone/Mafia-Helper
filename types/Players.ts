import { GuildMember } from "discord.js";

export default class Player{
    guildMember: GuildMember;
    role: string;

    constructor(guildMember: GuildMember, role: string){
        this.guildMember = guildMember;
        this.role = role;
    }

    toString(): string{
        return this.role + ": " + this.guildMember.nickname;
    }

    static arrayToString(array: Array<Player>){
        let str = "";

        array.forEach(el => str += el.toString() + "\n");
        return str;
    }
}