/**
 * Created by chris on 1/3/17.
 */

export type User = {
  id: number,
  username: string,
};

export type Team =
 | "RED" | "BLUE";

export type Role =
 | "GIVER" | "GUESSER";

export function createPlayerFromUser (user: User) {
  return {
    user: user,
    team: "RED",
    role: "GIVER"
  }
}
export type Player = {
  user: User,
  team: Team,
  role: Role
};
