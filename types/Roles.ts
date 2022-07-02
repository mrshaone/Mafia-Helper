export default class Roles {
  city: Array<string> = [];
  mafia: Array<string> = [];
  maverick: Array<string> = [];

  toString(): string {
    let str = "";
    str += "Mafia: \n";
    this.mafia.forEach((obj) => (str += obj + " \n"));

    str += "\nCity: \n";

    this.city.forEach((obj) => (str += obj + " \n"));

    if (this.maverick.length != 0) {
      str += "\nMaverick: \n";
      this.maverick.forEach((obj) => (str += obj + " \n"));
    }

    str += "\n\n";
    return str;
  }

  count(): number {
    return this.city.length + this.mafia.length + this.maverick.length;
  }

  allRoles(): Array<string> {
    const allRoles: Array<string> = [];
    this.mafia.forEach((el) => allRoles.push(el));
    this.city.forEach((el) => allRoles.push(el));
    this.maverick.forEach((el) => allRoles.push(el));

    return allRoles;
  }
}
