/**
 * Created by chris on 1/3/17.
 */

export type CardState =
 | "FRESH" | "GUESSED" | "SUGGESTED";

export type CardColor =
 | "RED" | "BLUE" | "BROWN" | "BLACK";

export type Card = {
  word: string,
  state: CardState,
  color: CardColor
}
